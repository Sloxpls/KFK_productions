from flask import Blueprint

# Import your blueprints from separate route files
from .media_routes import media_bp
from .tracks_routes import track_bp
from .playlists_routes import playlist_bp

def register_api(app):
    """
    Register all API blueprints with the main Flask app.
    Each blueprint can have its own URL prefix if desired.
    """
    app.register_blueprint(media_bp, url_prefix='/api/media')
    app.register_blueprint(track_bp, url_prefix='/api/tracks')
    app.register_blueprint(playlist_bp, url_prefix='/api/playlists')
