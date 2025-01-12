from io import BytesIO

from flask import Blueprint, jsonify, request, send_file
from db.models import db, Image

images_routes = Blueprint('images_routes', __name__)



@images_routes.route('/images', methods=['GET'])
def get_images():
    images = Image.query.all()
    return jsonify([{
        "id": image.id,
        "track_id": image.track_id
    } for image in images])


@images_routes.route('/images/<int:img_id>', methods=['GET'])
def get_image(img_id):
    image = Image.query.get(img_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    # Serve the image as binary data
    return send_file(
        BytesIO(image.img_data),
        mimetype='image/jpeg',  # Adjust based on the actual image type
        as_attachment=False
    )

@images_routes.route('/images', methods=['POST'])
def create_image():
    if 'img_file' not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    img_file = request.files['img_file']
    img_data = img_file.read()

    data = request.form
    new_image = Image(
        img_data=img_data,
        track_id=data.get('track_id')
    )
    db.session.add(new_image)
    db.session.commit()
    return jsonify({"message": "Image created successfully", "id": new_image.id}), 201


@images_routes.route('/images/<int:image_id>', methods=['PUT'])
def update_image(image_id):
    image = Image.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    if 'img_data' in request.files:
        img_file = request.files['img_data']
        image.img_data = img_file.read()

    data = request.form
    image.track_id = data.get('track_id', image.track_id)
    db.session.commit()
    return jsonify({"message": "Image updated successfully"})


@images_routes.route('/images/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    image = Image.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404
    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted successfully"})
