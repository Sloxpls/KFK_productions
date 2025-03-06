import "./LeftSidebar.css";
import PlaylistInfo from "./PlaylistInfo";


const LeftSidebar = ({ playlist }) => {
  if (!playlist) return null;

  return (
    <PlaylistInfo playlist={playlist} />
  );
};

export default LeftSidebar;