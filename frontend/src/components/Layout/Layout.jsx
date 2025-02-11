import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AudioPlayer from "./AudioPlayer";
import Header from "./Header";
import "./Layout.css";

const fetchTracks = async () => {
  const response = await fetch("/api/tracks");
  if (!response.ok) {
    throw new Error(`Tracks API error: ${response.status}`);
  }
  return response.json();
};

const Layout = () => {
  const { data: tracks, refetch: refreshTracks } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
    initialData: [],
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return (
    <div className="layout">
      <header className="layout-header">
        <Header />
      </header>
      <main className="layout-main">
        <Outlet context={{ tracks, refreshTracks }} />
      </main>
      <footer className="layout-footer">
        <AudioPlayer playlist={tracks} />
      </footer>
    </div>
  );
};

export default Layout;
