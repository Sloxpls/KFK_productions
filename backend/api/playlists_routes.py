from flask import Blueprint, jsonify, request
from backend.database_models import Playlist, db, Track

playlist_bp = Blueprint('playlist_bp', __name__)

@playlist_bp.route('/playlists', methods=['GET'])
def get_playlists():
    playlists = Playlist.query.all()
    if not playlists:
        # Return static dummy data if the database is empty.
        dummy_albums = [
            {'id': 1, 'name': 'Album One'},
            {'id': 2, 'name': 'Album Two'},
            {'id': 3, 'name': 'Album Three'}
        ]
        return jsonify(dummy_albums), 200
    else:
        # Return the data from the database if it exists.
        data = [{'id': p.id, 'name': p.name} for p in playlists]
        return jsonify(data), 200

@playlist_bp.route('/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    return jsonify({'id': playlist.id, 'name': playlist.name}), 200

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

@playlist_bp.route('/playlists/<int:playlist_id>', methods=['PUT'])
def update_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404

    req_data = request.get_json() or {}
    playlist.name = req_data.get('name', playlist.name)

    db.session.commit()
    return jsonify({'message': 'Playlist updated', 'id': playlist.id}), 200

@playlist_bp.route('/playlists/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404

    db.session.delete(playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist deleted', 'id': playlist.id}), 200

@playlist_bp.route('/playlists/<int:playlist_id>/tracks/<int:track_id>', methods=['POST'])
def add_track_to_playlist(playlist_id, track_id):
    playlist = Playlist.query.get(playlist_id)
    track = Track.query.get(track_id)

    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    if not track:
        return jsonify({'error': 'Track not found'}), 404

    # Add the track to the playlist
    if track not in playlist.tracks:
        playlist.tracks.append(track)
        db.session.commit()

    return jsonify({'message': f'Track {track_id} added to Playlist {playlist_id}'}), 200

@playlist_bp.route('/playlists/<int:playlist_id>/tracks', methods=['GET'])
def get_tracks_in_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404

    tracks = [
        {
            'id': track.id,
            'title': track.title,
            'description': track.description,
            'song_path': track.song_path,
            'img_path': track.img_path,
            'producer': track.producer,
            'writer': track.writer
        } for track in playlist.tracks
    ]

    return jsonify(tracks), 200

