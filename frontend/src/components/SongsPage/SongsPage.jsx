import { useOutletContext } from "react-router-dom";
import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SongsTable from "./SongViews/SongsTable.jsx";
import AlbumList from "./Right/AlbumList.jsx";
import LeftSidebar from "./Left/LeftSidebar.jsx";
import SongsGrid from "./SongViews/SongsGrid.jsx";
import ViewSwitcher from "./SongsHeader/ViewSwitcher.jsx";
import SearchBar from "./SongsHeader/SearchBar.jsx";
import SocialFilter from "./SongsHeader/SocialFilter.jsx";

import { useTrackFiltering } from "../../hooks/useTrackFiltering";
import useTrackStore from "../../hooks/useTrackStore.js";
import usePlaylists from "../../hooks/usePlaylists.js";

import "./SongsPage.css";

const SongsPage = () => {
  const { tracks } = useOutletContext(); 
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { setSelectedTrack } = useTrackStore();
  const [currentView, setCurrentView] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const { usePlaylistDetails } = usePlaylists();
  const { data: currentPlaylistData } = usePlaylistDetails(
    selectedPlaylist?.isVirtual ? null : selectedPlaylist?.id
  );
  const [socialFilters, setSocialFilters] = useState({
    tiktok: false,
    soundcloud: false,
    spotify: false,
    youtube: false,
    instagram: false
  });
  const [sortConfig] = useState({ key: 'title', direction: 'asc' });


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
  }

  const currentPlaylist = useMemo(() => {
  if (!selectedPlaylist) return null;
  
  if (selectedPlaylist.isVirtual) {
    return selectedPlaylist;
  }
  
  if (selectedPlaylist && !selectedPlaylist.isVirtual && !currentPlaylistData) {
    return { ...selectedPlaylist, tracks: [] }; // Empty tracks while loading
  }
  
    return currentPlaylistData;
  }, [selectedPlaylist, currentPlaylistData]);

  // Use the updated currentPlaylist in your JSX and filtering logic
  const { filteredAndSortedTracks } = useTrackFiltering(
    currentPlaylist ? currentPlaylist.tracks : tracks,
    searchTerm,
    sortConfig,
    socialFilters
  );

  const viewVariants = {
    initial: {
      rotateY: 90,  
      opacity: 1    
    },
    in: {
      rotateY: 0,   
      opacity: 1
    },
    out: {
      rotateY: -90, 
      opacity: 0
    }
  };

  const viewTransition = {
    duration: 0.4,
    ease: "easeInOut"
  };

  const renderContent = () => {
    const props = {
      tracks: filteredAndSortedTracks,
      onTrackSelect: setSelectedTrack,
      searchTerm
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          variants={viewVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ viewTransition}}
        >
          {currentView === 'table' ? (
            <SongsTable {...props} />
          ) : (
            <SongsGrid {...props} />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="songs-page">
      
      <div className="songs-left-sidebar">
        <LeftSidebar playlist={currentPlaylist} />
      </div>
      
      <div className="songs-content">
        <div className="songs-header">
          <ViewSwitcher 
            currentView={currentView} 
            onViewChange={setCurrentView} 
          />
          <SocialFilter 
            filters={socialFilters}
            onFilterChange={setSocialFilters}
          />
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search tracks by title, producer, or writer..."
            className="songs-search"
          />
        </div>
        {renderContent()}

      </div>
      
      <div className="songs-right-sidebar">
        <AlbumList onPlaylistSelect={handlePlaylistSelect} />
      </div>

      
      
    </div>
  );
};

export default SongsPage;
