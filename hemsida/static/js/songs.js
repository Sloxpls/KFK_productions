document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#song-table-body");
    const errorMessage = document.querySelector("#error-message");
    const modal = document.querySelector("#song-modal");
    const closeModal = document.querySelector("#close-modal");

    // Modal Fields
    const modalTitle = document.querySelector("#modal-title");
    const modalGenre = document.querySelector("#modal-genre");
    const modalDuration = document.querySelector("#modal-duration");
    const modalDescription = document.querySelector("#modal-description");
    const modalDownload = document.querySelector("#modal-download");
    const modalStream = document.querySelector("#modal-stream");

    try {
        // Fetch songs from the API
        const response = await fetch("/api/songs");
        if (!response.ok) {
            throw new Error("Failed to fetch songs.");
        }
        const songs = await response.json();

        // Populate the table
        if (songs.length > 0) {
            songs.forEach(song => {
                const row = document.createElement("tr");

                // Add columns to the row
                row.innerHTML = `
                  <td>
                    <img src="/api/images/${song.track_id}" alt="Track Image" style="width: 50px; height: 50px; object-fit: cover;">
                  </td>
                  <td>${song.title || "N/A"}</td>
                  <td>${song.song_genere || "N/A"}</td>
                  <td>${song.song_duration || "N/A"} sekunder</td>
                  <td>
                    <a href="/api/songs/download/${song.track_id}" target="_blank">Ladda ner</a> |
                    <a href="/api/songs/stream/${song.track_id}" target="_blank">Streama</a>
                  </td>
                `;

                // Add click event to the row
                row.addEventListener("click", () => {
                    modal.style.display = "block"; // Show modal
                    modalTitle.textContent = song.title || "N/A";
                    modalGenre.textContent = song.song_genere || "N/A";
                    modalDuration.textContent = song.song_duration || "N/A";
                    modalDescription.textContent = "No description available."; // Replace with API data if available
                    modalDownload.href = `/api/songs/download/${song.track_id}`;
                    modalStream.href = `/api/songs/stream/${song.track_id}`;
                });

                tableBody.appendChild(row);
            });
        } else {
            errorMessage.textContent = "No songs found in the database.";
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        errorMessage.textContent = "An error occurred while fetching data.";
    }

    // Close modal when clicking the close button
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
