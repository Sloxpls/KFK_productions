from flask import Blueprint
from .media_routes import media_bp
from .tracks_routes import track_bp
from .playlists_routes import playlist_bp
from .auth_routes import auth_bp

def register_api(app):

    app.register_blueprint(media_bp, url_prefix='/api')
    app.register_blueprint(track_bp, url_prefix='/api')
    app.register_blueprint(playlist_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/')
