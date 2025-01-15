from db.models import db, Track, Song, Producer, Playlist

# Skapa testdata
def seed_data():
    producer = Producer(producer="Test Producer", lyriks_writer="Test Writer")
    db.session.add(producer)
    db.session.commit()

    song = Song(song_data=b"TestSongData", song_genere="Pop", song_duration=180)
    db.session.add(song)
    db.session.commit()

    track = Track(producer_id=producer.id, song_id=song.id, title="Test Track", beskrivning="This is a test track")
    db.session.add(track)
    db.session.commit()

    playlist = Playlist(name="My Test Playlist")
    db.session.add(playlist)
    db.session.commit()

    print("Test data added!")

# Lägg till testdata
if __name__ == '__main__':
    from app import app
    with app.app_context():
        seed_data()
