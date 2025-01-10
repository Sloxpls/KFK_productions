#externa
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

    
    # Save to database
    try:
        processed_audio = AudioService.process_audio(song)
        processed_image = ImageService.process_image(image)
        print("funkar 3")
        # Save processed files to database
        song_id = Models.save_file(processed_audio['filename'], processed_audio['file_type'], processed_audio['data'])
        image_id = Models.save_file(processed_image['filename'], processed_image['file_type'], processed_image['data'])
        print("funkar 3")
        return jsonify({"message": "Files uploaded successfully.", "song_id": song_id, "image_id": image_id}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
