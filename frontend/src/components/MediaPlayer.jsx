export default function MediaPlayer({ url, type }) {
  const renderMedia = () => {
    if (type?.startsWith('image/')) {
      return <img src={url} alt="Song cover" />;
    }
    if (type?.startsWith('audio/')) {
      return <audio controls src={url} />;
    }
    if (type?.startsWith('video/')) {
      return <video controls src={url} />;
    }
    return <p>Unsupported media type</p>;
  };

  return <div className="media-player">{renderMedia()}</div>;
}