from flask import Blueprint, jsonify, request, current_app
from backend.database_models import Track, Playlist, db
from werkzeug.utils import secure_filename
import os

from backend.utils.token_validator import token_required

upload_bp = Blueprint('upload_bp', __name__)
UPLOAD_FOLDER = os.environ.get("TRACK_FOLDER", "/app/track_uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@upload_bp.route('/upload-song', methods=['POST'])
@token_required
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

        if not title or not song_file or not img_file:
            return jsonify({'error': 'one or more required fields are empty'}), 400

        # Save files using secure_filename
        song_filename = None
        if song_file:
            song_filename = secure_filename(song_file.filename)
            song_file.save(os.path.join(UPLOAD_FOLDER, song_filename))

        img_filename = None
        if img_file:
            img_filename = secure_filename(img_file.filename)
            img_file.save(os.path.join(UPLOAD_FOLDER, img_filename))

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
