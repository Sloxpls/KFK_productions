from flask import Blueprint, request, jsonify
from database_models.track import Track
from database_models import db

track_bp = Blueprint('track_bp', __name__)

@track_bp.route('/tracks', methods=['GET'])
def get_tracks():
    tracks = Track.query.all()
    data = []
    for t in tracks:
        data.append({
            'id': t.id,
            'title': t.title,
            'description': t.description,
            'song_path': t.song_path,
            'img_path': t.img_path,
            'producer': t.producer,
            'writer': t.writer
        })
    return jsonify(data), 200

@track_bp.route('/tracks/<int:track_id>', methods=['GET'])
def get_track(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({'error': 'Track not found'}), 404
    return jsonify({
        'id': track.id,
        'title': track.title,
        'description': track.description,
        'song_path': track.song_path,
        'img_path': track.img_path,
        'producer': track.producer,
        'writer': track.writer
    }), 200

@track_bp.route('/tracks', methods=['POST'])
def create_track():
    req_data = request.get_json() or {}
    new_track = Track(
        title=req_data.get('title'),
        description=req_data.get('description'),
        song_path=req_data.get('song_path'),
        img_path=req_data.get('img_path'),
        producer=req_data.get('producer'),
        writer=req_data.get('writer')
    )
    db.session.add(new_track)
    db.session.commit()
    return jsonify({'message': 'Track created', 'id': new_track.id}), 201

@track_bp.route('/tracks/<int:track_id>', methods=['PUT'])
def update_track(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({'error': 'Track not found'}), 404

    req_data = request.get_json() or {}
    track.title = req_data.get('title', track.title)
    track.description = req_data.get('description', track.description)
    track.song_path = req_data.get('song_path', track.song_path)
    track.img_path = req_data.get('img_path', track.img_path)
    track.producer = req_data.get('producer', track.producer)
    track.writer = req_data.get('writer', track.writer)

    db.session.commit()
    return jsonify({'message': 'Track updated', 'id': track.id}), 200

@track_bp.route('/tracks/<int:track_id>', methods=['DELETE'])
def delete_track(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({'error': 'Track not found'}), 404

    db.session.delete(track)
    db.session.commit()
    return jsonify({'message': 'Track deleted', 'id': track.id}), 200
