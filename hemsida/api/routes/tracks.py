from flask import Blueprint, jsonify, request
from hemsida.database_models.models import Track, db

tracks_routes = Blueprint('tracks_routes', __name__)


@tracks_routes.route('/tracks', methods=['GET'])
def get_tracks():
    tracks = Track.query.all()
    return jsonify([{
        "id": track.id,
        "producer_id": track.producer_id,
        "song_id": track.song_id,
        "img_id": track.img_id,
        "video_id": track.video_id,
        "created_date": track.created_date,
        "socials_id": track.socials_id,
        "title": track.title,
        "beskrivning": track.beskrivning
    } for track in tracks])


@tracks_routes.route('/tracks/<int:track_id>', methods=['PUT'])
def update_track(track_id):
    # Find the Track by ID
    track = Track.query.get(track_id)
    if not track:
        return jsonify({"error": "Track not found"}), 404

    data = request.json  # JSON payload from the client

    # Allowed fields for partial update
    fields_to_update = ["title", "song_genere"]
    for field in fields_to_update:
        if field in data:
            setattr(track, field, data[field])

    try:
        db.session.commit()
        return jsonify({
            "message": "Track updated successfully",
            "track": {
                "id": track.id,
                "title": track.title,
                "song_genere": track.song_genere
                # Add other fields if you want to return them
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@tracks_routes.route('/tracks/<int:track_id>', methods=['GET'])
def get_track(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({"error": "Track not found"}), 404
    return jsonify({
        "id": track.id,
        "producer_id": track.producer_id,
        "song_id": track.song_id,
        "img_id": track.img_id,
        "video_id": track.video_id,
        "created_date": track.created_date,
        "socials_id": track.socials_id,
        "title": track.title,
        "beskrivning": track.beskrivning
    })

@tracks_routes.route('/tracks', methods=['POST'])
def create_track():
    data = request.json
    new_track = Track(
        producer_id=data['producer_id'],
        song_id=data['song_id'],
        img_id=data.get('img_id'),
        video_id=data.get('video_id'),
        socials_id=data.get('socials_id'),
        title=data['title'],
        beskrivning=data.get('beskrivning')
    )
    db.session.add(new_track)
    db.session.commit()
    return jsonify({"message": "Track created successfully"}), 201

@tracks_routes.route('/tracks/<int:track_id>', methods=['DELETE'])
def delete_track(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({"error": "Track not found"}), 404
    db.session.delete(track)
    db.session.commit()
    return jsonify({"message": "Track deleted successfully"})