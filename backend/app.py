import os
from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from backend.database_models import db
from api import track_bp, media_bp, playlist_bp, auth_bp, upload_bp, system_info_bp

load_dotenv()

migrate = Migrate()  # Initialize Migrate globally

def create_app():
    app = Flask(__name__)

    # --- Configuration ---
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'defaultsecret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- Initialize Extensions ---
    db.init_app(app)
    migrate.init_app(app, db)  # Attach Flask-Migrate

    # --- Register Blueprints ---
    app.register_blueprint(media_bp)
    app.register_blueprint(track_bp)
    app.register_blueprint(playlist_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(system_info_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
