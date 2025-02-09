import { useState } from 'react';
import '../../styles/forms.css';
import './UploadMedia.css';

const UploadMedia = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('file', formData.file);

    const response = await fetch('/api/media', {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      alert('Media uploaded successfully!');
      setFormData({ name: '', description: '', file: null });
      setPreview(null);
    } else {
      alert('Failed to upload media.');
    }
  };

  return (
    <div className="form-container">
      <h1>Upload Media</h1>
      <form
        className={`form-base ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onSubmit={handleSubmit}
      >
        <div
          className="file-drop-area"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="file-input"
            id="file"
            name="file"
            onChange={handleFile}
          />
          <label htmlFor="file" className="file-label">
            {formData.file ? formData.file.name : 'Drag & Drop your file here or Click to select'}
          </label>
        </div>
        {preview && <img src={preview} alt="Preview" className="file-preview" />}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadMedia;