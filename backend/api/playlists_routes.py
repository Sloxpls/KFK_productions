from flask import Blueprint, request, jsonify
from database_models.playlist import Playlist
from database_models import db

playlist_bp = Blueprint('playlist_bp', __name__)

# Get all playlists
@playlist_bp.route('/playlists', methods=['GET'])
def get_playlists():
    playlists = Playlist.query.all()
    data = [{'id': p.id, 'name': p.name} for p in playlists]
    return jsonify(data), 200

# Get a single playlist by ID
@playlist_bp.route('/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    return jsonify({'id': playlist.id, 'name': playlist.name}), 200

# Create a new playlist
@playlist_bp.route('/playlists', methods=['POST'])
def create_playlist():
    req_data = request.get_json() or {}
    name = req_data.get('name')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    new_playlist = Playlist(name=name)
    db.session.add(new_playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist created', 'id': new_playlist.id}), 201

# Update a playlist by ID
@playlist_bp.route('/playlists/<int:playlist_id>', methods=['PUT'])
def update_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404

    req_data = request.get_json() or {}
    playlist.name = req_data.get('name', playlist.name)

    db.session.commit()
    return jsonify({'message': 'Playlist updated', 'id': playlist.id}), 200

# Delete a playlist by ID
@playlist_bp.route('/playlists/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404

    db.session.delete(playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist deleted', 'id': playlist.id}), 200
