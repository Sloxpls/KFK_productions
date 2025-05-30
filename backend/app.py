import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from api import track_bp, media_bp, playlist_bp, auth_bp, upload_bp, system_info_bp
from backend.database_models import db
from flask_migrate import Migrate


def create_app():
    app = Flask(__name__)

    # --- App Config ---
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'defaultsecret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



    # --- Register Blueprints ---
    app.register_blueprint(media_bp)
    app.register_blueprint(track_bp)
    app.register_blueprint(playlist_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(system_info_bp)



    # --- Initialize Flask Extensions ---
    db.init_app(app)
    migrate = Migrate(app, db, command='migrate')
    return app


if __name__ == '__main__':
    app = create_app()
    print(app.url_map)
    app.run(host='0.0.0.0', port=5000, debug=True)
