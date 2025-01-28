import { useState, useRef, useEffect } from "react";
import AudioVisualizer from "./AudioVisualizer.jsx";
import "../../styles/AudioPlayer.css";
import PropTypes from "prop-types";

const AudioPlayer = ({ playlist }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);

  const currentTrack = playlist[currentTrackIndex];

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex + 1 >= playlist.length ? 0 : prevIndex + 1
    );
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex - 1 < 0 ? playlist.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      const updateProgress = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      };
      audioRef.current.addEventListener("timeupdate", updateProgress);
      return () =>
        audioRef.current.removeEventListener("timeupdate", updateProgress);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = parseFloat(volume); // Ensure it's a number
  }
}, [volume]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
  <>
    <AudioVisualizer audioRef={audioRef} />
    <div className="audio-player">
      <audio ref={audioRef} src={currentTrack?.url}/>
      <img style={{margin: 25}}
           src={currentTrack?.cover || ""}
           alt="Album Cover"
           className="track-cover"
      />
      <div className="track-info">
        <h4>{currentTrack?.title || "No Track Selected"}</h4>
        <p>{currentTrack?.artist || "Unknown Artist"}</p>
      </div>

      <div className="controls">
        <button onClick={handlePrevious}>⏮</button>
        <button onClick={togglePlayPause}>{isPlaying ? "⏸" : "▶"}</button>
        <button onClick={handleNext}>⏭</button>
      </div>

      <div className="progress">
        <span>{formatTime(currentTime)}</span>
        <div
            className="progress-bar-container"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect(); // Use e.currentTarget to reference the clicked container
              const clickX = e.clientX - rect.left; // Calculate the X position of the click relative to the container
              const newTime = (clickX / rect.width) * duration; // Calculate the corresponding time
              audioRef.current.currentTime = newTime; // Set the new playback time
              setCurrentTime(newTime); // Update the state to reflect the new time
            }}
        >
          <div
              className="progress-bar"
              style={{
                width: `${(currentTime / duration) * 100}%`, // Adjust width dynamically
              }}
          ></div>
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="volume-control">
        <label htmlFor="volume">Volume: </label>
        <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
        />
      </div>
    </div>
  </>
  );
};

export default AudioPlayer;

AudioPlayer.propTypes = {
  playlist: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        cover: PropTypes.string,
      })
  ).isRequired,
}