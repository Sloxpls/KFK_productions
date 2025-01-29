import { useOutletContext } from "react-router-dom";
import SongsTable from "./SongsTable.jsx";

const SongsPage = () => {
  const { tracks, setSelectedTrack } = useOutletContext(); 

  return (
    <>
      <SongsTable tracks={tracks} onTrackSelect={setSelectedTrack} />
    </>
  );
};

export default SongsPage;
