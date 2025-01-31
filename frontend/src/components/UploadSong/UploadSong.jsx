import { useState } from "react"

import "./UploadSong.css"

const UploadSong = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    song_file: null,
    img_file: null,
    producer: "",
    writer: "",
    tiktok: false,
    soundcloud: false,
    spotify: false,
    youtube: false,
    instagram: false,
    album_name: "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [`${name}_file`]: files[0]
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    Object.keys(formData).forEach(key => {
      if (key !== 'song_file' && key !== 'img_file') {
        data.append(key, formData[key]);
      }
    });
    
    if (formData.song_file) {
      data.append('song', formData.song_file);
    }
    if (formData.img_file) {
      data.append('image', formData.img_file);
    }

    try {
      console.log("Submitting form data:", formData)
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Track and album data submitted successfully!")
        setFormData({
          title: "",
          description: "",
          song_path: "",
          img_path: "",
          producer: "",
          writer: "",
          tiktok: false,
          soundcloud: false,
          spotify: false,
          youtube: false,
          instagram: false,
          album_name: "",
        })
      } else {
        alert("Failed to submit data. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
        <label htmlFor="song">Song File:</label>
        <input
          type="file"
          id="song"
          name="song"
          accept="audio/*"
          onChange={handleFileChange}
          required
        />
        {formData.song_file && (
          <div>Selected file: {formData.song_file.name}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="image">Cover Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {formData.img_file && (
          <div>
            <img 
              src={URL.createObjectURL(formData.img_file)} 
              alt="Preview" 
              style={{ maxWidth: '200px' }} 
            />
          </div>
        )}
      </div>

        <div className="form-group">
          <label htmlFor="producer">Producer:</label>
          <input type="text" id="producer" name="producer" value={formData.producer} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="writer">Writer:</label>
          <input type="text" id="writer" name="writer" value={formData.writer} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Platforms:</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="tiktok" checked={formData.tiktok} onChange={handleChange} />
              TikTok
            </label>
            <label>
              <input type="checkbox" name="soundcloud" checked={formData.soundcloud} onChange={handleChange} />
              SoundCloud
            </label>
            <label>
              <input type="checkbox" name="spotify" checked={formData.spotify} onChange={handleChange} />
              Spotify
            </label>
            <label>
              <input type="checkbox" name="youtube" checked={formData.youtube} onChange={handleChange} />
              YouTube
            </label>
            <label>
              <input type="checkbox" name="instagram" checked={formData.instagram} onChange={handleChange} />
              Instagram
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="album_name">Album Name:</label>
          <input type="text" id="album_name" name="album_name" value={formData.album_name} onChange={handleChange} />
        </div>

        <button type="submit" className="upload-button">Submit</button>
      </form>
    </div>
  )
}

export default UploadSong;

