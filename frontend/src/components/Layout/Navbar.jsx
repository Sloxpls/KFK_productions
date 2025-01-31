import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './Navbar.css';


const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('logged_in');
      window.location.href = "/";
    }
    catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      <NavLink to="/site/songs" className="nav-link" activeclassname="active">
        Songs
      </NavLink>
      <div className="nav-item">
        <Button
          id="upload-button"
          aria-controls={open ? 'upload-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className="nav-link"
          disableRipple
        >
          Upload
        </Button>
        <Menu
          id="upload-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'upload-button',
          }}
        >
          <MenuItem onClick={handleClose}>
            <NavLink to="/site/upload-song" className="dropdown-item" activeclassname="active">
              Song
            </NavLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NavLink to="/site/upload-media" className="dropdown-item" activeclassname="active">
              Media
            </NavLink>
          </MenuItem>
        </Menu>
      </div>
      <NavLink to="/site/media-gallery" className="nav-link" activeclassname="active">
        Media Gallery
      </NavLink>
      <NavLink to="/site/laboratory" className="nav-link" activeclassname="active">
        Laboratory
      </NavLink>
      <Button onClick={handleLogout} className="nav-link" disableRipple>
        Logout
      </Button>
    </nav>
  );
}

export default Navbar;