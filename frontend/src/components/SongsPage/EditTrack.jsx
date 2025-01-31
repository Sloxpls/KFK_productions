import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

/* const updateTrack = async (trackData) => {
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
}; */

const EditTrack = ({ open, onClose, track }) => {
  const [editedTrack, setEditedTrack] = useState({ ...track } ||{id: 1 });
  const queryClient = useQueryClient();

  const mutation = useMutation(updateTrack, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tracks']);
      onClose();
    },
    onError: (error) => {
      console.error("Error updating track:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTrack(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    mutation.mutate(editedTrack);
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
            {track.title}
        </Typography>
        <TextField
          label="title"
          name="title"
          value={editedTrack.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={editedTrack.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Producer"
          name="producer"
          value={editedTrack.producer}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Writer"
          name="writer"
          value={editedTrack.writer}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
          Save
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
            Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default EditTrack;