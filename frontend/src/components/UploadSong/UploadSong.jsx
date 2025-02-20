import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import usePlaylists from "../../hooks/usePlaylists";
import "../../styles/forms.css";
import "./UploadSong.css";
import {authFetch} from "../../utils/httpReqToken.js";

const UploadSong = () => {
  const queryClient = useQueryClient();
  const {refreshTracks} = useOutletContext();
  const { 
    playlistNames, 
    isLoading: playlistsLoading, 
    error: playlistsError,
    createPlaylist,
    isCreating: isCreatingPlaylist 
  } = usePlaylists();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    song_file: null,
    img_file: null,
    producer: "",
    writer: "",
    genre: "",
    tiktok: false,
    soundcloud: false,
    spotify: false,
    youtube: false,
    instagram: false,
    playlist_option: "",
    new_playlist_name: "",
  });

  useEffect(() => {
    const objectUrl = formData.img_file ? URL.createObjectURL(formData.img_file) : null;
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [formData.img_file]);

  

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
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const uploadSongMutation = useMutation({
    mutationFn: async (formData) => {
      // If creating a new playlist, create it first
      if (formData.get("playlist_option") === "new") {
        await createPlaylist({ name: formData.get("playlist_name") });
      }

      const response = await authFetch("/api/upload-song", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload song");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      alert("Song uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        song_file: null,
        img_file: null,
        producer: "",
        writer: "",
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
      alert("Failed to upload song. Please try again.");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.song_file) {
      alert("Please select a song file.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("producer", formData.producer);
    data.append("writer", formData.writer);
    data.append("genre", formData.genre);

    data.append('tiktok', formData.tiktok ? 'true' : 'false');
    data.append('soundcloud', formData.soundcloud ? 'true' : 'false');
    data.append('spotify', formData.spotify ? 'true' : 'false');
    data.append('youtube', formData.youtube ? 'true' : 'false');
    data.append('instagram', formData.instagram ? 'true' : 'false');

    data.append("song_file", formData.song_file);
    data.append("img_file", formData.img_file);

    if (formData.playlist_option === "new") {
      data.append("playlist_name", formData.new_playlist_name);
    } else {
      data.append("playlist_name", formData.playlist_option);
    }

    uploadSongMutation.mutate(data);
  };

  return (
    <div className="form-container">
      {playlistsError && <div className="error-message">{playlistsError}</div>}
      <h1>Upload Song</h1>
      <form onSubmit={handleSubmit} className="form-base">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="song_file">Song File:</label>
          <input
            type="file"
            id="song_file"
            name="song_file"
            accept="audio/*"
            onChange={handleFileChange}
            required
          />
          {formData.song_file && <div>Selected file: {formData.song_file.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="img_file">Cover Image:</label>
          <input
            type="file"
            id="img_file"
            name="img_file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.img_file && (
            <div>
              <img
                src={URL.createObjectURL(formData.img_file)}
                alt="Preview"
                style={{ maxWidth: "200px" }}
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
          <label htmlFor="genre">Genre:</label>
          <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Platforms:</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="tiktok" checked={formData.tiktok} onChange={handleChange} />
              <span className="platform-label">TikTok</span>
            </label>
            <label>
              <input type="checkbox" name="soundcloud" checked={formData.soundcloud} onChange={handleChange} />
              Soundcloud
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
          <label htmlFor="playlist_option">Playlist:</label>
          {playlistsLoading ? (
            <div>Loading playlists...</div>
          ) : (
            <select
              name="playlist_option"
              value={formData.playlist_option}
              onChange={handleChange}
              disabled={isCreatingPlaylist}
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
              disabled={isCreatingPlaylist}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-success">
          Upload Song
        </button>
      </form>
    </div>
  );
};

export default UploadSong;