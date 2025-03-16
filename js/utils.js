// Utility functions
let gifWorkerBlob;

// Fetch GIF Worker
fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
    .then(response => response.blob())
    .then(blob => {
        gifWorkerBlob = blob;
    });

function getImageSettings() {
    return {
        backgroundColor: document.getElementById('enableBackground').checked ? document.getElementById('backgroundColor').value : null,
        opacity: parseInt(document.getElementById('opacity').value),
        scale: parseInt(document.getElementById('scale').value)
    };
}

