import { Outlet } from "react-router-dom";
import AudioPlayer from "./AudioPlayer.jsx";
import { useQuery } from "@tanstack/react-query";
import "./Layout.css";
import Header from "./Header.jsx";

const fetchTracks = async () => {
  try {
    const response = await fetch("/api/tracks");
    if (!response.ok) {
      throw new Error(`Tracks API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error fetching data. Please try again later.");
  }
}

const Layout = () => {
  const { data: tracks, refetch: refreshTracks} = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
    initialData: [],
  });

  return (
    <>
      <div className="layout">
          <header className="layout-header">
            <Header />
          </header>

          <main className="layout-main">
            <Outlet context={{ tracks, refreshTracks }} />
          </main>

          <footer className="layout-footer">
            <AudioPlayer playlist={tracks}/>
          </footer>
      </div>
    </>
  );
};

export default Layout;
