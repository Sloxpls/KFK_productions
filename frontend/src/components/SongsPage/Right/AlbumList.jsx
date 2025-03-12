import { useState } from "react";
import { 
  Button, 
  TextField, 
} from "@mui/material";
import PropTypes from "prop-types";

import usePlaylists from "../../../hooks/usePlaylists";
import useDeleteConfirm from "../../../hooks/useDeleteConfirm";
import { getStatusLabel, getStatusClass } from "../../../utils/statusUtils";
import usePlaylistFiltering from "../../../hooks/usePlaylistFiltering";

import ConfirmDialog from "../../Common/ConfirmDialog";
import StatusFiltering from "./Statusfiltering";

import "./AlbumList.css";

const AlbumList = ({ onPlaylistSelect }) => {
  const { playlists, isLoading, error, createPlaylist, isCreating: isCreatingPlaylist, deletePlaylist } = usePlaylists();
  const [selectedId, setSelectedId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { itemToDelete, deleteConfirmOpen, confirmDeletion } = useDeleteConfirm(deletePlaylist);
  const [statusFilters, setStatusFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const filteredPlaylists = usePlaylistFiltering(playlists, statusFilters);


  const handleStatusFilterChange = (e) => {
    const { name, checked } = e.target;
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const resetFilters = () => {
    setStatusFilters({
      1: false,
      2: false,
      3: false,
      4: false,
    });
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist({ name: newPlaylistName });
      setNewPlaylistName("");
      setIsCreating(false);
    }
  };
  
  const handlePlaylistClick = (playlist) => {
    if (playlist?.id === selectedId) {
      setSelectedId(null);
      onPlaylistSelect(null);
      return;
    }
    setSelectedId(playlist?.id || null);
    onPlaylistSelect(playlist);
  };

  if (isLoading) {
    return <div className="sidebar-loader">Loading...</div>;
  }

  if (error) {
    return <div className="sidebar-error">Error: {error.message}</div>;
  }

  return (
    <aside className="sidebar">
      <div className="status-filters">
      </div>
        <div className="filters-container">
        <StatusFiltering
          statusFilters={statusFilters}
          onFilterChange={handleStatusFilterChange}
          onResetFilters={resetFilters}
        />
      </div>
      
      <div className="playlist-container">
        <div className="playlist-item">
          <div 
            className={`playlist-header ${selectedId === null ? 'selected' : ''}`}
            onClick={() => handlePlaylistClick(null)}
          >
            <span className="playlist-name">All Tracks</span>
          </div>
        </div>

        {filteredPlaylists.find(playlist => playlist.isVirtual) && (
          <div 
            className="playlist-item"
            data-virtual="true"
          >
            <div
              className={`playlist-header ${selectedId === 'no-playlist' ? 'selected' : ''}`}
              onClick={() => handlePlaylistClick(filteredPlaylists.find(p => p.isVirtual))}
            >
              <span className="playlist-name">No Playlist</span>
              <span className="track-count">
                {filteredPlaylists.find(p => p.isVirtual)?.tracks?.length || 0} unassigned tracks
              </span>
            </div>
          </div>
        )}
        
        {filteredPlaylists.filter(playlist => !playlist.isVirtual).map((playlist) => (
          <div 
            key={playlist.id} 
            className="playlist-item"
          >
            <div
              className={`playlist-header ${selectedId === playlist.id ? 'selected' : ''}`}
              onClick={() => handlePlaylistClick(playlist)}
            >
              <span className="playlist-name">{playlist.name}</span>
              <span className={`playlist-status ${getStatusClass(playlist.status)}`}>
                {getStatusLabel(playlist.status)}
              </span>
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
                sx={{ input: { color: 'white' } }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                disabled={isCreatingPlaylist}
              >
                {isCreatingPlaylist ? 'Creating...' : 'Create'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setIsCreating(false);
                  setNewPlaylistName("");
                }}
              >
                Cancel
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
        <ConfirmDialog 
          isOpen={deleteConfirmOpen}
          onClose={() => {}}
          onConfirm={confirmDeletion}
          title="Delete Playlist"
          message={`Are you sure you want to delete ${
            itemToDelete ? itemToDelete.name : "this item"
          }?`}
          confirmText="Delete"
        />
      </div>
    </aside>
  );
};

AlbumList.propTypes = {
  onPlaylistSelect: PropTypes.func.isRequired,
};

export default AlbumList;