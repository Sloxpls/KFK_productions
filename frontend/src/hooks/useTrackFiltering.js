import { useMemo } from 'react';

export const useTrackFiltering = (tracks, searchTerm, sortConfig, socialFilters = {}) => {
  // Precomputed search term lower-case
  const searchLower = searchTerm ? searchTerm.toLowerCase() : '';

  const activeFilters = useMemo(() => {
    return Object.entries(socialFilters)
      .filter(([_, isActive]) => isActive)
      .map(([platform]) => platform);
  }, [socialFilters]);

  const getComparator = (key, direction) => (a, b) => {
    const aValue = (a[key] && typeof a[key] === 'string' ? a[key].toLowerCase() : '');
    const bValue = (b[key] && typeof b[key] === 'string' ? b[key].toLowerCase() : '');
    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const filteredAndSortedTracks = useMemo(() => {
    // Filter tracks based on search term and active social filters
    const filtered = tracks.filter(track => {
      // Search condition
      let matchesSearch = true;
      if (searchLower) {
        matchesSearch =
          (track.title && track.title.toLowerCase().includes(searchLower)) ||
          (track.description && track.description.toLowerCase().includes(searchLower)) ||
          (track.producer && track.producer.toLowerCase().includes(searchLower)) ||
          (track.writer && track.writer.toLowerCase().includes(searchLower));
      }
      // Social filter condition
      let matchesSocial = true;
      if (activeFilters.length > 0) {
        matchesSocial = activeFilters.every(platform => !!track[platform]);
      }
      return matchesSearch && matchesSocial;
    });

    return filtered.sort(getComparator(sortConfig.key, sortConfig.direction));
  }, [tracks, searchLower, sortConfig, activeFilters]);

  return { filteredAndSortedTracks };
};