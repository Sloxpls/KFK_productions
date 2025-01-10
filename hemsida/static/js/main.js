// main.js
import {
    handleFiles,
    uploadFiles,
    setupDragAndDrop,
    showPopup,
    closePopup
} from './upload.js';

// Element
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const confirmUpload = document.getElementById('confirm-upload');

// Event Listeners
uploadButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));
confirmUpload.addEventListener('click', uploadFiles);

// Setup drag-and-drop area
setupDragAndDrop();
