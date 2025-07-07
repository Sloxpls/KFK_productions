import os
from flask import Blueprint, jsonify, request, send_file, current_app
from werkzeug.utils import secure_filename

from backend.database_models import Track, db, PlaylistTrack, Playlist
from backend.utils.token_validator import token_required

TRACK_FOLDER = os.environ.get("TRACK_FOLDER", "/app/track_uploads")
os.makedirs(TRACK_FOLDER, exist_ok=True)

track_bp = Blueprint('track_bp', __name__)

@track_bp.route('/upload-song', methods=['POST'])
def upload_song():
    try:
        # Convert string boolean values to Python booleans
        tiktok = request.form.get('tiktok', 'false').lower() == 'true'
        youtube = request.form.get('youtube', 'false').lower() == 'true'
        spotify = request.form.get('spotify', 'false').lower() == 'true'
        instagram = request.form.get('instagram', 'false').lower() == 'true'
        soundcloud = request.form.get('soundcloud', 'false').lower() == 'true'

        # Extract form data and files
        title = request.form.get('title')
        description = request.form.get('description')
        producer = request.form.get('producer')
        writer = request.form.get('writer')
        genre = request.form.get('genre')
        playlist_name = request.form.get('playlist_name')

        song_file = request.files.get('song_file')
        img_file = request.files.get('img_file')

        if not title or not song_file:
            return jsonify({'error': 'one or more required fields are empty'}), 400

        # Save files using secure_filename
        song_filename = None
        if song_file:
            song_filename = secure_filename(song_file.filename)
            song_file.save(os.path.join(TRACK_FOLDER, song_filename))

        img_filename = None
        if img_file:
            img_filename = secure_filename(img_file.filename)
            img_file.save(os.path.join(TRACK_FOLDER, img_filename))

        # Create the new track object with file paths
        new_track = Track(
            title=title,
            description=description,
            producer=producer,
            writer=writer,
            song_path=song_filename,
            img_path=img_filename,
            genre=genre,
            tiktok=tiktok,
            soundcloud=soundcloud,
            youtube=youtube,
            spotify=spotify,
            instagram=instagram
        )

        # Add the track to the session
        db.session.add(new_track)

        # Associate the track with a playlist if a playlist name was provided
        if playlist_name:
            playlist = Playlist.query.filter_by(name=playlist_name).first()
            if not playlist:
                playlist = Playlist(name=playlist_name)
                db.session.add(playlist)
            playlist.tracks.append(new_track)

        # Commit all changes
        db.session.commit()

        return jsonify({
            'message': 'Song uploaded successfully',
            'id': new_track.id
        }), 201

    except Exception as e:
        db.session.rollback() 
        current_app.logger.error(f"Error uploading song: {e}")
        return jsonify({'error': 'An error occurred while uploading the song'}), 500


""" @track_bp.route('/tracks', methods=['GET'])
def get_tracks():
    tracks = Track.query.all()
    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'song_path': t.song_path,
        'img_path': t.img_path,
        'producer': t.producer,
        'writer': t.writer,
        'genre': t.genre,
        'tiktok': t.tiktok,
        'soundcloud': t.soundcloud,
        'spotify': t.spotify,
        'youtube': t.youtube,
        'instagram': t.instagram
    } for t in tracks]), 200 """

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
        'writer': track.writer,
        'genre': track.genre,
        'tiktok': track.tiktok,
        'soundcloud': track.soundcloud,
        'spotify': track.spotify,
        'youtube': track.youtube,
        'instagram': track.instagram
    }), 200


@track_bp.route('/tracks/<int:track_id>', methods=['PUT'])
def update_track(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({'error': 'Track not found'}), 404

    if 'song' in request.files or 'image' in request.files:
        # Handle multipart/form-data
        song_file = request.files.get('song')
        image_file = request.files.get('image')
        track.title = request.form.get('title', track.title)
        track.description = request.form.get('description', track.description)
        track.producer = request.form.get('producer', track.producer)
        track.writer = request.form.get('writer', track.writer)
        track.genre = request.form.get('genre', track.genre)
        track.tiktok = request.form.get('tiktok', track.tiktok)
        track.soundcloud = request.form.get('soundcloud', track.soundcloud)
        track.spotify = request.form.get('spotify', track.spotify)
        track.youtube = request.form.get('youtube', track.youtube)
        track.instagram = request.form.get('instagram', track.instagram)

        if song_file:
            new_song_filename = secure_filename(song_file.filename)
            song_file.save(os.path.join(TRACK_FOLDER, new_song_filename))
            track.song_path = new_song_filename

        if image_file:
            new_img_filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(TRACK_FOLDER, new_img_filename))
            track.img_path = new_img_filename

        db.session.commit()
        return jsonify({'message': 'Track updated', 'id': track.id}), 200

    else:
        # Handle JSON
        req_data = request.get_json() or {}
        track.title = req_data.get('title', track.title)
        track.description = req_data.get('description', track.description)
        track.song_path = req_data.get('song_path', track.song_path)
        track.img_path = req_data.get('img_path', track.img_path)
        track.producer = req_data.get('producer', track.producer)
        track.writer = req_data.get('writer', track.writer)
        track.genre = req_data.get('genre', track.genre)
        track.tiktok = req_data.get('tiktok', track.tiktok)
        track.soundcloud = req_data.get('soundcloud', track.soundcloud)
        track.spotify = req_data.get('spotify', track.spotify)
        track.youtube = req_data.get('youtube', track.youtube)
        track.instagram = req_data.get('instagram', track.instagram)
    
        db.session.commit()
        return jsonify({'message': 'Track updated', 'id': track.id}), 200


@track_bp.route('/tracks/<int:track_id>', methods=['DELETE'])
def delete_track(track_id):
    try:
        track = Track.query.get(track_id)
        if not track:
            return jsonify({'error': 'Track not found'}), 404
        
        file_path = os.path.join(TRACK_FOLDER, track.song_path)
        if os.path.exists(file_path):
            os.remove(file_path)

        db.session.delete(track)
        db.session.commit()

        return jsonify({
            'message': f'Track {track_id} has been deleted'
            }), 200
    
    except OSError as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting track: {e}")
        return jsonify({
            'error': 'An error occurred while deleting the track'
            }), 500
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'An error occurred while deleting the track'
            }), 500 

@track_bp.route('/tracks/<int:track_id>/download', methods=['GET'])
def download_song(track_id):
    track = Track.query.get(track_id)
    if not track or not track.song_path:
        return jsonify({'error': 'Song not found'}), 404
    full_path = os.path.join(TRACK_FOLDER, track.song_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'Song file does not exist'}), 404
    return send_file(full_path, mimetype='audio/mpeg')

@track_bp.route('/tracks/<int:track_id>/image', methods=['GET'])
def get_image(track_id):
    track = Track.query.get(track_id)
    if not track or not track.img_path:
        return jsonify({'error': 'Image not found'}), 404
    full_path = os.path.join(TRACK_FOLDER, track.img_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'Image file does not exist'}), 404
    return send_file(full_path, mimetype='image/jpeg')

@track_bp.route("/tracks/<int:track_id>/stream", methods=["GET"])
def stream_track(track_id):
    track = Track.query.get(track_id)
    if not track or not track.song_path:
        return jsonify({'error': 'No song file specified'}), 404

    full_path = os.path.join(TRACK_FOLDER, track.song_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'File not found on server'}), 404

    return send_file(full_path, mimetype='audio/mpeg')

@track_bp.route('/tracks-unassigned', methods=['GET'])
def get_unassigned_tracks():
    try:
        unassigned_tracks = db.session.query(Track).outerjoin(
            PlaylistTrack, 
            Track.id == PlaylistTrack.track_id
        ).filter(
            PlaylistTrack.playlist_id == None
        ).all()
        
        tracks_data = [{
        'id': track.id,
        'title': track.title,
        'description': track.description,
        'song_path': track.song_path,
        'img_path': track.img_path,
        'producer': track.producer,
        'writer': track.writer,
        'genre': track.genre,
        'tiktok': track.tiktok,
        'soundcloud': track.soundcloud,
        'spotify': track.spotify,
        'youtube': track.youtube,
        'instagram': track.instagram
    } for track in unassigned_tracks]
            
        return jsonify(tracks_data)
    
    except Exception as e:
        current_app.logger.error(f"Error getting unassigned tracks: {e}")
        return jsonify({'error': 'An error occurred while fetching unassigned tracks'}), 500
    
@track_bp.route('/tracks', methods=['GET'])
def get_tracks():
    try:
        tracks = Track.query.all()
        
        tracks_data = []
        for track in tracks:
            tracks_data.append({
                'id': track.id,
                'title': track.title,
                'producer': track.producer,
                'writer': track.writer,
                'description': track.description,
                'genre': track.genre,
                'song_path': track.song_path,
                'img_path': track.img_path,
                'social_platforms': {
                    'tiktok': track.tiktok,
                    'soundcloud': track.soundcloud,
                    'spotify': track.spotify,
                    'youtube': track.youtube,
                    'instagram': track.instagram
                },
                'stream_url': f'/api/tracks/{track.id}/stream',
                'download_url': f'/api/tracks/{track.id}/download',
                'image_url': f'/api/tracks/{track.id}/image'
            })
        
        available_genres = list(set(t.genre for t in tracks if t.genre))
        available_producers = list(set(t.producer for t in tracks if t.producer))
        
        return jsonify({
            'tracks': tracks_data,
            'metadata': {
                'total_tracks': len(tracks_data),
                'available_genres': available_genres,
                'available_producers': available_producers
            }
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500