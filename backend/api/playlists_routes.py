from flask import Blueprint, jsonify, request
from backend.database_models import Playlist, Track, db
from backend.utils.token_validator import token_required

playlist_bp = Blueprint('playlist_bp', __name__)

@playlist_bp.route('/playlists', methods=['GET'])
def get_playlists():
    playlists = Playlist.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
    } for p in playlists])

@playlist_bp.route('/playlists-with-tracks', methods=['GET'])
def get_playlists_with_tracks():
    try:
        playlists = Playlist.query.all()
        return jsonify([{
            'id': playlist.id,
            'name': playlist.name,
            'tracks': [track.to_dict() for track in playlist.tracks]
        } for playlist in playlists])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@playlist_bp.route('/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    return jsonify({
        'id': playlist.id,
        'name': playlist.name,
        'tracks': [t.to_dict() for t in playlist.tracks]
    })

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

    return jsonify([track.to_dict() for track in playlist.tracks]), 200


@playlist_bp.route('/playlists/<int:playlist_id>/tracks/<int:track_id>', methods=['DELETE'])
def remove_track_from_playlist(playlist_id, track_id):
    playlist = Playlist.query.get(playlist_id)
    track = Track.query.get(track_id)

    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    if not track:
        return jsonify({'error': 'Track not found'}), 404
    if track not in playlist.tracks:
        return jsonify({'error': 'Track is not in the playlist'}), 400

    playlist.tracks.remove(track)
    db.session.commit()

    return jsonify({'message': f'Track {track_id} removed from Playlist {playlist_id}'}), 200
