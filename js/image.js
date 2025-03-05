import { updateLivePreview } from './animation.js';

let frames = [];
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

export function setupImageControls() {
    document.getElementById('fileInput').addEventListener('change', async (e) => {
        frames = [];
        for (let file of e.target.files) {
            const frame = await createImageBitmap(file);
            frames.push(frame);
        }
        if (frames.length > 0) {
            drawPreview(frames[0]);
            updateLivePreview();
        }
    });

    document.getElementById('editImage').addEventListener('click', () => {
        if (frames.length === 0) {
            alert('Please upload an image first!');
            return;
        }
        
        startImageEditor(frames[0]);
    });

    document.getElementById('clearCanvas').addEventListener('click', () => {
        frames = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('fileInput').value = '';
        
        // Reset animation
        document.querySelector('[data-animation="none"]').click();
        
        const previewCanvas = document.getElementById('previewAnimation');
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    });

    // Setup image settings
    document.getElementById('enableBackground').addEventListener('change', function() {
        document.getElementById('backgroundColor').disabled = !this.checked;
        updateLivePreview();
    });

    document.getElementById('backgroundColor').addEventListener('input', function() {
        document.getElementById('backgroundColorValue').textContent = this.value;
        updateLivePreview();
    });

    document.querySelectorAll('.image-settings input, .image-settings select').forEach(input => {
        input.addEventListener('input', updateLivePreview);
    });
}

export function drawPreview(frame) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

export function getImageSettings() {
    return {
        backgroundColor: document.getElementById('enableBackground').checked ? document.getElementById('backgroundColor').value : null,
        opacity: parseInt(document.getElementById('opacity').value),
        scale: parseInt(document.getElementById('scale').value)
    };
}

export function getFrames() {
    return frames;
}

export function setFrames(newFrames) {
    frames = newFrames;
}

export { startImageEditor } from './editor.js';