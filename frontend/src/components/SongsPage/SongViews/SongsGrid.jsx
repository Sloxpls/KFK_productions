import { useState } from "react"
import EditTrack from "../EditTrack"
import useTrackStore from "../../../hooks/useTrackStore"
import { useAudioContext } from "../../../contexts/AudioContext"
import { useTrackFiltering } from "../../../hooks/useTrackFiltering"
import "./SongsGrid.css"

const SongsGrid = ({ tracks, searchTerm }) => {
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" })
  const { selectedTrack, setSelectedTrack } = useTrackStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState(null)
  const { isPlaying, togglePlayPause } = useAudioContext()
  const { filteredAndSortedTracks } = useTrackFiltering(tracks, searchTerm, sortConfig)

  const handlePlay = (track) => {
    if (selectedTrack?.id === track.id) {
      togglePlayPause()
    } else {
      setSelectedTrack(track)
      togglePlayPause()
    }
  }

  const handleEdit = (track) => {
    setEditingTrack({ ...track }) // Make a copy of the track data to avoid interfering with streaming
    setIsModalOpen(true)
  }

  const handleSort = (column) => {
    setSortConfig((prevConfig) => ({
      key: column,
      direction: prevConfig.key === column && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  return (
    <div className="songs-grid-container">
      <div className="songs-grid-header">
        <div className="sort-button" onClick={() => handleSort("title")}>
          Title {sortConfig.key === "title" && (sortConfig.direction === "asc" ? "▲" : "▼")}
        </div>
        <div className="sort-button" onClick={() => handleSort("producer")}>
          Producer {sortConfig.key === "producer" && (sortConfig.direction === "asc" ? "▲" : "▼")}
        </div>
        <div className="sort-button" onClick={() => handleSort("writer")}>
          Writer {sortConfig.key === "writer" && (sortConfig.direction === "asc" ? "▲" : "▼")}
        </div>
      </div>
      <div className="songs-grid">
        {filteredAndSortedTracks.map((track) => (
          <div key={track.id} className="song-card">
            <img src={track.img_path || "/placeholder.svg"} alt={track.title} className="song-image" />
            <div className="song-info">
              <h3>{track.title}</h3>
              <p>{track.producer}</p>
              <p>{track.writer}</p>
              <p>{track.description}</p>
            </div>
            <div className="song-actions">
              <button onClick={() => handlePlay(track)}>
                {selectedTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
              </button>
              <button onClick={() => handleEdit(track)}>Edit</button>
            </div>
            <div className="song-socials">
              {track.tiktok && <span className="social-icon">TikTok</span>}
              {track.soundcloud && <span className="social-icon">SoundCloud</span>}
              {track.spotify && <span className="social-icon">Spotify</span>}
              {track.youtube && <span className="social-icon">YouTube</span>}
              {track.instagram && <span className="social-icon">Instagram</span>}
            </div>
          </div>
        ))}
      </div>
      <EditTrack
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setTimeout(() => setEditingTrack(null), 200)
        }}
        track={editingTrack}
      />
    </div>
  )
}

export default SongsGrid

