import { useOutletContext } from "react-router-dom";
import SongsTable from "./SongsTable.jsx";
import AlbumList from "./AlbumList.jsx";

import useTrackStore from "../../hooks/useTrackStore.js";

const SongsPage = () => {
  const { tracks } = useOutletContext(); 
  const { setSelectedTrack } = useTrackStore();

  return (
    <>
    <div className="songs-page">
      <div className="songs-content">
        <SongsTable tracks={tracks} onTrackSelect={setSelectedTrack} />
      </div>

      <div className="songs-sidebar">
        <AlbumList />
      </div>
    </div>
    </>
  );
};

export default SongsPage;
