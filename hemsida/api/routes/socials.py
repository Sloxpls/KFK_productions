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

@socials_routes.route('/social/<int:social_id>', methods=['PUT'])
def update_or_create_social(social_id):
    data = request.json  # JSON payload
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Find the Social record by ID
    social = Social.query.get(social_id)

    if social:
        # Update existing record
        fields_to_update = ["instagram", "youtube", "spotify", "tiktok", "andra_medier"]
        for field in fields_to_update:
            if field in data:
                setattr(social, field, data[field])
        message = "Social data updated successfully"
    else:
        # Create a new record if it doesn't exist
        social = Social(
            id=social_id,  # Explicitly set the ID
            instagram=data.get("instagram"),
            youtube=data.get("youtube"),
            spotify=data.get("spotify"),
            tiktok=data.get("tiktok"),
            andra_medier=data.get("andra_medier")
        )
        db.session.add(social)
        message = "Social data created successfully"

    try:
        db.session.commit()
        return jsonify({
            "message": message,
            "social": {
                "id": social.id,
                "instagram": social.instagram,
                "youtube": social.youtube,
                "spotify": social.spotify,
                "tiktok": social.tiktok,
                "andra_medier": social.andra_medier
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Delete a social link
@socials_routes.route('/socials/<int:social_id>', methods=['DELETE'])
def delete_social(social_id):
    social = Social.query.get(social_id)
    if not social:
        return jsonify({"error": "Social entry not found"}), 404

    db.session.delete(social)
    db.session.commit()
    return jsonify({"message": "Social entry deleted successfully"})
