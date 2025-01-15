from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Track(db.Model):
    __tablename__ = 'tracks'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    producer_id = db.Column(db.Integer, db.ForeignKey('producers.id'), nullable=True)
    img_id = db.Column(db.Integer, db.ForeignKey('image.id'), nullable=True)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=True)
    socials_id = db.Column(db.Integer, db.ForeignKey('social.id'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    beskrivning = db.Column(db.Text, nullable=True)
    created_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    song = db.relationship(
        'Song',
        backref='track',
        uselist=False,
        cascade="all, delete-orphan"
    )


class Song(db.Model):
    __tablename__ = 'song'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    song_data = db.Column(db.LargeBinary, nullable=True)
    song_genere = db.Column(db.Text, nullable=True)
    song_duration = db.Column(db.Integer, nullable=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), unique=True, nullable=False)  # Enforce one-to-one


class Producer(db.Model):
    __tablename__ = 'producers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    producer = db.Column(db.Text, nullable=False)
    lyriks_writer = db.Column(db.Text)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), unique=True)


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    img_data = db.Column(db.LargeBinary)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), unique=True)


class Playlist(db.Model):
    __tablename__ = 'playlists'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)


class PlaylistTrack(db.Model):
    __tablename__ = 'playlist_tracks'
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), primary_key=True)


class Video(db.Model):
    __tablename__ = 'video'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    video_data = db.Column(db.LargeBinary)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), unique=True)


class Social(db.Model):
    __tablename__ = 'social'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    instagram = db.Column(db.Text)
    youtube = db.Column(db.Text)
    spotify = db.Column(db.Text)
    tiktok = db.Column(db.Text)
    andra_medier = db.Column(db.Text)

class Media(db.Model):
    __tablename__ = 'media'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)  # e.g., 'image', 'video'
    file_data = db.Column(db.LargeBinary, nullable=False)
    uploaded_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    description = db.Column(db.Text, nullable=True)
