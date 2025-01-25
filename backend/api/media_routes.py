from flask import Blueprint, jsonify, request
from backend.database_models import Media, db
media_bp = Blueprint('media_bp', __name__)

@media_bp.route('/media', methods=['GET'])
def get_media():
    media_items = Media.query.all()
    results = [
        {
            'id': item.id,
            'filename': item.filename,
            'file_path': item.file_path,
            'description': item.description,
            'uploaded_at': item.uploaded_at
        }
        for item in media_items
    ]
    return jsonify(results), 200

@media_bp.route('/media', methods=['POST'])
def create_media():
    data = request.get_json() or {}
    if not data.get('filename') or not data.get('file_path'):
        return jsonify({'error': 'Filename and file_path are required'}), 400

    new_media = Media(
        filename=data.get('filename'),
        file_path=data.get('file_path'),
        description=data.get('description')
    )
    db.session.add(new_media)
    db.session.commit()
    return jsonify({'message': 'Media created successfully!', 'id': new_media.id}), 201

@media_bp.route('/media/<int:media_id>', methods=['GET'])
def get_media_item(media_id):
    media_item = Media.query.get(media_id)
    if not media_item:
        return jsonify({'message': 'Media not found'}), 404

    return jsonify({
        'id': media_item.id,
        'filename': media_item.filename,
        'file_path': media_item.file_path,
        'description': media_item.description,
        'uploaded_at': media_item.uploaded_at
    }), 200

@media_bp.route('/media/<int:media_id>', methods=['PUT'])
def update_media(media_id):
    media_item = Media.query.get(media_id)
    if not media_item:
        return jsonify({'message': 'Media not found'}), 404

    data = request.get_json() or {}
    media_item.filename = data.get('filename', media_item.filename)
    media_item.file_path = data.get('file_path', media_item.file_path)
    media_item.description = data.get('description', media_item.description)

    db.session.commit()
    return jsonify({'message': f'Media {media_id} updated successfully'}), 200

@media_bp.route('/media/<int:media_id>', methods=['DELETE'])
def delete_media(media_id):
    media_item = Media.query.get(media_id)
    if not media_item:
        return jsonify({'message': 'Media not found'}), 404

    db.session.delete(media_item)
    db.session.commit()
    return jsonify({'message': f'Media {media_id} deleted successfully'}), 200
