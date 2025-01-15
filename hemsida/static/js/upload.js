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
