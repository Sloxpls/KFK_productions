import os
from flask import Blueprint, jsonify, request, send_file, current_app
from werkzeug.utils import secure_filename

from backend.database_models import Track, db, PlaylistTrack
from backend.utils.audio import convert_wav_to_mp3


TRACK_FOLDER = os.environ.get("TRACK_FOLDER", "/app/track_uploads")
os.makedirs(TRACK_FOLDER, exist_ok=True)

track_bp = Blueprint('track_bp', __name__)


@track_bp.route('/tracks', methods=['GET'])
def get_tracks():
    tracks = Track.query.all()
    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'song_path': t.song_path,
        'mp3_path': t.mp3_path,
        'img_path': t.img_path,
        'producer': t.producer,
        'writer': t.writer,
        'genre': t.genre,
        'tiktok': t.tiktok,
        'soundcloud': t.soundcloud,
        'spotify': t.spotify,
        'youtube': t.youtube,
        'instagram': t.instagram
    } for t in tracks]), 200


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
        'mp3_path': track.mp3_path,
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


@track_bp.route('/tracks', methods=['POST'])
def create_track():
    if 'song' in request.files or 'image' in request.files:
        song_file = request.files.get('song')
        image_file = request.files.get('image')

        title = request.form.get('title', '')
        description = request.form.get('description', '')
        producer = request.form.get('producer')
        writer = request.form.get('writer')
        genre = request.form.get('genre')

        song_filename = None
        mp3_filename = None
        if song_file:
            song_filename = secure_filename(song_file.filename)
            song_path = os.path.join(TRACK_FOLDER, song_filename)
            song_file.save(song_path)

            mp3_filename = os.path.splitext(song_filename)[0] + '.mp3'
            mp3_path = os.path.join(TRACK_FOLDER, mp3_filename)

            if not convert_wav_to_mp3(song_path, mp3_path):
                # Clean up uploaded file if conversion fails
                if os.path.exists(song_path):
                    os.remove(song_path)
                return jsonify({'error': 'Failed to convert to MP3'}), 500

        img_filename = None
        if image_file:
            img_filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(TRACK_FOLDER, img_filename))

        new_track = Track(
            title=title or 'Untitled',
            description=description,
            song_path=song_filename,
            mp3_path=mp3_filename,
            img_path=img_filename,
            producer=producer,
            writer=writer,
            genre=genre
        )
        db.session.add(new_track)
        db.session.commit()
        return jsonify({'message': 'Track created', 'id': new_track.id}), 201

    else:
        req_data = request.get_json() or {}
        new_track = Track(
            title=req_data.get('title', 'Untitled'),
            description=req_data.get('description', ''),
            song_path=req_data.get('song_path'),
            mp3_path=req_data.get('mp3_path'),
            img_path=req_data.get('img_path'),
            producer=req_data.get('producer'),
            writer=req_data.get('writer'),
            genre=req_data.get('genre'),
        )
        db.session.add(new_track)
        db.session.commit()
        return jsonify({'message': 'Track created', 'id': new_track.id}), 201


@track_bp.route('/tracks/<int:track_id>', methods=['PUT'])
def update_track(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({'error': 'Track not found'}), 404

    if 'song' in request.files or 'image' in request.files:
        song_file = request.files.get('song')
        image_file = request.files.get('image')

        # Store old file paths for cleanup
        old_files_to_remove = []
        new_files_to_remove_on_fail = []

        # Process song update
        if song_file:
            # Save old paths for cleanup
            if track.song_path:
                old_files_to_remove.append(track.song_path)
            if track.mp3_path:
                old_files_to_remove.append(track.mp3_path)

            # Process new song
            song_filename = secure_filename(song_file.filename)
            song_path = os.path.join(TRACK_FOLDER, song_filename)
            song_file.save(song_path)
            new_files_to_remove_on_fail.append(song_filename)

            mp3_filename = os.path.splitext(song_filename)[0] + '.mp3'
            mp3_path = os.path.join(TRACK_FOLDER, mp3_filename)

            if not convert_wav_to_mp3(song_path, mp3_path):
                # Clean up new files on failure
                for filename in new_files_to_remove_on_fail:
                    file_path = os.path.join(TRACK_FOLDER, filename)
                    if os.path.exists(file_path):
                        os.remove(file_path)
                return jsonify({'error': 'Failed to convert song'}), 500

            new_files_to_remove_on_fail.append(mp3_filename)
            track.song_path = song_filename
            track.mp3_path = mp3_filename

        # Process image update
        if image_file:
            # Save old path for cleanup
            if track.img_path:
                old_files_to_remove.append(track.img_path)

            img_filename = secure_filename(image_file.filename)
            img_path = os.path.join(TRACK_FOLDER, img_filename)
            image_file.save(img_path)
            new_files_to_remove_on_fail.append(img_filename)
            track.img_path = img_filename

        # Update metadata
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

        try:
            db.session.commit()
        except Exception as e:
            # Clean up new files if DB commit fails
            current_app.logger.error(f"Database commit error: {e}")
            for filename in new_files_to_remove_on_fail:
                file_path = os.path.join(TRACK_FOLDER, filename)
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                    except Exception as e2:
                        current_app.logger.error(f"Error removing new file: {e2}")
            return jsonify({'error': 'Database update failed'}), 500

        # Clean up old files after successful update
        for filename in old_files_to_remove:
            file_path = os.path.join(TRACK_FOLDER, filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    current_app.logger.error(f"Error removing old file: {e}")

        return jsonify({'message': 'Track updated', 'id': track.id}), 200

    else:
        req_data = request.get_json() or {}
        track.title = req_data.get('title', track.title)
        track.description = req_data.get('description', track.description)
        track.song_path = req_data.get('song_path', track.song_path)
        track.mp3_path = req_data.get('mp3_path', track.mp3_path)
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

        # Collect all file paths associated with the track
        files_to_remove = []
        if track.song_path:
            files_to_remove.append(track.song_path)
        if track.mp3_path:
            files_to_remove.append(track.mp3_path)
        if track.img_path:
            files_to_remove.append(track.img_path)

        # Delete from database
        db.session.delete(track)
        db.session.commit()

        # Remove physical files
        for filename in files_to_remove:
            if filename:  # Ensure filename is not None
                file_path = os.path.join(TRACK_FOLDER, filename)
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                    except Exception as e:
                        current_app.logger.error(f"Error deleting file {filename}: {e}")

        return jsonify({'message': f'Track {track_id} has been deleted'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete error: {e}")
        return jsonify({'error': 'An error occurred'}), 500


@track_bp.route('/tracks/<int:track_id>/stream', methods=['GET'])
def stream_track(track_id):
    track = Track.query.get(track_id)
    if not track or not track.mp3_path:
        return jsonify({'error': 'No song available to stream'}), 404

    mp3_path = os.path.join(TRACK_FOLDER, track.mp3_path)
    if not os.path.exists(mp3_path):
        return jsonify({'error': 'MP3 file does not exist'}), 404

    return send_file(mp3_path, mimetype='audio/mpeg')


@track_bp.route('/tracks/<int:track_id>/image', methods=['GET'])
def get_image(track_id):
    track = Track.query.get(track_id)
    if not track or not track.img_path:
        return jsonify({'error': 'Image not found'}), 404

    full_path = os.path.join(TRACK_FOLDER, track.img_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'Image file does not exist'}), 404

    return send_file(full_path, mimetype='image/jpeg')


@track_bp.route('/tracks-unassigned', methods=['GET'])
def get_unassigned_tracks():
    try:
        # Efficient query for unassigned tracks
        unassigned_tracks = Track.query.filter(
            ~Track.playlists.any()
        ).all()

        return jsonify([{
            'id': t.id,
            'title': t.title,
            'description': t.description,
            'song_path': t.song_path,
            'mp3_path': t.mp3_path,
            'img_path': t.img_path,
            'producer': t.producer,
            'writer': t.writer,
            'genre': t.genre,
            'tiktok': t.tiktok,
            'soundcloud': t.soundcloud,
            'spotify': t.spotify,
            'youtube': t.youtube,
            'instagram': t.instagram
        } for t in unassigned_tracks]), 200

    except Exception as e:
        current_app.logger.error(f"Unassigned error: {e}")
        return jsonify({'error': 'Error fetching unassigned tracks'}), 500