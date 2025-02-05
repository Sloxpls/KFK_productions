import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";

import AudioVisualizer from "./AudioVisualizer";
import useTrackStore from "../../hooks/useTrackStore";
import "./AudioPlayer.css";

const AudioPlayer = ({playlist}) => {
  const { selectedTrack, setSelectedTrack } = useTrackStore();
  const audioRef = useRef(null);
  const isFirstLoad = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!selectedTrack || !audioRef.current) return;
    const audio = audioRef.current;

    audio.pause();
    audio.src = `${selectedTrack.song_path}`;
    audio.load();

    if (!isFirstLoad.current) {
      audio.play().then(() => setIsPlaying(true)).catch((err) => console.log("Auto-play failed", err));
    } else {
      isFirstLoad.current = false; 
    }
  }, [selectedTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = parseFloat(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);


  const handlePrevious = () => {
    if (!selectedTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((track) => track.id === selectedTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setSelectedTrack(playlist[prevIndex]);
  };
  
  const handleNext = () => {
    if (!selectedTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((track) => track.id === selectedTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setSelectedTrack(playlist[nextIndex]);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <AudioVisualizer audioRef={audioRef} />
      <div className="audio-player">
        <audio 
          ref={audioRef} 
          src={selectedTrack ? `${selectedTrack.song_path}` : ""} 
        />
        <div className="track-cover-container">
          <img
            src={selectedTrack ? `${selectedTrack.img_path}` : ""}
            alt="Album Cover"
            className="track-cover"
          />
      </div>
        <div className="track-info">
          <h4>{selectedTrack?.title || "No Track Selected"}</h4>
          <p>{selectedTrack?.producer || "Unknown Artist"}</p>
        </div>

        <div className="controls">
          <button onClick={handlePrevious}>⏮</button>
          <button onClick={handlePlayPause}>
            {isPlaying ? "⏸" : "▶️"}
          </button>
          <button onClick={handleNext}>⏭</button>
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
              style={{
                width: `${(currentTime / duration) * 100}%`, 
              }}
          ></div>
        </div>
        <span id='duration'>{formatTime(duration)}</span>
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