from flask import Blueprint, jsonify, request, send_file, Response
from db.models import db, Song, Track
from mutagen.mp3 import MP3
from mutagen.wave import WAVE
from io import BytesIO
songs_routes = Blueprint('songs_routes', __name__)



@songs_routes.route('/songs', methods=['GET'])
def get_songs():
    # Fetch all tracks with their associated songs
    tracks = Track.query.all()

    # Serialize the data
    return jsonify([
        {
            "track_id": track.id,
            "title": track.title,
            "song_genere": track.song.song_genere if track.song else "N/A",  # Access song details via relationship
            "song_duration": track.song.song_duration if track.song else "N/A"
        }
        for track in tracks
    ])

# Get a specific song by ID
@songs_routes.route('/songs/<int:song_id>', methods=['GET'])
def get_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    return jsonify({
        "id": song.id,
        "song_genere": song.song_genere,
        "song_duration": song.song_duration,
        "track_id": song.track_id
    })

# Create a new song
@songs_routes.route('/songs', methods=['POST'])
def create_song():
    if 'song_file' not in request.files:
        return jsonify({"error": "Song file is required"}), 400

    song_file = request.files['song_file']  # Correct key is 'song_file'
    song_data = song_file.read()

    # Calculate duration
    file_type = song_file.content_type
    duration = None

    if file_type == "audio/mpeg":  # MP3 file
        audio = MP3(BytesIO(song_data))
        duration = int(audio.info.length)
    elif file_type == "audio/wav":  # WAV file
        audio = WAVE(BytesIO(song_data))
        duration = int(audio.info.length)

    if duration is None:
        return jsonify({"error": "Unsupported file type"}), 400
    data = request.form
    new_song = Song(
        song_data=song_data,
        song_genere=data.get('song_genere'),
        song_duration=duration,  # Automatically calculated
        track_id=data.get('track_id')
    )
    db.session.add(new_song)
    db.session.commit()
    return jsonify({"message": "Song created successfully", "id": new_song.id}), 201

# Update an existing song
@songs_routes.route('/songs/<int:song_id>', methods=['PUT'])
def update_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404

    data = request.form

    if 'song_data' in request.files:
        song_file = request.files['song_data']
        song.song_data = song_file.read()

    song.song_genere = data.get('song_genere', song.song_genere)
    song.song_duration = data.get('song_duration', song.song_duration)
    song.track_id = data.get('track_id', song.track_id)
    db.session.commit()
    return jsonify({"message": "Song updated successfully"})


# Ladda ner en låt
@songs_routes.route('/songs/download/<int:song_id>', methods=['GET'])
def download_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404

    return send_file(
        BytesIO(song.song_data),
        mimetype='audio/mpeg',  # Anpassa MIME-typen om det inte är MP3
        as_attachment=True,
        download_name=f"song_{song_id}.mp3"  # Namnet på den nedladdade filen
    )

# Streama en låt
@songs_routes.route('/songs/stream/<int:song_id>', methods=['GET'])
def stream_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404

    return Response(
        BytesIO(song.song_data),
        mimetype='audio/mpeg',  # Anpassa MIME-typen om det är något annat än MP3
    )
@songs_routes.route('/songs/<int:song_id>', methods=['DELETE'])
def delete_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404

    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Song deleted successfully"})
