import { useState } from "react";

import usePlaylists from "../../hooks/usePlaylist";
import useTrackStore from "../../hooks/useTrackStore";
import { useAudioContext } from "../../contexts/AudioContext";
import "./AlbumList.css";

const AlbumList = () => {
  const { playlists, loading, error } = usePlaylists();
  const [ expandedPlaylist, setExpandedPlaylist] = useState(null);
	const { selectedTrack, setSelectedTrack } = useTrackStore();
  const { isPlaying, togglePlayPause, setPlaying } = useAudioContext();

  const togglePlaylist = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  const handleTrackClick = (track) => {
    if (selectedTrack?.id === track.id) {
      togglePlayPause();
    } else {
      if (isPlaying) {
        setPlaying(false);
      }
      setSelectedTrack(track);
      setTimeout(() => setPlaying(true), 0);
    }
  };

  if (loading) {
    return <div className="sidebar-loader">Loading...</div>;
  }

  if (error) {
    return <div className="sidebar-error">Error: {error.message}</div>;
  }

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Album collection</h2>
      <div className="playlist-container">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-item">
            <div
              className={`playlist-header ${expandedPlaylist === playlist.id ? 'expanded' : ''}`}
              onClick={() => togglePlaylist(playlist.id)}
            >
              <span className="playlist-name">{playlist.name}</span>
              <span className="playlist-toggle">
                {expandedPlaylist === playlist.id ? '−' : '+'}
              </span>
            </div>
            {expandedPlaylist === playlist.id && (
              <ul className="track-list">
                {playlist.tracks.map((track) => (
                  <li 
                  key={track.id} 
                  className={`track-item ${selectedTrack?.id === track.id && isPlaying ? 'playing' : ''}`}
                  onClick={() => handleTrackClick(track)}
                >
                  <span className="track-title">
                    {track.title}
                  </span>
                  <span className="indicator-container">
                    {selectedTrack?.id === track.id && (
                      <span className="playing-indicator">
                        {isPlaying ? '⏸' : '▶'}
                      </span>
                    )}
                  </span>
                </li>
                
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AlbumList;
