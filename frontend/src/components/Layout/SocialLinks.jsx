import Button from '@mui/material/Button';

import { useState } from 'react';

import { TextField, Modal, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../hooks/useAuth';

const links = [
  {
    name: "TikTok",
    icon: "/icons/tiktok.svg",
    link: "https://www.tiktok.com/@kfkproductions",
  },
  {
    name: "Instagram",
    icon: "/icons/instagram.svg",
    link: "https://www.instagram.com/kfk_productions/profilecard/?igsh=d2Y4ZzBmYWNmdGl3",
  },
  {
    name: "Soundcloud",
    icon: "/icons/soundcloud.svg",
    link: "https://soundcloud.com/kfk-productions-859695953",
  },
  {
    name: "Spotify",
    icon: "/icons/spotify.svg",
    link: "https://open.spotify.com/artist/25wspmhehcm8c1tbNP88rO?si=XSMvEK1eQtqwCkxy7Pf4zQ",
  },
  {
    name: "YouTube",
    icon: "/icons/youtube.svg",
    link: "https://www.youtube.com/@KFK_productions",
  },
];

/* const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}; */

const SocialLinks = () => {
  /* const [links, setLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedLinks, setEditedLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const { isAuthenticated } = useAuth();

  const handleChange = (index, value) => {
    const updated = [...editedLinks];
    updated[index] = { ...updated[index], link: value };
    setEditedLinks(updated);
  };

  const handleSave = () => {
    setLinks(editedLinks);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setEditedLinks(links);
    setIsModalOpen(false);
  }; */

  return (
    <div className="socials">
      {links.map((social) => (
        <Button 
          key={social.name} 
          component="a" 
          href={social.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-button"
        >
          <img className="social-link" src={social.icon} alt={social.name} />
        </Button>
      ))}
      
      {/* {isAuthenticated && (
        <IconButton 
          onClick={() => setIsModalOpen(true)}
          size="small"
          sx={{ ml: 1 }}
        >
          <EditIcon />
        </IconButton>
      )} */}

      {/* <Modal
        open={isModalOpen}
        onClose={handleCancel}
        aria-labelledby="edit-social-links"
      >
        <Box sx={modalStyle}>
          {editedLinks.map((social, index) => (
            <TextField
              key={social.name}
              label={`${social.name} URL`}
              value={social.link}
              onChange={(e) => handleChange(index, e.target.value)}
              size="small"
              variant="outlined"
              fullWidth
              sx={{ mb: 2, }}
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal> */}
    </div>
  );
};

export default SocialLinks;
