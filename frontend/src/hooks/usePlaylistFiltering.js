import { useMemo } from 'react';

export const usePlaylistFiltering = (playlists, statusFilters = {}) => {
  const filteredPlaylists = useMemo(() => {
    if (!playlists || !Array.isArray(playlists)) {
      return [];
    }
    
    const anyFilterActive = Object.values(statusFilters).some(value => value);
    
    if (!anyFilterActive) {
      return playlists;
    }
    
    return playlists.filter(playlist => statusFilters[playlist.status] === true);
  }, [playlists, statusFilters]);
  
  return filteredPlaylists;
};

export default usePlaylistFiltering;
