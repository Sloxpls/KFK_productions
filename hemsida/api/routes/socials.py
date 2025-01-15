from flask import Blueprint, jsonify, request
from hemsida.database_models.models import Social, db

socials_routes = Blueprint('socials_routes', __name__)

# Get all social links
@socials_routes.route('/socials', methods=['GET'])
def get_socials():
    socials = Social.query.all()
    return jsonify([{
        "id": social.id,
        "instagram": social.instagram,
        "youtube": social.youtube,
        "spotify": social.spotify,
        "tiktok": social.tiktok,
        "andra_medier": social.andra_medier
    } for social in socials])

# Get a specific social link by ID
@socials_routes.route('/socials/<int:social_id>', methods=['GET'])
def get_social(social_id):
    social = Social.query.get(social_id)
    if not social:
        return jsonify({"error": "Social entry not found"}), 404
    return jsonify({
        "id": social.id,
        "instagram": social.instagram,
        "youtube": social.youtube,
        "spotify": social.spotify,
        "tiktok": social.tiktok,
        "andra_medier": social.andra_medier
    })

# Create a new social link
@socials_routes.route('/socials', methods=['POST'])
def create_social():
    data = request.json
    new_social = Social(
        instagram=data.get('instagram'),
        youtube=data.get('youtube'),
        spotify=data.get('spotify'),
        tiktok=data.get('tiktok'),
        andra_medier=data.get('andra_medier')
    )
    db.session.add(new_social)
    db.session.commit()
    return jsonify({"message": "Social entry created successfully", "id": new_social.id}), 201

# Update an existing social link
@socials_routes.route('/socials/<int:social_id>', methods=['PUT'])
def update_social(social_id):
    social = Social.query.get(social_id)
    if not social:
        return jsonify({"error": "Social entry not found"}), 404

    data = request.json
    social.instagram = data.get('instagram', social.instagram)
    social.youtube = data.get('youtube', social.youtube)
    social.spotify = data.get('spotify', social.spotify)
    social.tiktok = data.get('tiktok', social.tiktok)
    social.andra_medier = data.get('andra_medier', social.andra_medier)
    db.session.commit()
    return jsonify({"message": "Social entry updated successfully"})

# Delete a social link
@socials_routes.route('/socials/<int:social_id>', methods=['DELETE'])
def delete_social(social_id):
    social = Social.query.get(social_id)
    if not social:
        return jsonify({"error": "Social entry not found"}), 404

    db.session.delete(social)
    db.session.commit()
    return jsonify({"message": "Social entry deleted successfully"})
