import { useEffect, useRef, useState } from "react";



const UploadMedia = () => {
  const songDropZoneRef = useRef(null);
  const imgDropZoneRef = useRef(null);
  const songFileInputRef = useRef(null);
  const imgFileInputRef = useRef(null);

  const [trackId, setTrackId] = useState(null);

  // Drag-and-Drop setup
  const setupDragAndDrop = (dropZone, fileInput) => {
    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("dragover");

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        dropZone.textContent = files[0].name;
      }
    });

    dropZone.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        dropZone.textContent = fileInput.files[0].name;
      }
    });
  };

  // Initialize drag-and-drop on mount
  useEffect(() => {
    const songDropZone = songDropZoneRef.current;
    const imgDropZone = imgDropZoneRef.current;
    const songFileInput = songFileInputRef.current;
    const imgFileInput = imgFileInputRef.current;

    setupDragAndDrop(songDropZone, songFileInput);
    setupDragAndDrop(imgDropZone, imgFileInput);
  }, []);

  // Form submission handler
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Tracks FormData
      const formDataTracks = new FormData();
      formDataTracks.append("title", document.getElementById("title").value || null);

      // Step 1: Upload Track and get track_id
      const trackResponse = await uploadToEndpoint("/api/tracks", formDataTracks);
      const generatedTrackId = trackResponse.id; // Assuming the response includes the generated track_id
      if (!generatedTrackId) {
        throw new Error("Failed to generate track ID.");
      }
      setTrackId(generatedTrackId);

      // Songs FormData
      const formDataSong = new FormData();
      const songFile = songFileInputRef.current.files[0];

      if (songFile) {
        formDataSong.append("song_file", songFile); // Attach the file
      } else {
        throw new Error("Song file is required");
      }

      formDataSong.append("song_genere", document.getElementById("song_genere").value || null);
      formDataSong.append("track_id", generatedTrackId); // Link to track ID
      await uploadToEndpoint("/api/songs", formDataSong);

      // Images FormData
      const formDataImg = new FormData();
      const imgFile = imgFileInputRef.current.files[0];
      if (imgFile) {
        formDataImg.append("img_file", imgFile);
      }
      formDataImg.append("track_id", generatedTrackId); // Link to track ID
      await uploadToEndpoint("/api/images", formDataImg);

      alert("All uploads were successful!");
    } catch (error) {
      console.error("Error during upload:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  // Utility function to upload data to an endpoint
  const uploadToEndpoint = async (endpoint, formData) => {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to upload to ${endpoint}`);
    }

    return response.json(); // Return JSON response for further use
  };

  return (
    <div className="container">
      <h1>Upload Data</h1>
      <form id="upload-form" onSubmit={handleFormSubmit}>
        {/* Track Information */}
        <fieldset>
          <legend>Track Information</legend>
          <label htmlFor="title">Track Title:</label>
          <input type="text" id="title" name="title" placeholder="Enter track title" required />
        </fieldset>

        {/* Producer Information */}
        <fieldset>
          <legend>Producer Information</legend>
          <label htmlFor="producer">Producer Name:</label>
          <input type="text" id="producer" name="producer" placeholder="Enter producer name" />
          <label htmlFor="lyriks_writer">Lyrics Writer:</label>
          <input type="text" id="lyriks_writer" name="lyriks_writer" placeholder="Enter lyrics writer" />
        </fieldset>

        {/* Song File */}
        <fieldset>
          <legend>Song File</legend>
          <div
            id="song-drop-zone"
            className="drop-zone"
            ref={songDropZoneRef}
          >
            Drag and drop your song file here or click to select
          </div>
          <input
            type="file"
            id="song_file"
            name="song_file"
            accept=".mp3,.wav"
            ref={songFileInputRef}
            style={{ display: "none" }}
            required
          />
          <label htmlFor="song_genere">Song Genre:</label>
          <input type="text" id="song_genere" name="song_genere" placeholder="Enter song genre" />
        </fieldset>

        {/* Image Data */}
        <fieldset>
          <legend>Image Data</legend>
          <div
            id="img-drop-zone"
            className="drop-zone"
            ref={imgDropZoneRef}
          >
            Drag and drop your image file here or click to select
          </div>
          <input
            type="file"
            id="img_file"
            name="img_file"
            accept=".jpg,.png"
            ref={imgFileInputRef}
            style={{ display: "none" }}
            required
          />
        </fieldset>

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadMedia;
