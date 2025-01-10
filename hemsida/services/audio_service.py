import subprocess
import os
from werkzeug.utils import secure_filename

class AudioService:
    @staticmethod
    def process_audio(audio_file):
        filename = secure_filename(audio_file.filename)
        output_filename = os.path.splitext(filename)[0] + '.mp3'
        output_path = f"/tmp/{output_filename}"  # Temporary storage

        try:
            subprocess.run(
                [
                    'ffmpeg',
                    '-i', '-',
                    '-vn',
                    '-ar', '44100',
                    '-ac', '2',
                    '-b:a', '320k',
                    output_path
                ],
                input=audio_file.read(),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True
            )

            with open(output_path, 'rb') as f:
                mp3_data = f.read()

            os.remove(output_path)  # Clean up temporary file

            return {
                'filename': output_filename,
                'file_type': 'audio/mpeg',
                'data': mp3_data
            }
        except subprocess.CalledProcessError as e:
            raise Exception(f"Audio processing failed: {e}")
