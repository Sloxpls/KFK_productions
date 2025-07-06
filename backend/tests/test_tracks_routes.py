import io
import pytest
from backend.app import create_app, db

# pytest -s backend/tests/test_tracks_routes.py

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_upload_song(client):
    # Test with required fields
    data = {
        'title': 'Test Song',
        'description': 'A test song',
        'producer': 'Test Producer',
        'writer': 'Test Writer',
        'genre': 'Test Genre',
        'tiktok': 'true',
        'soundcloud': 'false',
        'spotify': 'true',
        'youtube': 'false',
        'instagram': 'false',
        'playlist_name': 'Test Playlist',
        'song_file': (io.BytesIO(b"test audio content"), 'test.mp3'),
    }
    response = client.post(
        '/api/upload-song',
        data=data,
        content_type='multipart/form-data'
    )
    print("\nUpload without image:", response.status_code, response.get_json())
    assert response.status_code == 201
    json_data = response.get_json()
    assert 'id' in json_data
    assert json_data['message'] == 'Song uploaded successfully'

    # Test missing required field (title) 
    data_missing_title = dict(data)
    data_missing_title['song_file'] = (io.BytesIO(b"test audio content"), 'test.mp3')
    del data_missing_title['title']
    response = client.post(
        '/api/upload-song',
        data=data_missing_title,
        content_type='multipart/form-data'
    )
    print("Upload missing title:", response.status_code, response.get_json())
    assert response.status_code == 400
    assert 'error' in response.get_json()