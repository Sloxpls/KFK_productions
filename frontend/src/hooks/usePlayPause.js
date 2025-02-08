import { useState, useCallback } from "react";

const usePlayPause = (audioRef) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play error: ", err));
    }
  }, [audioRef, isPlaying]);

  return { isPlaying, togglePlayPause };
};

export default usePlayPause;
