import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import AudioPlayer from "./AudioPlayer.jsx";

const Layout = () => {
  const [tracks, setTracks] = useState([]); 
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/tracks"); 
        if (!response.ok) {
          throw new Error(`Tracks API error: ${response.status}`);
        }
        const tracksData = await response.json();
        setTracks(tracksData); // Update state with real tracks
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessages(["An error occurred while fetching tracks."]);
      }
    };

    fetchData();
  }, []);
 

  return (
    <>
      <Navbar />
      <Outlet context={{ tracks, setSelectedTrack, selectedTrack }} />
      <AudioPlayer playlist={tracks} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}/>
    </>
  );
};

export default Layout;
