import os
from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from backend.database_models import db
from backend.api import track_bp, media_bp, playlist_bp, auth_bp, system_info_bp

# Load environment variables from .env file
load_dotenv()

# Initialize Flask-Migrate
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # --- Configuration ---
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'defaultsecret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- Initialize Extensions ---
    db.init_app(app)
    migrate.init_app(app, db)

    # --- Register Blueprints under /api ---
    app.register_blueprint(media_bp, url_prefix='/api')
    app.register_blueprint(track_bp, url_prefix='/api')
    app.register_blueprint(playlist_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(system_info_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()

    # Optional: print all available routes for debugging
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint:30s} {rule.methods} {rule.rule}")

    app.run(host='0.0.0.0', port=5000, debug=True)
