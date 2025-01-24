// laboratory.js
// Simple example that displays lyric "cards" in a .lyrics-cards container.

const lyrics = [
    { id: 1, title: "title", text: "Negerjon" },
    { id: 2, title: "tit", text: "Negerjon" },
];

document.addEventListener("DOMContentLoaded", async () => {
    createLyricsCard(lyrics);
});

function createLyricsCard(lyricsArray) {
    const container = document.querySelector(".lyrics-cards");
    if (!container) return;

    lyricsArray.forEach((lyric) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardTitle = document.createElement("h2");
        cardTitle.textContent = lyric.title;
        card.appendChild(cardTitle);

        const cardText = document.createElement("p");
        cardText.textContent = lyric.text;
        card.appendChild(cardText);

        container.appendChild(card);
    });
}
