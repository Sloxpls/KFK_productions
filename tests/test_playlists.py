import pytest
from flask import Flask
from backend.database_models import db, Playlist
from backend.api import playlist_bp

TEST_DB_URI = "sqlite:///:memory:"

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = TEST_DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(playlist_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def add_sample_playlists(app):
    with app.app_context():
        playlist1 = Playlist(name="Chill Vibes")
        playlist2 = Playlist(name="Workout Mix")
        db.session.add_all([playlist1, playlist2])
        db.session.commit()

def test_get_empty_playlists(client):
    response = client.get("/api/playlists")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 0

def test_get_playlists(client, add_sample_playlists):
    response = client.get("/api/playlists")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2
    assert data[0]["name"] == "Chill Vibes"
    assert data[1]["name"] == "Workout Mix"

def test_get_single_playlist(client, add_sample_playlists):
    response = client.get("/api/playlists/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "Chill Vibes"

def test_get_nonexistent_playlist(client):
    response = client.get("/api/playlists/999")
    assert response.status_code == 404
    data = response.get_json()
    assert data["error"] == "Playlist not found"

def test_create_playlist(client):
    new_playlist = {"name": "New Playlist"}
    response = client.post("/api/playlists", json=new_playlist)
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Playlist created"
    assert "id" in data

    response = client.get("/api/playlists")
    assert response.status_code == 200
    playlists = response.get_json()
    assert len(playlists) == 1
    assert playlists[0]["name"] == "New Playlist"

def test_create_playlist_missing_name(client):
    response = client.post("/api/playlists", json={})
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Name is required"

def test_update_playlist(client, add_sample_playlists):
    updated_data = {"name": "Updated Playlist"}
    response = client.put("/api/playlists/1", json=updated_data)
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Playlist updated"

    # Verify the update
    response = client.get("/api/playlists/1")
    assert response.status_code == 200
    playlist = response.get_json()
    assert playlist["name"] == "Updated Playlist"

def test_update_nonexistent_playlist(client):
    updated_data = {"name": "Updated Playlist"}
    response = client.put("/api/playlists/999", json=updated_data)
    assert response.status_code == 404
    data = response.get_json()
    assert data["error"] == "Playlist not found"

def test_delete_playlist(client, add_sample_playlists):
    response = client.delete("/api/playlists/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Playlist deleted"

    # Verify the playlist was deleted
    response = client.get("/api/playlists/1")
    assert response.status_code == 404

def test_delete_nonexistent_playlist(client):
    response = client.delete("/api/playlists/999")
    assert response.status_code == 404
    data = response.get_json()
    assert data["error"] == "Playlist not found"
