document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.querySelector("#upload-form");
    const songDropZone = document.querySelector("#song-drop-zone");
    const imgDropZone = document.querySelector("#img-drop-zone");
    const songFileInput = document.querySelector("#song_file");
    const imgFileInput = document.querySelector("#img_file");

    // Function to setup drag-and-drop for a specific zone
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
                fileInput.files = files; // Assign the dropped files to the input element
                dropZone.textContent = files[0].name; // Show file name in the drop zone
            }
        });

        dropZone.addEventListener("click", () => {
            fileInput.click(); // Trigger file dialog on click
        });

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                dropZone.textContent = fileInput.files[0].name; // Show file name when selected
            }
        });
    }

    // Setup drag-and-drop for song and image files
    setupDragAndDrop(songDropZone, songFileInput);
    setupDragAndDrop(imgDropZone, imgFileInput);

    // Handle form submission
    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(uploadForm);

        try {
            const response = await fetch("/api/media", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file.");
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading your files.");
        }
    });
});
