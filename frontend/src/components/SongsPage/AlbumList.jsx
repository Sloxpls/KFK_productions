import usePlaylists from "../../hooks/usePlaylists";
import "./AlbumList.css";
import { useState } from "react";

const AlbumList = ({ onPlaylistSelect }) => {
  const { playlists, isLoadingPlaylists, playlistsError } = usePlaylists();
  const [selectedId, setSelectedId] = useState(null);

  if (isLoadingPlaylists) {
    return <div className="sidebar-loader">Loading...</div>;
  }

  if (playlistsError) {
    return <div className="sidebar-error">Error: {playlistsError.message}</div>;
  }

  const handlePlaylistClick = (playlist) => {
    setSelectedId(playlist?.id || null);
    onPlaylistSelect(playlist);
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Album collection</h2>
      <div className="playlist-container">
        <div className="playlist-item">
          <div 
            className={`playlist-header ${selectedId === null ? 'selected' : ''}`}
            onClick={() => handlePlaylistClick(null)}
          >
            <span className="playlist-name">All Tracks</span>
          </div>
        </div>
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-item">
            <div
              className={`playlist-header ${selectedId === playlist.id ? 'selected' : ''}`}
              onClick={() => handlePlaylistClick(playlist)}
            >
              <span className="playlist-name">{playlist.name}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AlbumList;
