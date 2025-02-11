import os
from dotenv import load_dotenv
from flask import Flask
from api import track_bp, media_bp, playlist_bp, auth_bp, upload_bp
from backend.database_models import db


def create_app():
    load_dotenv()
    app = Flask(__name__)

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tracks_path = os.path.join(project_root, 'frontend', 'public', 'tracks')
    app.config['TRACKS_FOLDER'] = tracks_path
    
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'defaultsecret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI')
    #app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    app.register_blueprint(media_bp)
    app.register_blueprint(track_bp)
    app.register_blueprint(playlist_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp )
    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    print(app.url_map)
    app.run(host='0.0.0.0', port=5000, debug=True)
