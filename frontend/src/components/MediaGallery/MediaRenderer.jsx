import { useEffect, useState } from 'react';
import useMedia from '../../hooks/useMedia';

const MediaRenderer = ({ mediaItemId, isPreview = false }) => {
  const { serveMedia } = useMedia();
  const [mediaItem, setMediaItem] = useState(null);

  useEffect(() => {
    const fetchMediaItem = async () => {
      try {
        const item = await serveMedia(mediaItemId);
        setMediaItem(item);
      } catch (error) {
        console.error("Failed to fetch media item:", error);
      }
    };

    if (mediaItemId) {
      fetchMediaItem();
    }
  }, [mediaItemId, serveMedia]);

  if (!mediaItem) {
    return <div className="media-renderer error">No media item provided</div>;
  }

  const renderMedia = () => {
    const { url, mimeType } = mediaItem;
  
    switch (mimeType?.split('/')[0]) {
      case 'image':
        return <img src={url} alt={mediaItem.description || ''} />;
      case 'video':
        return (
          <video controls={!isPreview}>
            <source src={url} type={mimeType} />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return isPreview ? (
          <div className="audio-preview">
            <i className="fas fa-music"></i>
            <span>{mediaItem.name || 'Unknown Audio'}</span>
          </div>
        ) : (
          <audio controls>
            <source src={url} type={mimeType} />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return (
          <div className="file-preview">
            <i className="fas fa-file"></i>
            <span>{mediaItem.filename || 'Unknown File'}</span>
          </div>
        );
    }
  };

  return <div className={`media-renderer ${isPreview ? 'preview' : 'full'}`}>{renderMedia()}</div>;
};

export default MediaRenderer;