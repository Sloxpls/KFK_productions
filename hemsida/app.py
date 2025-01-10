#externa
import sqlite3

from flask import Flask, render_template, request, send_file, redirect, url_for, jsonify

from hemsida.models.models import Models
#egna
from hemsida.services.audio_service import AudioService
from hemsida.services.image_service import ImageService
from services.file_service import FileService

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    # Retrieve files
    song = request.files.get('song')
    image = request.files.get('image')

    # Validate presence of files
    if not song or not image:
        return jsonify({"error": "Both a song file and an image file are required."}), 400
    print("funkar 1")

    # Validate file types
    try:
        if not FileService.is_audio_file(song.filename):
            raise ValueError("The song file must be a valid audio file.")
        if not FileService.is_image_file(image.filename):
            raise ValueError("The image file must be a valid image file.")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    print("funkar 2")


    # Save to database
    try:
        processed_audio = AudioService.process_audio(song)
        processed_image = ImageService.process_image(image)

        print(type(processed_audio['data']))
        print(type(processed_audio['data']))
        print(len(processed_audio['data']))
        print(len(processed_audio['data']))



        print("funkar 3")

        # Save processed files to database
        models_instance = Models()

        song_id = models_instance.save_file(
            processed_audio['filename'],
            processed_audio['file_type'],
            processed_audio['data']
        )

        image_id = models_instance.save_file(
            processed_image['filename'],
            processed_image['file_type'],
            processed_image['data']
        )

        print("funkar 4")
        return jsonify({"message": "Files uploaded successfully.", "song_id": song_id, "image_id": image_id}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/songs', methods=['GET'])
def get_songs():
    models_instance = Models()
    try:
        songs = models_instance.get_all_files()

        # Lägg till URL:er för varje låt
        for song in songs:
            song["download_url"] = f"/api/download/{song['id']}"
            song["stream_url"] = f"/api/stream/{song['id']}"

            # Om filen är en bild, skapa en image_url
            if song["file_type"].startswith("image"):
                song["image_url"] = f"/static/images/{song['filename']}"
            else:
                song["image_url"] = None

        return jsonify(songs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/download/<int:file_id>', methods=['GET'])
def download_file(file_id):
    models_instance = Models()
    try:
        # Hämta fil från databasen

        file = models_instance.retrieve_file(file_id)
        if not file:
            return jsonify({"error": "File not found"}), 404

        filename, file_type, file_data = file[1], file[2], file[3]

        # Skapa nedladdningsrespons
        response = app.response_class(file_data, content_type=file_type)
        response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/stream/<int:file_id>', methods=['GET'])
def stream_file(file_id):
    models_instance = Models()
    try:
        # Hämta fil från databasen
        file = models_instance.retrieve_file(file_id)
        if not file:
            return jsonify({"error": "File not found"}), 404

        filename, file_type, file_data = file[1], file[2], file[3]

        # Skapa strömrespons
        response = app.response_class(file_data, content_type=file_type)
        response.headers['Content-Disposition'] = f'inline; filename="{filename}"'
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
