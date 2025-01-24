// songs.js
// Fetches songs & socials from /api/songs + /api/socials, populates #song-table-body,
// and allows editing each row's data (title, socials, etc.).

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#song-table-body");
    const errorMessage = document.querySelector("#error-message");

    if (!tableBody || !errorMessage) {
        // Not on the "songs" page, so do nothing.
        return;
    }

    try {
        // Example of fetching real data:
        // const [songsResponse, socialResponse] = await Promise.all([
        //     fetch("/api/songs"),
        //     fetch("/api/socials")
        // ]);
        // const songs = await songsResponse.json();
        // const socials = await socialResponse.json();

        // Temporary mock data for demonstration:
        const songs = [
          {
            track_id: 1,
            title: "Summer Vibes",
            song_genere: "Pop",
            song_duration: 210
          },
          {
            track_id: 2,
            title: "Midnight Groove",
            song_genere: "Jazz",
            song_duration: 180
          }
        ];
        const socials = [
          {
            track_id: 1,
            instagram: "https://www.instagram.com/instagram/",
            youtube: "https://www.youtube.com/summerVibes",
            spotify: "https://www.spotify.com/summerVibes",
            tiktok: "https://www.example.com",
            andra_medier: "https://www.example.com"
          },
          {
            track_id: 2,
            instagram: "@midnightGroove",
            youtube: "youtube.com/midnightGroove",
            spotify: "spotify.com/midnightGroove",
            tiktok: "@midnightGrooveOfficial",
            andra_medier: "soundcloud.com/midnightGroove"
          }
        ];

        if (songs.length > 0) {
            for (const song of songs) {
                const songSocials = socials.find(s => s.track_id === song.track_id) || {};

                const row = document.createElement("tr");
                row.dataset.id = song.track_id;
                row.innerHTML = generateRowHTML(song, songSocials, isEditing);

                const editButton = document.createElement("button");
                editButton.innerText = "Redigera";
                editButton.className = "editButton";
                editButton.addEventListener("click", () => editRow(song.track_id, row));

                const editCell = document.createElement("td");
                editCell.appendChild(editButton);
                row.appendChild(editCell);

                tableBody.appendChild(row);
            }
        } else {
            errorMessage.textContent = "No songs found in the database.";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        errorMessage.textContent = "An error occurred while fetching data.";
    }
});

let isEditing = false;

const editRow = (id, row) => {
    isEditing = true;
    console.log(`Editing row with ID: ${id}`);

    const editableCells = row.querySelectorAll(".editable");
    const saveButton = document.createElement("button");
    saveButton.innerText = "Spara";
    saveButton.className = "saveButton";

    const tracksData = {};
    const socialData = {};

    // Turn each editable cell into an <input>
    editableCells.forEach((cell) => {
        const originalText = cell.innerText;
        const input = document.createElement("input");
        input.type = "text";
        input.value = originalText;
        cell.innerHTML = "";
        cell.appendChild(input);

        const fieldName = cell.getAttribute("data-field");
        if (fieldName === "title" || fieldName === "song_genere") {
            tracksData[fieldName] = originalText;
        } else if (["instagram", "youtube", "spotify", "tiktok", "andra_medier"].includes(fieldName)) {
            socialData[fieldName] = originalText;
        }
    });

    const editButton = row.querySelector(".editButton");
    editButton.replaceWith(saveButton);

    saveButton.addEventListener("click", async () => {
        // Gather updated values
        editableCells.forEach((cell) => {
            const input = cell.querySelector("input");
            const fieldName = cell.getAttribute("data-field");
            const updatedValue = input.value;

            if (fieldName === "title" || fieldName === "song_genere") {
                tracksData[fieldName] = updatedValue;
            } else if (["instagram", "youtube", "spotify", "tiktok", "andra_medier"].includes(fieldName)) {
                socialData[fieldName] = updatedValue;
            }
        });

        try {
            // Update track data
            if (Object.keys(tracksData).length > 0) {
                const tracksResponse = await fetch(`/api/tracks/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tracksData),
                });
                if (!tracksResponse.ok) {
                    throw new Error("Failed to update tracks data.");
                }
            }

            // Update social links
            if (Object.keys(socialData).length > 0) {
                const socialResponse = await fetch(`/api/social/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(socialData),
                });
                if (!socialResponse.ok) {
                    throw new Error("Failed to update social data.");
                }
            }

            // Replace inputs with plain text
            editableCells.forEach((cell) => {
                const input = cell.querySelector("input");
                cell.innerText = input.value;
            });

            isEditing = false;
            saveButton.replaceWith(editButton);
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("An error occurred while saving changes.");
        }
    });
};

const generateEditableCell = (field, value, isEditing) => {
    if (isEditing) {
        return `<input type="text" value="${value || ""}" data-field="${field}">`;
    }
    return value || "N/A";
};

const generateLinkCell = (url, icon = "🔗") => {
    if (!url) return "N/A";
    return `
        <a href="${url}" target="_blank" rel="noopener noreferrer">
          <button type="button">${icon}</button>
        </a>
    `;
};

const generateRowHTML = (song, songSocials, isEditing) => `
    <td>
        <img 
          src="/api/images/${song.track_id}" 
          alt="Track Image" 
          style="width: 50px; height: 50px; object-fit: cover;"
        >
    </td>
    <td class="editable" data-field="title">${song.title || "N/A"}</td>
    <td class="editable" data-field="song_genere">${song.song_genere || "N/A"}</td>
    <td>${song.song_duration || "N/A"} sekunder</td>
    <td>
        <a href="/api/songs/download/${song.track_id}" download>Ladda ner</a>
        <br>
        <audio src="/api/songs/stream/${song.track_id}" controls></audio>
    </td>
    <td class="editable" data-field="instagram">
        ${isEditing 
            ? generateEditableCell("instagram", songSocials.instagram, isEditing)
            : generateLinkCell(songSocials.instagram)}
    </td>
    <td class="editable" data-field="youtube">
        ${isEditing 
            ? generateEditableCell("youtube", songSocials.youtube, isEditing)
            : generateLinkCell(songSocials.youtube)}
    </td>
    <td class="editable" data-field="spotify">
        ${isEditing 
            ? generateEditableCell("spotify", songSocials.spotify, isEditing)
            : generateLinkCell(songSocials.spotify)}
    </td>
    <td class="editable" data-field="tiktok">
        ${isEditing 
            ? generateEditableCell("tiktok", songSocials.tiktok, isEditing)
            : generateLinkCell(songSocials.tiktok)}
    </td>
    <td class="editable" data-field="andra_medier">
        ${isEditing 
            ? generateEditableCell("andra_medier", songSocials.andra_medier, isEditing)
            : generateLinkCell(songSocials.andra_medier)}
    </td>
`;

