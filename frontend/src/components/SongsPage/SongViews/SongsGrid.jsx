import { useState } from "react"
import EditTrack from "../EditTrack"
import useTrackStore from "../../../hooks/useTrackStore"
import { useAudioContext } from "../../../contexts/AudioContext"
import { useTrackFiltering } from "../../../hooks/useTrackFiltering"
import useTracks from "../../../hooks/useTracks"; 
import "./SongsGrid.css"
import {Button} from "@mui/material";

const SongsGrid = ({ tracks, searchTerm }) => {
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" })
  const { selectedTrack, setSelectedTrack } = useTrackStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState(null)
  const { isPlaying, togglePlayPause } = useAudioContext()
  const { filteredAndSortedTracks } = useTrackFiltering(tracks, searchTerm, sortConfig)
  const { streamTrack, downloadTrack } = useTracks()

  const handlePlay = (track) => {
    if (selectedTrack?.id === track.id) {
      togglePlayPause()
    } else {
      setSelectedTrack({
        ...track,
        song_path: streamTrack(track.id),
      })
      togglePlayPause()
    }
  }

  const handleEdit = (track) => {
    setEditingTrack({ ...track }) // Make a copy of the track data to avoid interfering with streaming
    setIsModalOpen(true)
  }

  return (
    <div className="songs-container">
      <div className="songs-grid">
        {filteredAndSortedTracks.map((track) => (
          <div key={track.id} className="song-card">
            <img src={`/api/tracks/${track.id}/image`} alt={track.title} className="song-image" />
            <div className="song-info">
              <h3>{track.title}</h3>
              <p>{track.producer}</p>
              <p>{track.writer}</p>
              <p className="description">{track.description}</p>
            </div>
            <div className="song-actions">
              <button onClick={() => handlePlay(track)}>
                {selectedTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
              </button>
                <Button onClick={() => downloadTrack(track.id, `${track.title}.mp3`)}>
                  <u> ↓ </u>
                </Button>
              <button onClick={() => handleEdit(track)}>Edit</button>
            </div>
            <div className="song-socials">
              {track.tiktok && <img className="social-icon" src="/icons/tiktok.svg" alt="tiktok" />}
              {track.soundcloud && <img className="social-icon" src="/icons/soundcloud.svg" alt="soundcloud" />}
              {track.spotify && <img className="social-icon" src="/icons/spotify.svg" alt="spotify" />}
              {track.youtube && <img className="social-icon" src="/icons/youtube.svg" alt="youtube" />}
              {track.instagram && <img className="social-icon" src="/icons/instagram.svg" alt="instagram" />}
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

