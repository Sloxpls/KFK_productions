import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database.db')

ALLOWED_AUDIO_TYPES = {'audio/mpeg', 'audio/wav', 'audio/aac'}
ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/bmp', 'image/webp'}
