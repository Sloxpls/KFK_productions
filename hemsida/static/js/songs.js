document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#song-table-body");
    const errorMessage = document.querySelector("#error-message");

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
                    <a href="/api/songs/download/${song.track_id}" download>Ladda ner</a>
                    <br>
                    <audio src="/api/songs/stream/${song.track_id}" controls></audio>
                  </td>
                `;

                tableBody.appendChild(row);
            });
        } else {
            errorMessage.textContent = "No songs found in the database.";
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        errorMessage.textContent = "An error occurred while fetching data.";
    }
});
