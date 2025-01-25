from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .media import Media
from .track import Track
from .playlist import Playlist
from .playlist_track import PlaylistTrack
