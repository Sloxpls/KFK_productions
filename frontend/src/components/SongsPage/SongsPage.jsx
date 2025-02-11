import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import SongsTable from "./SongViews/SongsTable.jsx";
import AlbumList from "./AlbumList.jsx";
import LeftSidebar from "./LeftSidebar.jsx";
import SongsGrid from "./SongViews/SongsGrid.jsx";
import ViewSwitcher from "./ViewSwitcher.jsx";
import SearchBar from "./SearchBar.jsx";
import "./SongsPage.css";

import useTrackStore from "../../hooks/useTrackStore.js";

const SongsPage = () => {
  const { tracks } = useOutletContext(); 
  const { setSelectedTrack } = useTrackStore();
  const [currentView, setCurrentView] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const renderContent = () => {
    const props = {
      tracks,
      onTrackSelect: setSelectedTrack,
      searchTerm
    };

    switch (currentView) {
      case 'table':
        return <SongsTable {...props} />;
      case 'grid':
        return <SongsGrid {...props} />;
      default:
        return <SongsList {...props} />;
    }
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
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search tracks by title, producer, or writer..."
              className="songs-search"
            />
          </div>
          {renderContent()}
        </div>
      
      <div className="songs-right-sidebar">
        <AlbumList />
      </div>
    </div>
  );
};

export default SongsPage;
