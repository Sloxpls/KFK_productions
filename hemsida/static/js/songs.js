export async function fetchSongs() {
    const songList = document.getElementById("song-list");

    try {
        const response = await fetch("/api/songs");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const songs = await response.json();
        populateSongs(songs, songList);
    } catch (error) {
        console.error("Failed to fetch songs:", error);
        showErrorMessage("Failed to load songs. Please try again later.", songList);
    }
}

function populateSongs(songs, songList) {
    const ul = songList.querySelector("ul");
    ul.innerHTML = ""; // Rensa befintligt innehåll

    songs.forEach((song) => {
        const li = document.createElement("li");

        const songDiv = document.createElement("div");
        songDiv.className = "song";

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "song-details";

        // Bild för låten
        const image = document.createElement("img");
        image.src = song.image_url; // URL för bild
        image.alt = `${song.filename} cover`;
        image.className = "song-image";

        // Titel
        const title = document.createElement("h3");
        title.textContent = song.filename;

        // Filtyp
        const fileType = document.createElement("p");
        fileType.textContent = `File Type: ${song.file_type}`;

        // Länk för nedladdning
        const downloadLink = document.createElement("a");
        downloadLink.href = song.download_url; // URL för nedladdning
        downloadLink.textContent = "Download";
        downloadLink.className = "download-link";

        // Länk för livestreaming
        const streamLink = document.createElement("a");
        streamLink.href = song.stream_url; // URL för livestream
        streamLink.textContent = "Stream";
        streamLink.className = "stream-link";

        // Lägg till elementen i song-details-diven
        detailsDiv.appendChild(image);
        detailsDiv.appendChild(title);
        detailsDiv.appendChild(fileType);
        detailsDiv.appendChild(downloadLink);
        detailsDiv.appendChild(streamLink);

        songDiv.appendChild(detailsDiv);
        li.appendChild(songDiv);
        ul.appendChild(li);
    });
}

function showErrorMessage(message, songList) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    songList.appendChild(errorMessage);
}
