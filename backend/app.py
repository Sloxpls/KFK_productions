import os
from dotenv import load_dotenv
from flask import Flask
from api import track_bp, media_bp, playlist_bp, auth_bp
from backend.database_models import db  # Import the SQLAlchemy instance


def create_app():
    """Application Factory to create and configure the Flask app."""
    # Load environment variables
    load_dotenv()

    # Create the Flask app
    app = Flask(__name__)

    # Configure the app
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'defaultsecret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(media_bp, url_prefix='/api')
    app.register_blueprint(track_bp, url_prefix='/api')
    app.register_blueprint(playlist_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/')

    # Create database tables (only in development/testing)
    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    # Create and run the Flask app
    app = create_app()

    # Debug: Print the URL map to verify routes
    print(app.url_map)

    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)
