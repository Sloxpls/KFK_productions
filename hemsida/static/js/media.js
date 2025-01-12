document.addEventListener("DOMContentLoaded", async () => {
  const mediaGrid = document.querySelector("#media-grid");
  const errorMessage = document.querySelector("#error-message");

  try {
    // Fetch media data from the server
    const response = await fetch("/api/media");
    if (!response.ok) {
      throw new Error("Failed to fetch media data.");
    }
    const media = await response.json();

    // Populate the media grid
    if (media.length > 0) {
      media.forEach(item => {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");

        if (item.type === "image") {
          mediaItem.innerHTML = `
            <img src="${item.url}" alt="Image">
            <p>${item.name}</p>
          `;
        } else if (item.type === "video") {
          mediaItem.innerHTML = `
            <video src="${item.url}" controls></video>
            <p>${item.name}</p>
          `;
        }

        mediaGrid.appendChild(mediaItem);
      });
    } else {
      errorMessage.textContent = "No media found.";
    }
  } catch (error) {
    console.error("Error fetching media:", error);
    errorMessage.textContent = "An error occurred while fetching media.";
  }
});
