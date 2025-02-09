import { useMemo } from 'react';

export const useTrackFiltering = (tracks, searchTerm, sortConfig) => {
  const getComparator = (key, direction) => {
    return (a, b) => {
      const aValue = a[key]?.toLowerCase() || '';
      const bValue = b[key]?.toLowerCase() || '';
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    };
  };

  const filteredAndSortedTracks = useMemo(() => {
    let filtered = tracks;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = tracks.filter(track =>
        track.title?.toLowerCase().includes(searchLower) ||
        track.description?.toLowerCase().includes(searchLower) ||
        track.producer?.toLowerCase().includes(searchLower) ||
        track.writer?.toLowerCase().includes(searchLower)
      );
    }
    return [...filtered].sort(getComparator(sortConfig.key, sortConfig.direction));
  }, [tracks, searchTerm, sortConfig]);

  return { filteredAndSortedTracks };
};