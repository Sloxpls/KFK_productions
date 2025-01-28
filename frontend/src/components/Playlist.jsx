import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    const loadPlaylists = async () => {
      const response = await api.getPlaylists();
      setPlaylists(response.data);
    };
    loadPlaylists();
  }, []);

  const createPlaylist = async () => {
    await api.createPlaylist({ name: newPlaylistName });
    setNewPlaylistName('');
    // Refresh playlists
  };

  return (
    <div className="playlist-manager">
      <h2>Playlists</h2>
      <div className="create-playlist">
        <input
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
        />
        <button onClick={createPlaylist}>Create</button>
      </div>

      <div className="playlist-list">
        {playlists.map(playlist => (
          <div key={playlist._id} className="playlist">
            <h3>{playlist.name}</h3>
            {/* Add song management here */}
          </div>
        ))}
      </div>
    </div>
  );
}