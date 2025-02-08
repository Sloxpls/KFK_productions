import { createContext, useContext, useRef, useState, useCallback} from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const setPlaying = useCallback((playing) => {
    if (!audioRef.current) return;
    
    if (playing) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Play error:", err));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    setPlaying(!isPlaying);
  }, [isPlaying, setPlaying]);

  return (
    <AudioContext.Provider value={{ 
      audioRef, 
      isPlaying, 
      togglePlayPause, 
      setPlaying 
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
