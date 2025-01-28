import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadSong = async () => {
      const response = await api.getSong(id);
      setSong(response.data);
    };
    loadSong();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.updateSong(id, song);
    setIsEditing(false);
  };

  if (!song) return <div>Loading...</div>;

  return (
    <div className="song-detail">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label>
            Title:
            <input
              value={song.title}
              onChange={(e) => setSong({...song, title: e.target.value})}
            />
          </label>
          {/* Add other editable fields */}
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h2>{song.title}</h2>
          <MediaPlayer url={song.fileUrl} type={song.fileType} />
          <div className="details">
            <p>Producer: {song.producer}</p>
            <p>Writer: {song.writer}</p>
            <p>Socials: {song.socials?.join(', ')}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        </>
      )}
    </div>
  );
}