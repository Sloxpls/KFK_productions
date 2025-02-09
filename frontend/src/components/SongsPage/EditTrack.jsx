import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Box, Typography, TextField, Button, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const updateTrack = async (trackData) => {
  const response = await fetch(`/api/tracks/${trackData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trackData),
  });
  if (!response.ok) {
    throw new Error("Failed to update track data.");
  }
  return response.json();
};

const EditTrack = ({ open, onClose, track }) => {
  const [editedTrack, setEditedTrack] = useState(null);
  const queryClient = useQueryClient();

  // Update internal state when track prop changes or modal opens
  useEffect(() => {
    if (track && open) {
      setEditedTrack({...track});
    }
  }, [track, open]);

  const editTrackMutation = useMutation({
    mutationFn: updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      alert("Track updated successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Error updating track:", error);
      alert("Failed to update track. Please try again.");
    },
  });

  // Don't render the form content if no track is being edited
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

  const handleSave = (e) => {
    e.preventDefault();
    editTrackMutation.mutate(editedTrack);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
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
          <FormGroup sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
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