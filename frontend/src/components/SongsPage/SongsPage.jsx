import { useOutletContext } from "react-router-dom";
import SongsTable from "./SongsTable.jsx";
import AlbumList from "./AlbumList.jsx";

const SongsPage = () => {
  const { tracks, setSelectedTrack } = useOutletContext(); 

  return (
    <>
      <SongsTable tracks={tracks} onTrackSelect={setSelectedTrack} />

      <div className="layout-sidebar">
        <AlbumList />
      </div>
    </>
  );
};

export default SongsPage;
