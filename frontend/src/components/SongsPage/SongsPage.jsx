import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SongsTable from "./SongViews/SongsTable.jsx";
import AlbumList from "./AlbumList.jsx";
import LeftSidebar from "./LeftSidebar.jsx";
import SongsGrid from "./SongViews/SongsGrid.jsx";
import ViewSwitcher from "./SongsHeader/ViewSwitcher.jsx";
import SearchBar from "./SongsHeader/SearchBar.jsx";
import SocialFilter from "./SongsHeader/SocialFilter.jsx";

import { useTrackFiltering } from "../../hooks/useTrackFiltering";
import useTrackStore from "../../hooks/useTrackStore.js";
import "./SongsPage.css";

const SongsPage = () => {
  const { tracks } = useOutletContext(); 
  const { setSelectedTrack } = useTrackStore();
  const [currentView, setCurrentView] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
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
  };

  const { filteredAndSortedTracks } = useTrackFiltering(
    selectedPlaylist ? selectedPlaylist.tracks : tracks,
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
        <LeftSidebar />
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
