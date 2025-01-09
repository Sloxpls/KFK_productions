// DOM elements
const audioPlayer = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");
const coverImage = document.getElementById("cover");
const songList = document.getElementById("songs");

// Fetch songs from JSON file
fetch("src/data/songs.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load songs.json");
    }
    return response.json();
  })
  .then(songs => {
    populateSongList(songs);
  })
  .catch(error => console.error("Error:", error));

// Populate the song list
function populateSongList(songs) {
  songs.forEach((song, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = song.title;
    listItem.className = "song-item";
    listItem.addEventListener("click", () => {
      changeSong(songs, index);
    });
    songList.appendChild(listItem);
  });
}

// Change song and update UI
function changeSong(songs, index) {
  const selectedSong = songs[index];
  audioSource.src = selectedSong.audio;
  coverImage.src = selectedSong.cover;
  audioPlayer.load(); // Reload the audio player with the new source
  audioPlayer.play(); // Start playing the new song
}
