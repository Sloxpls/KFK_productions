from flask import Blueprint, jsonify, request, send_file
from hemsida.database_models.models import Media, db
from io import BytesIO
media_routes = Blueprint('media_routes', __name__)

# Upload a media file
@media_routes.route('/media', methods=['POST'])
def upload_media():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    description = request.form.get('description', '')

    # Save the file in the database
    new_media = Media(
        filename=file.filename,
        file_type='image' if file.mimetype.startswith('image') else 'video',
        file_data=file.read(),
        description=description
    )
    db.session.add(new_media)
    db.session.commit()

    return jsonify({"message": "File uploaded successfully", "id": new_media.id}), 201

# Get all media
@media_routes.route('/media', methods=['GET'])
def get_all_media():
    media = Media.query.all()
    return jsonify([
        {
            "id": m.id,
            "filename": m.filename,
            "file_type": m.file_type,
            "description": m.description
        } for m in media
    ])

# Download a media file
@media_routes.route('/media/<int:media_id>', methods=['GET'])
def download_media(media_id):
    media = Media.query.get(media_id)
    if not media:
        return jsonify({"error": "Media not found"}), 404

    return send_file(
        BytesIO(media.file_data),
        as_attachment=True,
        download_name=media.filename,
        mimetype='application/octet-stream'
    )
