import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import AudioPlayer from "./AudioPlayer.jsx";

const Layout = () => {
  const [tracks, setTracks] = useState([]); 
  const [selectedTrack, setSelectedTrack] = useState(null);

  
  useEffect(() => {
    setTracks([
      {
        id: 1,
        title: "Gammal Norrlands",
        description: "A hit song by Post Malone",
        song_path: "/Gammal Norrlands.mp3",
        img_path: "/gammal.webp",
        producer: "Producer A",
        writer: "Writer A",
        tiktok: true,
        soundcloud: true,
        spotify: true,
        youtube: true,
        instagram: false,
        album: "runk"
      },
      {
        id: 2,
        title: "Raka Regler Raka Rör",
        description: "rävig dunk",
        song_path: "/Raka Regler Raka Rör.mp3",
        img_path: "/raka.webp",
        producer: "Producer B",
        writer: "Writer B",
        tiktok: false,
        soundcloud: true,
        spotify: false,
        youtube: false,
        instagram: true,
        album: "dunk"
      }
      
    ]);
  }, []);

  

  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/<URL to joined track/album>"); 
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
  */

  return (
    <>
      <Navbar />
      <Outlet context={{ tracks, setSelectedTrack, selectedTrack }} />
      <AudioPlayer playlist={tracks} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}/>
    </>
  );
};

export default Layout;
