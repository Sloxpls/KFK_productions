from flask import Blueprint, jsonify, request
from backend.database_models import Playlist, Track, db
from backend.utils.token_validator import token_required
from werkzeug.utils import secure_filename
import os

PLAYLIST_FOLDER = os.environ.get("PLAYLIST_FOLDER", "/app/playlist_uploads")
os.makedirs(PLAYLIST_FOLDER, exist_ok=True)

playlist_bp = Blueprint('playlist_bp', __name__)

@playlist_bp.route('/playlists', methods=['GET'])
def get_playlists():
    playlists = Playlist.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'status': p.status,
        'description': p.description,
        'img_path': p.img_path
    } for p in playlists])

@playlist_bp.route('/playlists-with-tracks', methods=['GET'])
def get_playlists_with_tracks():
    try:
        playlists = Playlist.query.all()
        return jsonify([{
            'id': playlist.id,
            'name': playlist.name,
            'status': playlist.status,
            'description': playlist.description,
            'img_path': playlist.img_path,
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
        'status': playlist.status,
        'description': playlist.description,
        'img_path': playlist.img_path,
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

@playlist_bp.route('/playlists/<int:playlist_id>', methods=['PUT'])
def update_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404

    try:
        if request.content_type and 'multipart/form-data' in request.content_type:
            name = request.form.get('name', playlist.name)
            description = request.form.get('description', playlist.description)
            
            status = request.form.get('status')
            if status is not None:
                try:
                    status = int(status)
                except ValueError:
                    status = playlist.status
            else:
                status = playlist.status
            
            # Handle file upload if present
            img_file = request.files.get('img_file')
            if img_file and img_file.filename:
                # Save the image file
                img_filename = secure_filename(img_file.filename)
                img_file.save(os.path.join(PLAYLIST_FOLDER, img_filename))
                playlist.img_path = img_filename
            
            # Update playlist fields
            playlist.name = name
            playlist.description = description
            playlist.status = status
            
        else:
            # in case of JSON request
            req_data = request.get_json() or {}
            playlist.name = req_data.get('name', playlist.name)
            playlist.description = req_data.get('description', playlist.description)
            playlist.status = req_data.get('status', playlist.status)
            playlist.img_path = req_data.get('img_path', playlist.img_path)

        # Save changes to database
        db.session.commit()

        return jsonify({
            'message': 'Playlist updated',
            'id': playlist.id,
            'name': playlist.name,
            'description': playlist.description,
            'status': playlist.status,
            'img_path': playlist.img_path
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred while updating the playlist: {str(e)}'}), 500
    
@playlist_bp.route('/playlists/<int:playlist_id>/image', methods=['GET'])
def get_playlist_image(playlist_id):
    from flask import send_from_directory
    
    playlist = Playlist.query.get(playlist_id)
    if not playlist or not playlist.img_path:
        return jsonify({'error': 'Image not found'}), 404
    
    try:
        return send_from_directory(PLAYLIST_FOLDER, playlist.img_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500