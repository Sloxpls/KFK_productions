from flask import Blueprint, request, jsonify
from database_models.playlist import Playlist
from database_models import db

playlist_bp = Blueprint('playlist_bp', __name__)

@playlist_bp.route('/playlists', methods=['GET'])
def get_playlists():
    playlists = Playlist.query.all()
    data = []
    for p in playlists:
        data.append({'id': p.id, 'name': p.name})
    return jsonify(data), 200

@playlist_bp.route('/playlists', methods=['POST'])
def create_playlist():
    req_data = request.get_json() or {}
    new_playlist = Playlist(name=req_data.get('name'))
    db.session.add(new_playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist created', 'id': new_playlist.id}), 201
