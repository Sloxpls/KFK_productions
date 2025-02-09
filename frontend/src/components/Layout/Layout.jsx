import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AudioPlayer from "./AudioPlayer.jsx";

import Header from "./Header.jsx";
import "./Layout.css";

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
    refetchOnWindowFocus: true, // refetch when window regains focus
    refetchOnMount: true,       // refetch when component mounts
    refetchOnReconnect: true,   // refetch when internet reconnects
    staleTime: 30000,          // consider data fresh for 30 seconds
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
