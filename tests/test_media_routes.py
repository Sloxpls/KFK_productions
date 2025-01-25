import pytest
from flask import Flask
from backend.database_models import db, Media
from backend.api import media_bp

TEST_DB_URI = "sqlite:///:memory:"

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = TEST_DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(media_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def add_sample_data(app):
    with app.app_context():
        media_item = Media(
            filename="test.jpg",
            file_path="/uploads/test.jpg",
            description="A test media file"
        )
        db.session.add(media_item)
        db.session.commit()

def test_get_empty_media_list(client):
    response = client.get("/api/media")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 0

def test_get_media_list(client, add_sample_data):
    response = client.get("/api/media")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]["filename"] == "test.jpg"

def test_create_media(client):
    media_data = {
        "filename": "new_image.jpg",
        "file_path": "/uploads/new_image.jpg",
        "description": "A new media file"
    }
    response = client.post("/api/media", json=media_data)
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Media created successfully!"
    assert "id" in data

def test_get_single_media(client, add_sample_data):
    response = client.get("/api/media/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["filename"] == "test.jpg"
    assert data["file_path"] == "/uploads/test.jpg"

def test_delete_media(client, add_sample_data):
    response = client.delete("/api/media/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Media 1 deleted successfully"

    response = client.get("/api/media/1")
    assert response.status_code == 404
