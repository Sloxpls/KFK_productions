from . import db
from flask_sqlalchemy import SQLAlchemy

class Track(db.Model):
    __tablename__ = 'tracks'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    song_path = db.Column(db.String(255), nullable=True)
    img_path = db.Column(db.String(255), nullable=True)

    producer = db.Column(db.String(255), nullable=True)
    writer = db.Column(db.String(255), nullable=True)
    genre = db.Column(db.String(255), nullable=True)

    tiktok = db.Column(db.Boolean, default=False)
    soundcloud = db.Column(db.Boolean, default=False)
    spotify = db.Column(db.Boolean, default=False)
    youtube = db.Column(db.Boolean, default=False)
    instagram = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "song_path": self.song_path,
            "img_path": self.img_path,
            "producer": self.producer,
            "writer": self.writer,
            "genre": self.genre,
            "tiktok": self.tiktok,
            "soundcloud": self.soundcloud,
            "spotify": self.spotify,
            "youtube": self.youtube,
            "instagram": self.instagram,
        }
