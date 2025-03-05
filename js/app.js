import { fetchGifWorker } from './gifUtils.js';
import { setupAccordion } from './uiUtils.js';

// Global variables
let frames = [];
let gifWorkerBlob;
let selectedAnimation = 'none';
let animationIntensity = 5;
let animationSpeed = 1;

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

function initializeApp() {
    // Initialize the canvas
    const canvas = document.getElementById('preview');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Set initial values for UI elements
    document.getElementById('fpsValue').textContent = '30 FPS';
    document.getElementById('qualityValue').textContent = '7';
    document.getElementById('durationValue').textContent = '3s';
    document.getElementById('animationSpeedValue').textContent = '1x';
    document.getElementById('animationIntensityValue').textContent = '5';
    
    // Fetch the GIF worker script
    fetchGifWorker().then(blob => {
        gifWorkerBlob = blob;
    });
    
    // Initialize accordion UI
    setupAccordion();
}

// Draw the preview image
function drawPreview(frame) {
    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

// Export all necessary functions and variables
export {
    initializeApp,
    frames,
    gifWorkerBlob,
    selectedAnimation,
    animationIntensity,
    animationSpeed,
    isEditing,
    currentTool,
    selectionStart,
    selectionEnd,
    isSelecting,
    selectedArea,
    brushSize,
    brushColor,
    undoStack,
    redoStack,
    drawPreview
};