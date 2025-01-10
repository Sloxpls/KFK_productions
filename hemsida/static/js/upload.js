// upload.js

// Exporterade funktioner och variabler
export const selectedFiles = [];
export const updateFileList = () => {
    const fileList = document.getElementById('file-list');
    const confirmUpload = document.getElementById('confirm-upload');
    fileList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const listItem = document.createElement('div');
        listItem.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        listItem.className = 'file-item';
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFile(index);
        listItem.appendChild(removeButton);
        fileList.appendChild(listItem);
    });
    confirmUpload.disabled = selectedFiles.length === 0;
};

export const removeFile = (index) => {
    selectedFiles.splice(index, 1);
    updateFileList();
};

export const handleFiles = (files) => {
    for (let file of files) {
        if (!selectedFiles.includes(file)) {
            selectedFiles.push(file);
        }
    }
    updateFileList();
};

export const uploadFiles = () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
        if (file.type.startsWith('audio/')) {
            formData.append('song', file);
        } else if (file.type.startsWith('image/')) {
            formData.append('image', file);
        }
    });

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showPopup(data.error);
            } else {
                showPopup('Files uploaded successfully.');
                selectedFiles.length = 0;
                updateFileList();
            }
        })
        .catch(err => showPopup(`An error occurred: ${err.message}`));
};

export const showPopup = (message) => {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
};

export const closePopup = () => {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popupMessage.textContent = ''; // Rensa popup-meddelandet
};

export const setupDragAndDrop = () => {
    const dragDropArea = document.getElementById('drag-and-drop');
    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropArea.classList.add('drag-over');
    });
    dragDropArea.addEventListener('dragleave', () => {
        dragDropArea.classList.remove('drag-over');
    });
    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
};
