from . import db

class Playlist(db.Model):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

    tracks = db.relationship(
        'Track',
        secondary='playlist_tracks',
        backref=db.backref('playlists', lazy='dynamic'),
        lazy='dynamic'  # Query tracks lazily
    )
