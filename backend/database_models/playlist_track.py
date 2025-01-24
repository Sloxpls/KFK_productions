from . import db

class PlaylistTrack(db.Model):
    __tablename__ = 'playlist_tracks'

    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), primary_key=True)
