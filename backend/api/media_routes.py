from flask import Blueprint, request, jsonify
from database_models.media import Media
from database_models import db

media_bp = Blueprint('media_bp', __name__)

@media_bp.route('/', methods=['GET'])
def get_media():
    """Retrieve all media entries."""
    media_items = Media.query.all()
    results = []
    for item in media_items:
        results.append({
            'id': item.id,
            'filename': item.filename,
            'file_path': item.file_path,
            'description': item.description,
            'uploaded_at': item.uploaded_at
        })
    return jsonify(results), 200

@media_bp.route('/', methods=['POST'])
def create_media():
    """Create a new media entry."""
    data = request.get_json() or {}
    new_media = Media(
        filename=data.get('filename'),
        file_path=data.get('file_path'),
        description=data.get('description')
    )
    db.session.add(new_media)
    db.session.commit()
    return jsonify({'message': 'Media created successfully!', 'id': new_media.id}), 201

@media_bp.route('/<int:media_id>', methods=['GET'])
def get_media_item(media_id):
    """Retrieve a single media entry by ID."""
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

@media_bp.route('/<int:media_id>', methods=['DELETE'])
def delete_media(media_id):
    """Delete a media entry by ID."""
    media_item = Media.query.get(media_id)
    if not media_item:
        return jsonify({'message': 'Media not found'}), 404

    db.session.delete(media_item)
    db.session.commit()
    return jsonify({'message': f'Media {media_id} deleted successfully'}), 200
