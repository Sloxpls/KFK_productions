import pytest
from flask import Flask
from backend import media_bp, db, Media, track_bp, Track

TEST_DB_URI = "sqlite:///:memory:"

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = TEST_DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(track_bp)

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def add_sample_track(app):
    with app.app_context():
        track = Track(
            title="Sample Track",
            description="A sample track for testing",
            song_path="/songs/sample.mp3",
            img_path="/images/sample.jpg",
            producer="Test Producer",
            writer="Test Writer"
        )
        db.session.add(track)
        db.session.commit()
