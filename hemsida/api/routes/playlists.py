from flask import Blueprint, jsonify, request
from hemsida.database_models.models import Playlist, db

playlists_routes = Blueprint('playlists_routes', __name__)


# Get all playlists
@playlists_routes.route('/playlists', methods=['GET'])
def get_playlists():
    playlists = Playlist.query.all()
    return jsonify([{
        "id": playlist.id,
        "name": playlist.name
    } for playlist in playlists])

# Get a specific playlist by ID
@playlists_routes.route('/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404
    return jsonify({
        "id": playlist.id,
        "name": playlist.name
    })

# Create a new playlist
@playlists_routes.route('/playlists', methods=['POST'])
def create_playlist():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Playlist name is required"}), 400

    new_playlist = Playlist(name=data['name'])
    db.session.add(new_playlist)
    db.session.commit()
    return jsonify({"message": "Playlist created successfully", "id": new_playlist.id}), 201

# Update an existing playlist
@playlists_routes.route('/playlists/<int:playlist_id>', methods=['PUT'])
def update_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    data = request.json
    playlist.name = data.get('name', playlist.name)
    db.session.commit()
    return jsonify({"message": "Playlist updated successfully"})

# Delete a playlist
@playlists_routes.route('/playlists/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    db.session.delete(playlist)
    db.session.commit()
    return jsonify({"message": "Playlist deleted successfully"})
