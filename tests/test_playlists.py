import pytest
from flask import Flask
from playlist_routes import playlist_bp
from database_models import db, Playlist

TEST_DB_URI = "sqlite:///:memory:"

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = TEST_DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(playlist_bp)

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    """Fixture to create a test client."""
    return app.test_client()

@pytest.fixture
def add_sample_playlist(app):
    """Fixture to add a sample playlist."""
    with app.app_context():
        playlist = Playlist(name="Sample Playlist")
        db.session.add(playlist)
        db.session.commit()
