import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";

import AudioVisualizer from "./AudioVisualizer";
import { useAudioContext } from "../../contexts/AudioContext";
import useTrackStore from "../../hooks/useTrackStore";
import "./AudioPlayer.css";

const AudioPlayer = ({ playlist }) => {
  const { selectedTrack, setSelectedTrack, volume, setVolume} = useTrackStore();
  const { audioRef, isPlaying, togglePlayPause,  } = useAudioContext();
  const isFirstLoad = useRef(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!selectedTrack || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = `/api/tracks/${selectedTrack.id}/stream`;
    audio.load();

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    } else {
      togglePlayPause();
    }
  }, [selectedTrack]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    // auto play next track dum lösning
    const handleTrackEnd = () => {
      handleNext(); 
      setTimeout(() => {
        togglePlayPause();
      }, 1000);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleTrackEnd);
    
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, []);

  const handleTrackChange = (direction) => {
    if (!selectedTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(
      (track) => track.id === selectedTrack.id
    );
    const newIndex =
      (currentIndex + direction + playlist.length) % playlist.length;
    setSelectedTrack(playlist[newIndex]);
    togglePlayPause();
  };

  const handlePrevious = () => handleTrackChange(-1);
  const handleNext = () => handleTrackChange(1);
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {/* <AudioVisualizer audioRef={audioRef} /> */}
      <div className="audio-player" role="region" aria-label="Audio player">
        <audio
          ref={audioRef}
          src={selectedTrack ? `/api/tracks/${selectedTrack.id}/stream` : ""}
        />
        <div className="track-cover-container">
          <img
            src={selectedTrack ? `/api/playlist-img-by-track/${selectedTrack.id}` : ""}
            alt="Album Cover"
            className="track-cover"
          />
        </div>
        <div className="player-info">
          <h4>{selectedTrack?.title || "No Track Selected"}</h4>
          <p>{selectedTrack?.producer || "Unknown Artist"}</p>
        </div>

        <div className="controls">
          <button className="player-control" onClick={handlePrevious}>⏮</button>
          <button className="player-control" data-control="play" onClick={togglePlayPause}>
            {isPlaying ? "⏸" : "▶️"}
          </button>
          <button className="player-control" onClick={handleNext}>⏭</button>
        </div>
        <div className="progress">
          <span>{formatTime(currentTime)}</span>
          <div
            className="progress-bar-container"
            onClick={(e) => {
              if (!audioRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }}
          >
            <div
              className="progress-bar"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span id="duration">{formatTime(duration)}</span>
        </div>
        <div className="volume-control">
          <label htmlFor="volume">Volume: </label>
          <Slider
            id="volume"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setVolume(newValue)}
          />
        </div>
      </div>
    </>
  );
};

AudioPlayer.propTypes = {
  playlist: PropTypes.array.isRequired,
};

export default AudioPlayer;
