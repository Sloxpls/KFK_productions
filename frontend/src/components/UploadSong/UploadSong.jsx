import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePlaylists from "../../hooks/usePlaylists";
import useChunkedUpload from "../../hooks/useChunkedUpload";
import "../../styles/forms.css";
import "./UploadSong.css";


const UploadSong = () => {
  const queryClient = useQueryClient();
  const { uploadFile, currentChunk, totalChunks, isUploading, chunkMessage } = useChunkedUpload();
  const { 
    playlistNames, 
    isLoading: playlistsLoading, 
    error: playlistsError,
    createPlaylist,
    isCreating: isCreatingPlaylist 
  } = usePlaylists();
  const isUploadinga = true

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    song_file: null,
    img_file: null,
    producer: "KFK",
    writer: "KFK",
    genre: "",
    tiktok: false,
    soundcloud: false,
    spotify: false,
    youtube: false,
    instagram: false,
    playlist_option: "",
    new_playlist_name: "",
  });

  const uploadSongMutation = useMutation({
    mutationFn: async (uploadData) => {
      const { file, trackData } = uploadData;
      
      if (trackData.playlist_option === "new") {
        await createPlaylist({ name: trackData.new_playlist_name });
      }

      return await uploadFile(file, {
        title: trackData.title,
        description: trackData.description,
        producer: trackData.producer,
        writer: trackData.writer,
        genre: trackData.genre,
        tiktok: trackData.tiktok.toString(),
        soundcloud: trackData.soundcloud.toString(),
        spotify: trackData.spotify.toString(),
        youtube: trackData.youtube.toString(),
        instagram: trackData.instagram.toString(),
        playlist_name: trackData.playlist_option === "new" 
          ? trackData.new_playlist_name 
          : trackData.playlist_option,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      alert("Song uploaded successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        song_file: null,
        img_file: null,
        producer: "KFK",
        writer: "KFK",
        genre: "",
        tiktok: false,
        soundcloud: false,
        spotify: false,
        youtube: false,
        instagram: false,
        playlist_option: "",
        new_playlist_name: "",
      });
    },
    onError: (error) => {
      console.error("Error uploading song:", error);
      alert(`Failed to upload song: ${error.message}`);
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? Boolean(checked) : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData((prev) => {
        if (name === "song_file") {
          const fileName = file.name.replace(/\.[^/.]+$/, ""); 
          return {
            ...prev,
            [name]: file,
            title: prev.title ? prev.title : fileName, 
          };
        }
        return {
          ...prev,
          [name]: file,
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.song_file) {
      alert("Please select a song file.");
      return;
    }

    uploadSongMutation.mutate({
      file: formData.song_file,
      trackData: formData
    });
  };

  const isUploadInProgress = uploadSongMutation.isPending || isUploading;

  return (
    <div className="form-container">
      {playlistsError && <div className="error-message">{playlistsError}</div>}
      <h1>Upload Song</h1>
      <form onSubmit={handleSubmit} className="form-base">

        <div className="form-group">
          <label htmlFor="song_file">Song File:</label>
          <input
            type="file"
            id="song_file"
            name="song_file"
            accept="audio/*"
            onChange={handleFileChange}
            required
            disabled={isUploadInProgress}
          />
          {formData.song_file && <div>Selected file: {formData.song_file.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            disabled={isUploadInProgress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            disabled={isUploadInProgress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="producer">Producer:</label>
          <input 
            type="text" 
            id="producer" 
            name="producer" 
            value={formData.producer} 
            onChange={handleChange}
            disabled={isUploadInProgress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="writer">Writer:</label>
          <input 
            type="text" 
            id="writer" 
            name="writer" 
            value={formData.writer} 
            onChange={handleChange}
            disabled={isUploadInProgress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input 
            type="text" 
            id="genre" 
            name="genre" 
            value={formData.genre} 
            onChange={handleChange}
            disabled={isUploadInProgress}
          />
        </div>

        <div className="form-group">
          <label>Platforms:</label>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                name="tiktok" 
                checked={formData.tiktok} 
                onChange={handleChange}
                disabled={isUploadInProgress}
              />
              <span className="platform-label">TikTok</span>
            </label>
            <label>
              <input 
                type="checkbox" 
                name="soundcloud" 
                checked={formData.soundcloud} 
                onChange={handleChange}
                disabled={isUploadInProgress}
              />
              Soundcloud
            </label>
            <label>
              <input 
                type="checkbox" 
                name="spotify" 
                checked={formData.spotify} 
                onChange={handleChange}
                disabled={isUploadInProgress}
              />
              Spotify
            </label>
            <label>
              <input 
                type="checkbox" 
                name="youtube" 
                checked={formData.youtube} 
                onChange={handleChange}
                disabled={isUploadInProgress}
              />
              YouTube
            </label>
            <label>
              <input 
                type="checkbox" 
                name="instagram" 
                checked={formData.instagram} 
                onChange={handleChange}
                disabled={isUploadInProgress}
              />
              Instagram
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="playlist_option">Playlist:</label>
          {playlistsLoading ? (
            <div>Loading playlists...</div>
          ) : (
            <select
              name="playlist_option"
              value={formData.playlist_option}
              onChange={handleChange}
              disabled={isCreatingPlaylist || isUploadInProgress}
            >
              <option value="" disabled>
                Select a playlist
              </option>
              {playlistNames.map((playlistName) => (
                <option key={playlistName} value={playlistName}>
                  {playlistName}
                </option>
              ))}
              <option value="new">Create New Playlist</option>
            </select>
          )}
        </div>
        
        {formData.playlist_option === "new" && (
          <div className="form-group">
            <label htmlFor="new_playlist_name">New Playlist Name:</label>
            <input
              type="text"
              id="new_playlist_name"
              name="new_playlist_name"
              value={formData.new_playlist_name}
              onChange={handleChange}
              disabled={isCreatingPlaylist || isUploadInProgress}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-success" disabled={isUploadInProgress}>
          {isUploadInProgress ? 'Uploading...' : 'Upload Song'}
        </button>
        {isUploading && (
          <div className="upload-overlay">
              <div className="upload-content">
                <div className="chunk-counter">
                  <span className="chunk-current">{currentChunk}</span>
                  <span className="chunk-separator">/</span>
                  <span className="chunk-total">{totalChunks}</span>
                <div className="chunk-message">
                  {chunkMessage}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadSong;