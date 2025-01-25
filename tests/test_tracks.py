import pytest
from flask import Flask
from backend.database_models import db, Track
from backend.api import track_bp

TEST_DB_URI = "sqlite:///:memory:"

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = TEST_DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(track_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def add_sample_tracks(app):
    with app.app_context():
        track1 = Track(
            title="Track 1",
            description="First track description",
            song_path="/songs/track1.mp3",
            img_path="/images/track1.jpg",
            producer="Producer 1",
            writer="Writer 1"
        )
        track2 = Track(
            title="Track 2",
            description="Second track description",
            song_path="/songs/track2.mp3",
            img_path="/images/track2.jpg",
            producer="Producer 2",
            writer="Writer 2"
        )
        db.session.add(track1)
        db.session.add(track2)
        db.session.commit()

def test_get_empty_tracks_list(client):
    response = client.get("/api/tracks")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 0

def test_get_tracks(client, add_sample_tracks):
    response = client.get("/api/tracks")
    assert response.status_code == 200
    data = response.get_json()

    assert len(data) == 2

    track1 = data[0]
    assert "id" in track1
    assert track1["title"] == "Track 1"
    assert track1["description"] == "First track description"
    assert track1["song_path"] == "/songs/track1.mp3"
    assert track1["img_path"] == "/images/track1.jpg"
    assert track1["producer"] == "Producer 1"
    assert track1["writer"] == "Writer 1"

    track2 = data[1]
    assert "id" in track2
    assert track2["title"] == "Track 2"
    assert track2["description"] == "Second track description"
    assert track2["song_path"] == "/songs/track2.mp3"
    assert track2["img_path"] == "/images/track2.jpg"
    assert track2["producer"] == "Producer 2"
    assert track2["writer"] == "Writer 2"

def test_create_track(client):
    new_track = {
        "title": "New Track",
        "description": "This is a new track",
        "song_path": "/songs/new_track.mp3",
        "img_path": "/images/new_track.jpg",
        "producer": "New Producer",
        "writer": "New Writer"
    }
    response = client.post("/api/tracks", json=new_track)
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Track created"
    assert "id" in data

    response = client.get("/api/tracks")
    assert response.status_code == 200
    tracks = response.get_json()
    assert len(tracks) == 1
    assert tracks[0]["title"] == "New Track"

def test_get_single_track(client, add_sample_tracks):
    response = client.get("/api/tracks/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["title"] == "Track 1"
    assert data["description"] == "First track description"

def test_delete_track(client, add_sample_tracks):
    response = client.delete("/api/tracks/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Track deleted"

    # Verify the track was deleted
    response = client.get("/api/tracks/1")
    assert response.status_code == 404

def test_update_track(client, add_sample_tracks):
    updated_data = {
        "title": "Updated Track",
        "description": "Updated description",
        "song_path": "/songs/updated_track.mp3",
        "img_path": "/images/updated_track.jpg",
        "producer": "Updated Producer",
        "writer": "Updated Writer"
    }
    response = client.put("/api/tracks/1", json=updated_data)
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Track updated"

    response = client.get("/api/tracks/1")
    assert response.status_code == 200
    track = response.get_json()
    assert track["title"] == "Updated Track"
    assert track["description"] == "Updated description"
