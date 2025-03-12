import { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import PropTypes from 'prop-types';

const EditPlaylistModal = ({ open, onClose, playlist, updatePlaylist }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    img_file: null,
    status: 4
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (playlist && open) {
      setFormData({
        name: playlist.name || '',
        description: playlist.description || '',
        img_file: null,
        status: playlist.status ? Number(playlist.status) : 4
      });
      
      // If there's an existing image path, set it as preview
      if (playlist.img_path) {
        setImagePreview(`/api/playlists/${playlist.id}/image`);
      } else {
        setImagePreview(null);
      }
    }
  }, [playlist, open]);

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('/api/')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create and set preview URL
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playlist || !formData.name.trim()) return;
  
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("status", formData.status);
      
      if (formData.img_file) {
        data.append("img_file", formData.img_file);
      }
      
      // Pass as a single object with named properties
      await updatePlaylist({ 
        playlistId: playlist.id, 
        formData: data 
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to update playlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-playlist-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography id="edit-playlist-title" variant="h6" component="h2" gutterBottom>
          Edit Playlist
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Playlist Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
              sx={{ bgcolor: 'white' }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'white',
                    '& .MuiMenuItem-root': {
                      bgcolor: 'white',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#e3f2fd',
                        '&:hover': {
                          bgcolor: '#bbdefb',
                        }
                      }
                    },
                    '& .MuiMenu-list': {
                      padding: 0
                    },
                    '& .MuiDivider-root': {
                      display: 'none'
                    }
                  }
                }
              }}
            >
              <MenuItem value={1}>Uploaded</MenuItem>
              <MenuItem value={2}>Pending</MenuItem>
              <MenuItem value={3}>Ready</MenuItem>
              <MenuItem value={4}>Work in progress</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Cover Image
            </Typography>
            
            <input
              type="file"
              id="img_file"
              name="img_file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="img_file">
              <Button
                variant="outlined"
                component="span"
                sx={{ mb: 2 }}
              >
                {formData.img_file ? 'Change Image' : 'Upload Image'}
              </Button>
            </label>
            
            {imagePreview && (
              <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "200px", 
                    objectFit: "contain",
                    borderRadius: "4px"
                  }}
                />
              </Box>
            )}
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

EditPlaylistModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  updatePlaylist: PropTypes.func.isRequired
};

export default EditPlaylistModal;