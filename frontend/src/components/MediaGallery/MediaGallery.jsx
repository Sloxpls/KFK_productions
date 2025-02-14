import { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import { downloadMedia } from "../../utils/downloadUtils"
import "./MediaGallery.css"

const MediaGallery = () => {
  const [media, setMedia] = useState([])
  const [selectedMedia, setSelectedMedia] = useState(null)

  useEffect(() => {
    setMedia([
      {
        id: 1,
        name: "Gammal",
        file_path: "/flugsvamp.webp",
        description: "Cover image for Flugsvamp",
        uploaded_at: "2021-10-01T12:00:00Z",
      },
    ])
  }, [])
  
  /* useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/media");
        if (!response.ok) {
          throw new Error(`Media API error:", ${response.status}`);
        }
        const mediaData = await response.json();
        setMedia(mediaData);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchMedia();
  }, []); */

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem)
  }

  const closeModal = () => {
    setSelectedMedia(null)
  }

  return (
    <div className="media-gallery">
      <h1>Media Gallery</h1>
      <div className="media-grid">
        {media.map((item) => (
          <div key={item.id} className="media-item" onClick={() => handleMediaClick(item)}>
            <img src={item.file_path || "/placeholder.svg"} alt={item.description} />
            <div className="media-info">
              <p className="filename">{item.filename}</p>
              <p className="upload-date">{new Date(item.uploaded_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedMedia && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img src={selectedMedia.file_path || "/placeholder.svg"} alt={selectedMedia.description} />
            <h2>Filename: {selectedMedia.filename}</h2>
            <p>Description: {selectedMedia.description}</p>
            <p>Uploaded on: {new Date(selectedMedia.uploaded_at).toLocaleString()}</p>
            <Button onClick={() => downloadMedia(selectedMedia.id, selectedMedia.filename)}>
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaGallery;

