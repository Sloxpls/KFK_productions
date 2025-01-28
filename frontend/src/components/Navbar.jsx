import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/site/songs" className="nav-link" activeclassname="active">
        Songs
      </NavLink>
      <NavLink to="/site/upload" className="nav-link" activeclassname="active">
        Uploads
      </NavLink>
      <NavLink to="/site/media" className="nav-link" activeclassname="active">
        Media Library
      </NavLink>
      <NavLink to="/site/laboratory" className="nav-link" activeclassname="active">
        Laboratory
      </NavLink>
    </nav>
  );
}

export default Navbar;
