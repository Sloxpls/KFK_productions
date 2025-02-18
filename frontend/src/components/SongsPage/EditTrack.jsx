import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Box, Typography, TextField, Button, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import usePlaylists from "../../hooks/usePlaylists";
import "./EditTrack.css";

const updateTrack = async (trackData) => {
  const response = await fetch(`/api/tracks/${trackData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trackData.trackDetails),
  });
  if (!response.ok) {
    throw new Error("Failed to update track data.");
  }

  const addPromises = trackData.selectedPlaylistsToAdd.map(playlistId =>
    fetch(`/api/playlists/${playlistId}/tracks/${trackData.id}`, { method: "POST" })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to add track to playlist ${playlistId}`);
        return res.json();
      })
  );

  const removePromises = trackData.selectedPlaylistsToRemove.map(playlistId =>
    fetch(`/api/playlists/${playlistId}/tracks/${trackData.id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to remove track from playlist ${playlistId}`);
        return res.json();
      })
  );

  await Promise.all([...addPromises, ...removePromises]);
  return response.json();
};

const EditTrack = ({ open, onClose, track }) => {
  const [editedTrack, setEditedTrack] = useState(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [initialPlaylists, setInitialPlaylists] = useState([]);
  const queryClient = useQueryClient();
  const { playlists, isLoadingPlaylists } = usePlaylists();

  // Update internal state when track prop changes or modal opens
  // and store initial data for comparison
  useEffect(() => {
    if (track && open) {
      setEditedTrack({...track});
      // Get the playlists that contain this track
      const trackPlaylists = playlists
        .filter(playlist => playlist.tracks.some(t => t.id === track.id))
        .map(playlist => playlist.id);
      setInitialPlaylists(trackPlaylists);
      setSelectedPlaylists(trackPlaylists);
    }
  }, [track, open, playlists]);

  const editTrackMutation = useMutation({
    mutationFn: updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating track:", error);
      alert("Failed to update track. Please try again.");
    },
  });

  if (!editedTrack) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedTrack(prev => ({
      ...prev,
      [name]: type === "checkbox" ? Boolean(checked) : value,
    }));
  };

  const handlePlaylistChange = (playlistId) => {
    setSelectedPlaylists(prev => {
      if (prev.includes(playlistId)) {
        return prev.filter(id => id !== playlistId);
      } else {
        return [...prev, playlistId];
      }
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const added = selectedPlaylists.filter(id => !initialPlaylists.includes(id));
    const removed = initialPlaylists.filter(id => !selectedPlaylists.includes(id));

    editTrackMutation.mutate({
      id: editedTrack.id,
      trackDetails: editedTrack,
      selectedPlaylistsToAdd: added,
      selectedPlaylistsToRemove: removed,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        maxHeight: "90vh",
        overflow: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit {editedTrack.title}
        </Typography>
        <form onSubmit={handleSave}>
          <TextField
            label="Title"
            name="title"
            value={editedTrack.title || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={editedTrack.description || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Producer"
            name="producer"
            value={editedTrack.producer || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Writer"
            name="writer"
            value={editedTrack.writer || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          
          <div className="form-sections-container">
            <FormGroup className="form-section">
              <Typography variant="subtitle1" className="section-title">
                Platforms
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editedTrack.tiktok || false}
                    onChange={handleChange}
                    name="tiktok"
                  />
                }
                label="TikTok"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editedTrack.soundcloud || false}
                    onChange={handleChange}
                    name="soundcloud"
                  />
                }
                label="Soundcloud"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editedTrack.spotify || false}
                    onChange={handleChange}
                    name="spotify"
                  />
                }
                label="Spotify"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editedTrack.youtube || false}
                    onChange={handleChange}
                    name="youtube"
                  />
                }
                label="YouTube"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editedTrack.instagram || false}
                    onChange={handleChange}
                    name="instagram"
                  />
                }
                label="Instagram"
              />
            </FormGroup>

            <FormGroup className="form-section">
              <Typography variant="subtitle1" className="section-title">
                Playlists
              </Typography>
              {isLoadingPlaylists ? (
                <Typography>Loading playlists...</Typography>
              ) : (
                playlists.map((playlist) => (
                  <FormControlLabel
                    key={playlist.id}
                    control={
                      <Checkbox
                        checked={selectedPlaylists.includes(playlist.id)}
                        onChange={() => handlePlaylistChange(playlist.id)}
                        name={`playlist-${playlist.id}`}
                      />
                    }
                    label={playlist.name}
                  />
                ))
              )}
            </FormGroup>
          </div>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            disabled={editTrackMutation.isLoading}
          >
            {editTrackMutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            onClick={onClose} 
            variant="contained" 
            color="secondary" 
            sx={{ mt: 2, ml: 2 }}
            disabled={editTrackMutation.isLoading}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditTrack;