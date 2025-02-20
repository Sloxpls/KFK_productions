import os
from flask import Blueprint, jsonify, request, current_app, send_file
from werkzeug.utils import secure_filename
import mimetypes

from backend.database_models import Media, db
from backend.utils.token_validator import token_required

MEDIA_FOLDER = os.environ.get("MEDIA_FOLDER", "/app/media_uploads")

media_bp = Blueprint('media_bp', __name__)


@media_bp.route('/media', methods=['GET'])
@token_required
def get_media():
    media_items = Media.query.all()
    results = [
        {
            'id': item.id,
            'name': item.name,
            'file_path': item.file_path,
            'description': item.description,
            'uploaded_at': item.uploaded_at
        }
        for item in media_items
    ]
    return jsonify(results), 200


@media_bp.route('/media', methods=['POST'])
@token_required
def create_media():
    try:
        name = request.form.get('name')
        description = request.form.get('description')
        media_file = request.files.get('file')

        missing_fields = []
        if name is None:
            missing_fields.append('name')
        if media_file is None:
            missing_fields.append('file')

        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400

        media_filename = secure_filename(media_file.filename)
        media_file.save(os.path.join(MEDIA_FOLDER, media_filename))
        filepath = os.path.join(MEDIA_FOLDER, media_filename)

        new_media = Media(
            name=name,
            file_path=media_filename,
            description=description
        )
        db.session.add(new_media)
        db.session.commit()
        return jsonify({
            'message': 'Media created successfully!',
            'id': new_media.id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error uploading song: {e}")
        return jsonify({
            'error': 'An error occurred while uploading the song'
        }), 500


@media_bp.route('/media/<int:media_id>', methods=['GET'])
@token_required
def get_media_item(media_id):
    media_item = Media.query.get(media_id)
    if not media_item:
        return jsonify({'message': 'Media not found'}), 404

    return jsonify({
        'id': media_item.id,
        'name': media_item.name,
        'file_path': media_item.file_path,
        'description': media_item.description,
        'uploaded_at': media_item.uploaded_at
    }), 200


@media_bp.route('/media/<int:media_id>', methods=['PUT'])
@token_required
def update_media(media_id):
    media_item = Media.query.get(media_id)
    if not media_item:
        return jsonify({'message': 'Media not found'}), 404

    data = request.get_json() or {}
    media_item.name = data.get('name', media_item.name)
    media_item.file_path = data.get('file_path', media_item.file_path)
    media_item.description = data.get('description', media_item.description)

    db.session.commit()
    return jsonify({'message': f'Media {media_id} updated successfully'}), 200


@media_bp.route('/media/<int:media_id>', methods=['DELETE'])
@token_required
def delete_media(media_id):
    try:
        media_item = Media.query.get(media_id)
        if not media_item:
            return jsonify({'error': 'Media not found'}), 404

        file_path = os.path.join(MEDIA_FOLDER, media_item.file_path)

        if os.path.exists(file_path):
            os.remove(file_path)

        db.session.delete(media_item)
        db.session.commit()

        return jsonify({
            'message': f'Media {media_id} and associated file deleted successfully'
        }), 200

    except OSError as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting file: {e}")
        return jsonify({
            'error': 'Failed to delete file',
            'details': str(e)
        }), 500

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting media: {e}")
        return jsonify({
            'error': 'An error occurred while deleting the media'
        }), 500


@media_bp.route("/media/<int:media_id>/serve", methods=["GET"])
@token_required
def serve_media(media_id):
    media_item = Media.query.get(media_id)
    if not media_item or not media_item.file_path:
        return jsonify({'error': 'Media not found'}), 404

    try:
        mime_type, _ = mimetypes.guess_type(media_item.file_path)
        if not mime_type:
            mime_type = 'application/octet-stream'

        full_path = os.path.join(MEDIA_FOLDER, media_item.file_path)

        return send_file(
            full_path,
            mimetype=mime_type
        )
    except Exception as e:
        current_app.logger.error(f"Error streaming media: {e}")
        return jsonify({'error': 'File not found on server'}), 404


@media_bp.route('/media/<int:media_id>/download', methods=['GET'])
@token_required
def download_media(media_id):
    media_item = Media.query.get(media_id)
    if not media_item or not media_item.file_path:
        return jsonify({'error': 'Media not found'}), 404

    full_path = os.path.join(MEDIA_FOLDER, media_item.file_path)
    file_name = os.path.basename(media_item.file_path)

    try:
        return send_file(
            full_path,
            as_attachment=True,
            download_name=os.path.basename(media_item.file_path)
        )
    except Exception as e:
        current_app.logger.error(f"Error downloading media: {e}")
        return jsonify({'error': 'File not found on server'}), 404