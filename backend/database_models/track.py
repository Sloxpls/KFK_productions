from . import db

class Track(db.Model):
    __tablename__ = 'tracks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    song_path = db.Column(db.String(255), nullable=False)
    img_path = db.Column(db.String(255), nullable=True)
    producer = db.Column(db.String(255), nullable=True)
    writer = db.Column(db.String(255), nullable=True)
    tiktok = db.Column(db.Boolean, nullable=True)
    soundcloud = db.Column(db.Boolean, nullable=True)
    spotify = db.Column(db.Boolean, nullable=True)
    youtube = db.Column(db.Boolean, nullable=True)
    instagram = db.Column(db.Boolean, nullable=True)
