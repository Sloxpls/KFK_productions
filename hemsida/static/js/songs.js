document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#song-table-body");
    const errorMessage = document.querySelector("#error-message");

    try {
        const [songsResponse, socialResponse] = await Promise.all([
            fetch("/api/songs"),
            fetch("/api/socials")
        ]);

        if (!songsResponse.ok || !socialResponse.ok) {
            throw new Error("Failed to fetch data.");
        }

        const songs = await songsResponse.json();
        const socials = await socialResponse.json();

        if (songs.length > 0) {
            for (const song of songs) {
                const row = document.createElement("tr");
                row.dataset.id = song.track_id;

                row.innerHTML = `
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
                    <td class="editable" data-field="instagram">${socials.instagram || "N/A"}</td>
                    <td class="editable" data-field="youtube">${socials.youtube || "N/A"}</td>
                    <td class="editable" data-field="spotify">${socials.spotify || "N/A"}</td>
                    <td class="editable" data-field="tiktok">${socials.tiktok || "N/A"}</td>
                    <td class="editable" data-field="andra_medier">${socials.andra_medier || "N/A"}</td>
                `;

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

const editRow = (id, row) => {
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

            console.log("Save successful. Updating UI.");
            saveButton.replaceWith(editButton);
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("An error occurred while saving changes.");
        }
    });
};
