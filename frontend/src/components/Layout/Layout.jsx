import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer.jsx";
import "./Layout.css";
import Header from "./Header.jsx";

const Layout = () => {
  const [tracks, setTracks] = useState([]); 
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/tracks"); 
        if (!response.ok) {
          throw new Error(`Tracks API error: ${response.status}`);
        }
        const tracksData = await response.json();
        setTracks(tracksData); 
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);
 

  return (
    <>
      <div className="layout">
          <header className="layout-header">
            <Header />
          </header>

          <main className="layout-main">
            <Outlet context={{ tracks, setSelectedTrack, selectedTrack }} />
          </main>

          <footer className="layout-footer">
            <AudioPlayer playlist={tracks} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}/>
          </footer>
      </div>
    </>
  );
};

export default Layout;
