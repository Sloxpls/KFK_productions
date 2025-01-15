document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#song-table-body");
    const errorMessage = document.querySelector("#error-message");

    try{
        const response = await fetch("/api/songs");
        if (!response.ok) {
            throw new Error("Failed to fetch songs.");
        }

        const songs = await response.json();

        if (songs.length > 0) {
            songs.forEach(song => {
                const row = document.createElement("tr");


                row.innerHTML = `
                  <td>
                    <img src="/api/images/${song.track_id}" alt="Track Image" style="width: 50px; height: 50px; object-fit: cover;">
                  </td>
                  <td class="editable">${song.title || "N/A"}</td>
                  <td class="editable">${song.song_genere || "N/A"}</td>
                  <td class="editable">${song.song_duration || "N/A"} sekunder</td>
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

    const rows = tableBody.querySelectorAll('tbody tr');

    rows.forEach((row) => {
        const button = document.createElement('button')
        button.innerText = 'Redigera';
        button.className ='editButton'

        button.addEventListener('click', () => {
            editRow(id, row);
        });

        const newCell = row.insertCell(-1);
        newCell.appendChild(button);
    })
});

const editRow = (id, row) => {
    editableCells = row.querySelectorAll('.editable')
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Spara'
    saveButton.className = 'saveButton'

    editableCells.forEach(cell => {
        const originalText = cell.innerText;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        cell.innerHTML = '';
        cell.appendChild(input);
    });

    const editButton = row.querySelector('.editButton');
    editButton.replaceWith(saveButton);

    //save changes send http req

    

}


