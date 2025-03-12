import "./LeftSidebar.css";
import PlaylistInfo from "./PlaylistInfo";

import PropTypes from "prop-types";

const LeftSidebar = ({ playlist }) => {
  if (!playlist) return null;

  return (
    <PlaylistInfo playlist={playlist} />
  );
};

LeftSidebar.propTypes = {
  playlist: PropTypes.object,
};

export default LeftSidebar;