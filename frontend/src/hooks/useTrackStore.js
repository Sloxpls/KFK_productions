import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTrackStore = create(
    persist(
        (set) => ({
            selectedTrack: null,
            setSelectedTrack: (track) => set({ selectedTrack: track }),
        }),
        {
            name: 'current-track',
        }
    )
);

export default useTrackStore;