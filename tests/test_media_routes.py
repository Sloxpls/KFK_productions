import pytest
from flask import Flask
from media_routes import media_bp
from database_models import db, Media

# Sample database URI for testing
TEST_DB_URI = "sqlite:///:memory:"

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = TEST_DB_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(media_bp)

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
