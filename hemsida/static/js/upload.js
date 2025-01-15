document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.querySelector("#upload-form");
    const songDropZone = document.querySelector("#song-drop-zone");
    const imgDropZone = document.querySelector("#img-drop-zone");
    const songFileInput = document.querySelector("#song_file");
    const imgFileInput = document.querySelector("#img_file");

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

    setupDragAndDrop(songDropZone, songFileInput);
    setupDragAndDrop(imgDropZone, imgFileInput);


    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            // Tracks FormData
            const fromDataTracks = new FormData();
            fromDataTracks.append('title', document.getElementById('title').value || null);

            // Step 1: Upload Track and get track_id
            const trackResponse = await uploadToEndpoint('/api/tracks', fromDataTracks);
            const trackId = trackResponse.id; // Assuming the response includes the generated track_id
            console.log(trackId)
            if (!trackId) {
                throw new Error('Failed to generate track ID.');
            }

            // Songs FormData
            const fromDataSong = new FormData();

            const songFile = document.getElementById('song_file').files[0];
            console.log('Selected File:', songFile);


            if (songFile) {
                fromDataSong.append('song_file', songFile); // Attach the file
            } else {
                throw new Error('Song file is required');
            }

            fromDataSong.append('song_genere', document.getElementById('song_genere').value || null);

            fromDataSong.append('track_id', trackId); // Link to track ID
            await uploadToEndpoint('/api/songs', fromDataSong);

            // Images FormData
            const fromDataImg = new FormData();
            const imgFile = document.getElementById('img_file').files[0];
            if (imgFile) {
                fromDataImg.append('img_file', imgFile);
            }
            fromDataImg.append('track_id', trackId); // Link to track ID
            await uploadToEndpoint('/api/images', fromDataImg);

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
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to upload to ${endpoint}`);
        }

        return response.json(); // Return JSON response for further use
    }

});
