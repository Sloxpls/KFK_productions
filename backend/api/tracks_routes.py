from flask import Blueprint, request, jsonify
from database_models.track import Track
from database_models import db

track_bp = Blueprint('track_bp', __name__)

@track_bp.route('/', methods=['GET'])
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

@track_bp.route('/', methods=['POST'])
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
