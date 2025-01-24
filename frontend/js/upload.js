// upload.js
// Handles the upload form, drag-and-drop for song_file and img_file.

document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.querySelector("#upload-form");
    const songDropZone = document.querySelector("#song-drop-zone");
    const imgDropZone = document.querySelector("#img-drop-zone");
    const songFileInput = document.querySelector("#song_file");
    const imgFileInput = document.querySelector("#img_file");

    if (!uploadForm) {
        // Not on the upload page, so do nothing.
        return;
    }

    function setupDragAndDrop(dropZone, fileInput) {
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
    }

    // Set up drag-and-drop for song and img
    if (songDropZone && songFileInput) setupDragAndDrop(songDropZone, songFileInput);
    if (imgDropZone && imgFileInput) setupDragAndDrop(imgDropZone, imgFileInput);

    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            // 1) Upload track metadata, get track_id
            const formDataTracks = new FormData();
            const titleValue = document.getElementById('title')?.value || null;
            formDataTracks.append('title', titleValue);

            const trackResponse = await uploadToEndpoint('/api/tracks', formDataTracks);
            const trackId = trackResponse.id; // from the backend
            if (!trackId) {
                throw new Error('Failed to generate track ID.');
            }

            // 2) Upload the audio file
            const formDataSong = new FormData();
            const songFile = document.getElementById('song_file').files[0];
            if (!songFile) {
                throw new Error('Song file is required');
            }
            formDataSong.append('song_file', songFile);
            formDataSong.append('song_genere', document.getElementById('song_genere')?.value || null);
            formDataSong.append('track_id', trackId);
            await uploadToEndpoint('/api/songs', formDataSong);

            // 3) Upload the image file
            const formDataImg = new FormData();
            const imgFile = document.getElementById('img_file').files[0];
            if (imgFile) {
                formDataImg.append('img_file', imgFile);
            }
            formDataImg.append('track_id', trackId);
            await uploadToEndpoint('/api/images', formDataImg);

            alert('All uploads were successful!');
        } catch (error) {
            console.error('Error during upload:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    async function uploadToEndpoint(endpoint, formData) {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to upload to ${endpoint}`);
        }
        return response.json();
    }
});
