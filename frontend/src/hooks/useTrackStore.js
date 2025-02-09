import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTrackStore = create(
  persist(
    (set) => ({
      selectedTrack: null,
      setSelectedTrack: (track) => set({ selectedTrack: track }),
      isPlaying: false,  
      setIsPlaying: (isPlaying) => set({ isPlaying }),
			volume: 0.5,
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'current-track',
    }
  )
);

export default useTrackStore;