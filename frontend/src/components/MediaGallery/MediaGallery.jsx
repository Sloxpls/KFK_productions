import { useState } from "react";
import Button from "@mui/material/Button";
import MediaRenderer from "./MediaRenderer";
import ConfirmDialog from "../Common/ConfirmDialog";
import useMedia from "../../hooks/useMedia"; 
import "./MediaGallery.css";

const MediaGallery = () => {
  const { media, deleteMedia, loading, error, downloadMedia } = useMedia();

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const handleDeleteClick = (mediaItem) => {
    setMediaToDelete(mediaItem);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (mediaToDelete) {
      deleteMedia(mediaToDelete.id);
      setDeleteConfirmOpen(false);
      setMediaToDelete(null);
      closeModal();
    }
  };

  if (loading) return <p>Loading media...</p>;
  if (error) return <p>Error fetching media: {error.message}</p>;

  return (
    <div className="media-gallery">
      <h1>Media Gallery</h1>

      <div className="media-grid">
        {media.map((item) => (
          <div
            key={item.id}
            className="media-item"
            onClick={() => handleMediaClick(item)}
          >
            <MediaRenderer mediaItem={item} isPreview={true} />
            <div className="media-info">
              <p className="filename">{item.name}</p>
              <p className="upload-date">
                {new Date(item.uploaded_at).toLocaleDateString()}
              </p>
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
            <MediaRenderer mediaItem={selectedMedia} isPreview={false} />
            <h2>Name: {selectedMedia.name}</h2>
            <p>Description: {selectedMedia.description}</p>
            <p>
              Uploaded on: {new Date(selectedMedia.uploaded_at).toLocaleString()}
            </p>
            <Button
              onClick={() => downloadMedia(selectedMedia.id, selectedMedia.name)}
            >
              Download
            </Button>
            <Button onClick={() => handleDeleteClick(selectedMedia)}>Delete</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Media"
        message={`Are you sure you want to delete ${
          mediaToDelete?.filename || "this item"
        }?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default MediaGallery;
