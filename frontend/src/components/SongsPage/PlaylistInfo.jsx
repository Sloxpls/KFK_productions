import { useState } from 'react';
import EditPlaylistModal from './EditPlaylistModal';
import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

import ConfirmDialog from '../Common/ConfirmDialog';
import useDeleteConfirm from '../../hooks/useDeleteConfirm';
import usePlaylists from '../../hooks/usePlaylists';
import { getStatusLabel, getStatusClass } from "../../utils/statusUtils";


import './PlaylistInfo.css';

const PlaylistInfo = ({ playlist: initialPlaylist }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { deletePlaylist, updatePlaylist } = usePlaylists();
  const { itemToDelete, deleteConfirmOpen, openConfirm, confirmDeletion } = useDeleteConfirm(deletePlaylist);
  
  const handleEditClose = () => {
    setIsEditModalOpen(false);
  };

  if (!initialPlaylist) return null;

  return (
    <div className="selected-playlist-info">
      <img 
        src={initialPlaylist.img_path ? `/api/playlists/${initialPlaylist.id}/image` : '/images/default-playlist.jpg'} 
        alt={initialPlaylist.name} 
        className="playlist-cover" 
      />
      <div className="playlist-details">
        <div className="playlist-header-row">
          <h2>{initialPlaylist.name}</h2>
        </div>
        
        {initialPlaylist.description && (
          <p className="playlist-description">{initialPlaylist.description}</p>
        )}
        
        <div className="playlist-meta">
          <span className={`playlist-status ${getStatusClass(initialPlaylist.status)}`}>
            {getStatusLabel(initialPlaylist.status)}
          </span>
          <p className="track-count">
            {initialPlaylist.tracks?.length || 0} tracks
          </p>
        </div>
        
        <div className="playlist-actions">
          <Button
            startIcon={<EditIcon />}
            onClick={() => setIsEditModalOpen(true)}
            size="small"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Edit
          </Button>
          <Button 
            id='delete-playlist' 
            onClick={() => openConfirm(initialPlaylist)}
            variant="contained"
            color="error"
            size="small"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <EditPlaylistModal
        open={isEditModalOpen}
        onClose={handleEditClose}
        playlist={initialPlaylist}
        updatePlaylist={updatePlaylist}
      />

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
  );
};

PlaylistInfo.propTypes = {
  playlist: PropTypes.object
};

export default PlaylistInfo;