document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#song-table-body");
    const errorMessage = document.querySelector("#error-message");

    try {
        const [songsResponse, socialResponse] = await Promise.all([
            fetch("/api/songs"),
            fetch("/api/socials")
        ]);

        if (!songsResponse.ok) {
            throw new Error(`Songs API responded with status ${songsResponse.status}: ${songsResponse.statusText}`);
        }

        if (!socialResponse.ok) {
            throw new Error(`Socials API responded with status ${socialResponse.status}: ${socialResponse.statusText}`);
        }

        /*const songs = await songsResponse.json();
        const socials = await socialResponse.json();*/
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
        ]
        const socials = [
          {
            track_id: 1,
            instagram: "https://www.instagram.com/instagram/",
            youtube: "youtube.com/summerVibes",
            spotify: "spotify.com/summerVibes",
            tiktok: "@summerVibesTikTok",
            andra_medier: "bandcamp.com/summerVibes"
          },
          {
            track_id: 2,
            instagram: "@midnightGroove",
            youtube: "youtube.com/midnightGroove",
            spotify: "spotify.com/midnightGroove",
            tiktok: "@midnightGrooveOfficial",
            andra_medier: "soundcloud.com/midnightGroove"
          }
        ]

        if (songs.length > 0) {
            for (const song of songs) {
                const songSocials = socials.find((social) => social.track_id === song.track_id) || {};

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

    editableCells.forEach((cell) => {
        const originalText = cell.innerText;
        const input = document.createElement("input");
        input.type = "text";
        input.value = originalText;
        cell.innerHTML = "";
        cell.appendChild(input);

        const fieldName = cell.getAttribute("data-field");
        console.log(`Initial value for ${fieldName}: ${originalText}`);

        if (fieldName === "title" || fieldName === "song_genere") {
            tracksData[fieldName] = originalText;
        } else if (["instagram", "youtube", "spotify", "tiktok", "andra_medier"].includes(fieldName)) {
            socialData[fieldName] = originalText;
        }
    });

    console.log("Initial tracksData:", tracksData);
    console.log("Initial socialData:", socialData);

    const editButton = row.querySelector(".editButton");
    editButton.replaceWith(saveButton);

    saveButton.addEventListener("click", async () => {
        console.log("Save button clicked");

        editableCells.forEach((cell) => {
            const input = cell.querySelector("input");
            const fieldName = cell.getAttribute("data-field");
            const updatedValue = input.value;

            console.log(`Updated value for ${fieldName}: ${updatedValue}`);

            if (fieldName === "title" || fieldName === "song_genere") {
                tracksData[fieldName] = updatedValue;
            } else if (["instagram", "youtube", "spotify", "tiktok", "andra_medier"].includes(fieldName)) {
                socialData[fieldName] = updatedValue;
            }
        });

        console.log("Updated tracksData:", tracksData);
        console.log("Updated socialData:", socialData);

        try {
            if (Object.keys(tracksData).length > 0) {
                console.log("Sending tracksData to /api/tracks:", tracksData);
                const tracksResponse = await fetch(`/api/tracks/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(tracksData),
                });

                console.log("Tracks response status:", tracksResponse.status);
                if (!tracksResponse.ok) {
                    throw new Error("Failed to update tracks data.");
                }
            }

            if (Object.keys(socialData).length > 0) {
                console.log("Sending socialData to /api/social:", socialData);
                const socialResponse = await fetch(`/api/social/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(socialData),
                });

                console.log("Social response status:", socialResponse.status);
                if (!socialResponse.ok) {
                    throw new Error("Failed to update social data.");
                }
            }

            editableCells.forEach((cell) => {
                const input = cell.querySelector("input");
                cell.innerText = input.value;
            });

            isEditing = false;
            console.log("Save successful. Updating UI.");
            saveButton.replaceWith(editButton);
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("An error occurred while saving changes.");
        }
    });
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
            ? `<input type="text" value="${songSocials.instagram || ""}" data-field="instagram">`
            : (songSocials.instagram 
            ? `<a href="${songSocials.instagram}" target="_blank" rel="noopener noreferrer">
                <button type="button">
                    🔗 
                </button>
            </a>`
            : "N/A")}
    </td>
    <td class="editable" data-field="youtube">
        ${isEditing 
            ? `<input type="text" value="${songSocials.youtube || ""}" data-field="youtube">`
            : (songSocials.youtube || "N/A")}
    </td>
    <td class="editable" data-field="spotify">
        ${isEditing 
            ? `<input type="text" value="${songSocials.spotify || ""}" data-field="spotify">`
            : (songSocials.spotify || "N/A")}
    </td>
    <td class="editable" data-field="tiktok">
        ${isEditing 
            ? `<input type="text" value="${songSocials.tiktok || ""}" data-field="tiktok">`
            : (songSocials.tiktok || "N/A")}
    </td>
    <td class="editable" data-field="andra_medier">
        ${isEditing 
            ? `<input type="text" value="${songSocials.andra_medier || ""}" data-field="andra_medier">`
            : (songSocials.andra_medier || "N/A")}
    </td>
`;
