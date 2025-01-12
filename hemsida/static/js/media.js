document.addEventListener("DOMContentLoaded", async () => {
  const mediaGrid = document.querySelector("#media-grid");
  const uploadForm = document.querySelector("#upload-form");
  const dropZone = document.createElement("div");

  // Add a drag-and-drop area
  dropZone.id = "drop-zone";
  dropZone.textContent = "Drag and drop files here or click to upload";
  uploadForm.prepend(dropZone); // Add drop zone above the form

  // Fetch and display all media
  async function fetchMedia() {
    try {
      const response = await fetch("/api/media");
      if (!response.ok) {
        throw new Error("Failed to fetch media.");
      }

      const media = await response.json();
      mediaGrid.innerHTML = ""; // Clear the grid

      media.forEach(item => {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");

        // Handle different file types
        if (item.file_type === "image") {
          mediaItem.innerHTML = `
            <img src="/api/media/${item.id}" alt="${item.filename}">
            <p>${item.filename}</p>
            <a href="/api/media/${item.id}" download>Download</a>
          `;
        } else if (item.file_type === "video") {
          mediaItem.innerHTML = `
            <video src="/api/media/${item.id}" controls></video>
            <p>${item.filename}</p>
            <a href="/api/media/${item.id}" download>Download</a>
          `;
        } else if (item.file_type === "audio") {
          mediaItem.innerHTML = `
            <audio src="/api/media/${item.id}" controls></audio>
            <p>${item.filename}</p>
            <a href="/api/media/${item.id}" download>Download</a>
          `;
        }

        mediaGrid.appendChild(mediaItem);
      });
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  }

  // Handle drag-and-drop events
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
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append("file", file));

      // Upload files via drag-and-drop
      uploadFiles(formData);
    }
  });

  dropZone.addEventListener("click", () => {
    // Simulate a click on the file input to open file dialog
    const fileInput = uploadForm.querySelector("input[type='file']");
    fileInput.click();
  });

  // Handle file upload
  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);

    await uploadFiles(formData);
  });

  async function uploadFiles(formData) {
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
      fetchMedia(); // Refresh media list
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  // Initial fetch
  fetchMedia();
});
