import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function SongList() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const loadSongs = async () => {
      const response = await api.getSongs();
      setSongs(response.data);
    };
    loadSongs();
  }, []);

  return (
    <div className="song-list">
      <h1>My Song Library</h1>
      <Link to="/upload" className="btn">Upload New Song</Link>

      <div className="grid">
        {songs.map(song => (
          <div key={song._id} className="song-card">
            <h3>{song.title}</h3>
            <MediaPlayer url={song.fileUrl} type={song.fileType} />
            <div className="meta">
              <p>Producer: {song.producer}</p>
              <p>Writer: {song.writer}</p>
              <Link to={`/song/${song._id}`} className="btn">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}