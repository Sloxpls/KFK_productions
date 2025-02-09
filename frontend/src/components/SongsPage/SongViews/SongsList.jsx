import { useState } from "react"
import { FixedSizeList as List } from "react-window"
import EditTrack from "../EditTrack"
import useTrackStore from "../../../hooks/useTrackStore"
import { useAudioContext } from "../../../contexts/AudioContext"
import { useTrackFiltering } from "../../../hooks/useTrackFiltering"
import "./SongsList.css"

const SongsList = ({ tracks, searchTerm }) => {
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

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const Row = ({ index, style }) => {
    const track = filteredAndSortedTracks[index]
    return (
      <div className="track-row" style={style}>
        <img src={track.img_path || "/placeholder.svg"} alt={track.title} className="track-image" />
        <div className="track-info">
          <span className="track-title">{track.title}</span>
          <span className="track-producer">{track.producer}</span>
          <span className="track-writer">{track.writer}</span>
        </div>
        <div className="track-actions">
          <button onClick={() => handlePlay(track)}>
            {selectedTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={() => handleEdit(track)}>Edit</button>
        </div>
      </div>
    )
  }

  return (
    <div className="large-track-list">
      <div className="list-header">
        <span onClick={() => handleSort("title")}>
          Title {sortConfig.key === "title" && (sortConfig.direction === "asc" ? "▲" : "▼")}
        </span>
        <span onClick={() => handleSort("producer")}>
          Producer {sortConfig.key === "producer" && (sortConfig.direction === "asc" ? "▲" : "▼")}
        </span>
        <span onClick={() => handleSort("writer")}>
          Writer {sortConfig.key === "writer" && (sortConfig.direction === "asc" ? "▲" : "▼")}
        </span>
      </div>
      <List height={600} itemCount={filteredAndSortedTracks.length} itemSize={60} width="100%">
        {Row}
      </List>
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

export default SongsList

