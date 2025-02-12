import usePlaylists from "../../hooks/usePlaylists";
import "./AlbumList.css";
import { useState } from "react";
import { Button, TextField } from "@mui/material";

const AlbumList = ({ onPlaylistSelect }) => {
  const { playlists, isLoadingPlaylists, playlistsError, createPlaylist, isCreating: isCreatingPlaylist } = usePlaylists();
  const [selectedId, setSelectedId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist({ name: newPlaylistName });
      setNewPlaylistName("");
      setIsCreating(false);
    }
  };

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
        <div className="playlist-item">
          {isCreating ? (
            <form onSubmit={handleCreatePlaylist} style={{ display: 'flex', gap: '8px' }}>
              <TextField
                size="small"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                autoFocus
                sx={{
                  input: { color: 'white' }
                }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                disabled={isCreatingPlaylist}
              >
                {isCreatingPlaylist ? 'Creating...' : 'Create'}
              </Button>
            </form>
          ) : (
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => setIsCreating(true)}
              fullWidth
            >
              Create new playlist
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AlbumList;
