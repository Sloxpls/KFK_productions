import os
from flask import Blueprint, jsonify, request, send_file, current_app
from werkzeug.utils import secure_filename

from backend.database_models import Track, db
from backend.utils.token_validator import token_required

TRACK_FOLDER = os.environ.get("TRACK_FOLDER", "/app/track_uploads")
os.makedirs(TRACK_FOLDER, exist_ok=True)

track_bp = Blueprint('track_bp', __name__)

@track_bp.route('/tracks', methods=['GET'])
@token_required
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
    } for t in tracks]), 200

@track_bp.route('/tracks/<int:track_id>', methods=['GET'])
@token_required
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

@track_bp.route('/tracks', methods=['POST'])
@token_required
def create_track():
    if 'song' in request.files or 'image' in request.files:
        # Handle multipart/form-data
        song_file = request.files.get('song')
        image_file = request.files.get('image')
        title = request.form.get('title', '')
        description = request.form.get('description', '')
        producer = request.form.get('producer')
        writer = request.form.get('writer')
        genre = request.form.get('genre')

        song_filename = None
        if song_file:
            song_filename = secure_filename(song_file.filename)
            song_file.save(os.path.join(TRACK_FOLDER, song_filename))

        img_filename = None
        if image_file:
            img_filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(TRACK_FOLDER, img_filename))

        new_track = Track(
            title=title or 'Untitled',
            description=description,
            song_path=song_filename,
            img_path=img_filename,
            producer=producer,
            writer=writer,
            genre=genre
        )
        db.session.add(new_track)
        db.session.commit()
        return jsonify({'message': 'Track created', 'id': new_track.id}), 201

    else:
        # Handle JSON
        req_data = request.get_json() or {}
        new_track = Track(
            title=req_data.get('title', 'Untitled'),
            description=req_data.get('description', ''),
            song_path=req_data.get('song_path'),
            img_path=req_data.get('img_path'),
            producer=req_data.get('producer'),
            writer=req_data.get('writer'),
            genre=req_data.get('genre'),
        )
        db.session.add(new_track)
        db.session.commit()
        return jsonify({'message': 'Track created', 'id': new_track.id}), 201

@track_bp.route('/tracks/<int:track_id>', methods=['PUT'])
@token_required
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
@token_required
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
@token_required
def download_song(track_id):
    track = Track.query.get(track_id)
    if not track or not track.song_path:
        return jsonify({'error': 'Song not found'}), 404
    full_path = os.path.join(TRACK_FOLDER, track.song_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'Song file does not exist'}), 404
    return send_file(full_path, mimetype='audio/mpeg')

@track_bp.route('/tracks/<int:track_id>/image', methods=['GET'])
@token_required
def get_image(track_id):
    track = Track.query.get(track_id)
    if not track or not track.img_path:
        return jsonify({'error': 'Image not found'}), 404
    full_path = os.path.join(TRACK_FOLDER, track.img_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'Image file does not exist'}), 404
    return send_file(full_path, mimetype='image/jpeg')

@track_bp.route("/tracks/<int:track_id>/stream", methods=["GET"])
@token_required
def stream_track(track_id):
    track = Track.query.get(track_id)
    if not track or not track.song_path:
        return jsonify({'error': 'No song file specified'}), 404

    full_path = os.path.join(TRACK_FOLDER, track.song_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'File not found on server'}), 404

    return send_file(full_path, mimetype='audio/mpeg')
