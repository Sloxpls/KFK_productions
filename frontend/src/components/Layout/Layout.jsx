import { Outlet } from "react-router-dom";

import AudioPlayer from "./AudioPlayer.jsx";
import useTracks from "../../hooks/useTracks.js";

import Header from "./Header.jsx";
import "./Layout.css";

const Layout = () => {
  const { tracks, metadata, refreshTracks } = useTracks();

  return (
    <>
      <div className="layout">
          <header className="layout-header">
            <Header />
          </header>

          <main className="layout-main">
            <Outlet context={{ tracks, metadata, refreshTracks }} />
          </main>

          <footer className="layout-footer">
            <AudioPlayer playlist={tracks}/>
          </footer>
      </div>
    </>
  );
};

export default Layout;
