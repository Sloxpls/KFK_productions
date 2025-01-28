import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UploadForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    producer: '',
    writer: '',
    socials: '',
    file: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    await api.createSong(data);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Upload New Song</h2>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      <input
        type="file"
        onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
        accept="audio/*,video/*,image/*"
        required
      />
      {/* Add other fields */}
      <button type="submit">Upload</button>
    </form>
  );
}