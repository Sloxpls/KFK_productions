import os
import subprocess
from flask import current_app

def convert_wav_to_mp3(source_path, target_path):
    try:
        subprocess.run([
            'ffmpeg',
            '-y',
            '-i', source_path,
            '-codec:a', 'libmp3lame',
            '-qscale:a', '4'
        , target_path], check=True)
        return True
    except subprocess.CalledProcessError as e:
        current_app.logger.error(f"FFmpeg MP3 conversion failed: {e}")
        return False
