import "./SocialFilter.css";

const SocialFilter = ({ onFilterChange, filters }) => {
  const handleChange = (platform) => {
    onFilterChange({
      ...filters,
      [platform]: !filters[platform]
    });
  };

  return (
    <div className="social-filter">
      <div className="filter-checkboxes">
        <label className="service-tiktok">
          <input
            type="checkbox"
            checked={filters.tiktok}
            onChange={() => handleChange('tiktok')}
          />
          TikTok
        </label>
        <label className="service-soundcloud">
          <input
            type="checkbox"
            checked={filters.soundcloud}
            onChange={() => handleChange('soundcloud')}
          />
          SoundCloud
        </label>
        <label className="service-spotify">
          <input
            type="checkbox"
            checked={filters.spotify}
            onChange={() => handleChange('spotify')}
          />
          Spotify
        </label>
        <label className="service-youtube">
          <input
            type="checkbox"
            checked={filters.youtube}
            onChange={() => handleChange('youtube')}
          />
          YouTube
        </label>
        <label className="service-instagram">
          <input
            type="checkbox"
            checked={filters.instagram}
            onChange={() => handleChange('instagram')}
          />
          Instagram
        </label>
      </div>
    </div>
  );
};

export default SocialFilter;