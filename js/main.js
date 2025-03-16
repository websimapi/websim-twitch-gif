// Main app state and event handlers
let frames = [];
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
let selectedAnimation = 'none';
let animationIntensity = 5;
let animationSpeed = 1;
let rainbowEffect = false;
let depthEffect = false;
let previewGif = null;

// Image editor variables
let isEditing = false;
let currentTool = 'brush';
let selectionStart = { x: 0, y: 0 };
let selectionEnd = { x: 0, y: 0 };
let isSelecting = false;
let selectedArea = null;
let brushSize = 5;
let brushColor = '#ffffff';
let undoStack = [];
let redoStack = [];

// Special effects selection
document.querySelectorAll('.effect-option').forEach(option => {
    option.addEventListener('click', () => {
        const effect = option.dataset.effect;
        
        if (effect === 'rainbow') {
            rainbowEffect = !rainbowEffect;
            option.classList.toggle('selected');
        }
        
        updateLivePreview();
    });
});

// Animation option selection
document.querySelectorAll('.animation-option').forEach(option => {
    option.addEventListener('click', () => {
        // Remove rainbow-effect since it's now in special effects
        document.querySelectorAll('.animation-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        selectedAnimation = option.dataset.animation;
        updateLivePreview();
    });
});

// Animation settings
document.getElementById('animationSpeed').addEventListener('input', function() {
    animationSpeed = parseFloat(this.value);
    document.getElementById('animationSpeedValue').textContent = `${animationSpeed.toFixed(1)}x`;
    updateLivePreview();
});

document.getElementById('animationIntensity').addEventListener('input', function() {
    animationIntensity = parseInt(this.value);
    document.getElementById('animationIntensityValue').textContent = animationIntensity;
    updateLivePreview();
});

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

// Update value displays
document.getElementById('fps').addEventListener('input', function() {
    document.getElementById('fpsValue').textContent = `${this.value} FPS`;
});

document.getElementById('quality').addEventListener('input', function() {
    document.getElementById('qualityValue').textContent = this.value;
});

document.getElementById('duration').addEventListener('input', function() {
    document.getElementById('durationValue').textContent = `${this.value}s`;
});

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

document.getElementById('clearCanvas').addEventListener('click', () => {
    frames = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('fileInput').value = '';
    selectedAnimation = 'none';
    document.querySelectorAll('.animation-option').forEach(opt => {
        if (opt.dataset.animation !== 'rainbow-effect') {
            opt.classList.remove('selected');
        }
    });
    document.querySelector('[data-animation="none"]').classList.add('selected');
    
    const previewCanvas = document.getElementById('previewAnimation');
    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCanvas.style.animation = 'none';
});