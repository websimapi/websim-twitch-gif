// Import modules and constants
import Utils from './utils.js';
import AnimationEngine from './animationEngine.js';
import ImageEditor from './imageEditor.js';
import GifGenerator from './gifGenerator.js';
import AIImageGenerator from './aiImageGen.js';

// Global application state
let frames = [];
let selectedAnimation = 'none';
let animationIntensity = 5;
let animationSpeed = 1;
let rainbowEffect = false;
let depthEffect = false;
let constants = {};

// Initialize application
async function initApp() {
    // Load constants
    try {
        const response = await fetch('./constants.json');
        constants = await response.json();
    } catch (error) {
        console.error('Failed to load constants:', error);
        return;
    }

    // Initialize modules
    const animationEngine = new AnimationEngine(constants);
    const imageEditor = new ImageEditor(constants);
    const gifGenerator = new GifGenerator(constants, animationEngine);
    const aiImageGen = new AIImageGenerator();

    // Get canvas context
    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d');

    // Initialize UI event handlers
    setupEventHandlers(animationEngine, imageEditor, gifGenerator, aiImageGen, ctx);
    
    // Initialize animation options
    initializeAnimationOptions();
}

function setupEventHandlers(animationEngine, imageEditor, gifGenerator, aiImageGen, ctx) {
    // Special effects selection
    document.querySelectorAll('.effect-option').forEach(option => {
        option.addEventListener('click', () => {
            const effect = option.dataset.effect;
            
            if (effect === 'rainbow') {
                rainbowEffect = !rainbowEffect;
                option.classList.toggle('selected');
            }
            
            updateLivePreview(animationEngine, gifGenerator);
        });
    });

    // Animation option selection
    document.querySelectorAll('.animation-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.animation-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            selectedAnimation = option.dataset.animation;
            updateLivePreview(animationEngine, gifGenerator);
        });
    });

    // Animation settings
    document.getElementById('animationSpeed').addEventListener('input', function() {
        animationSpeed = parseFloat(this.value);
        document.getElementById('animationSpeedValue').textContent = `${animationSpeed.toFixed(1)}x`;
        updateLivePreview(animationEngine, gifGenerator);
    });

    document.getElementById('animationIntensity').addEventListener('input', function() {
        animationIntensity = parseInt(this.value);
        document.getElementById('animationIntensityValue').textContent = animationIntensity;
        updateLivePreview(animationEngine, gifGenerator);
    });

    // File input handler
    document.getElementById('fileInput').addEventListener('change', async (e) => {
        frames = [];
        for (let file of e.target.files) {
            const frame = await createImageBitmap(file);
            frames.push(frame);
        }
        if (frames.length > 0) {
            drawPreview(frames[0], ctx);
            updateLivePreview(animationEngine, gifGenerator);
        }
    });

    // Edit image handler
    document.getElementById('editImage').addEventListener('click', () => {
        if (frames.length === 0) {
            alert('Please upload an image first!');
            return;
        }
        
        imageEditor.startEditor(frames[0]).then(newFrame => {
            if (newFrame) {
                frames[0] = newFrame;
                drawPreview(newFrame, ctx);
                updateLivePreview(animationEngine, gifGenerator);
            }
        });
    });

    // Generate GIF handler
    document.getElementById('generateGif').onclick = async function() {
        const settings = getImageSettings();
        
        if (frames.length === 0) {
            alert('Please upload some images first!');
            return;
        }

        const fps = parseInt(document.getElementById('fps').value);
        const quality = parseInt(document.getElementById('quality').value);
        const duration = parseInt(document.getElementById('duration').value);
        
        await gifGenerator.generateFinalGif(
            frames, settings, selectedAnimation, animationSpeed, 
            animationIntensity, rainbowEffect, fps, quality, duration
        );
    };

    // AI Image Generation handler
    document.getElementById('generateImage').addEventListener('click', async () => {
        const prompt = document.getElementById('imagePrompt').value.trim();
        const aspectRatio = document.getElementById('aspectRatio').value;
        const advancedMode = document.getElementById('advancedMode').checked;
        
        const imageUrl = await aiImageGen.generateImage(prompt, aspectRatio, advancedMode);
        
        if (imageUrl) {
            const img = new Image();
            img.onload = async function() {
                const frame = await createImageBitmap(img);
                frames = [frame];
                drawPreview(frame, ctx);
                updateLivePreview(animationEngine, gifGenerator);
            };
            img.src = imageUrl;
        }
    });

    // Clear canvas handler
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
}

function initializeAnimationOptions() {
    // Set default selected animation
    document.querySelector('[data-animation="none"]')?.classList.add('selected');
}

async function updateLivePreview(animationEngine, gifGenerator) {
    const previewCanvas = document.getElementById('previewAnimation');
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    if (frames.length === 0) return;

    const settings = getImageSettings();
    
    // Show loading indicator
    const livePreview = document.getElementById('livePreview');
    const loadingEl = Utils.createLoadingElement();
    livePreview.appendChild(loadingEl);
    
    try {
        const previewGifUrl = await gifGenerator.generatePreview(
            frames, settings, selectedAnimation, animationSpeed, animationIntensity, rainbowEffect
        );
        
        // Remove loading indicator
        loadingEl.remove();
        
        // Display the GIF
        const previewImg = new Image();
        previewImg.src = previewGifUrl;
        previewImg.width = 112;
        previewImg.height = 112;
        previewImg.style.position = 'absolute';
        previewImg.style.top = '0';
        previewImg.style.left = '0';
        
        // Clear previous preview and append new one
        while (livePreview.firstChild && livePreview.firstChild !== previewCanvas) {
            livePreview.removeChild(livePreview.firstChild);
        }
        livePreview.appendChild(previewImg);
    } catch (error) {
        loadingEl.remove();
        console.error('Error generating preview:', error);
    }
}

function drawPreview(frame, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(frame, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getImageSettings() {
    return {
        backgroundColor: document.getElementById('enableBackground').checked ? document.getElementById('backgroundColor').value : null,
        opacity: parseInt(document.getElementById('opacity').value),
        scale: parseInt(document.getElementById('scale').value)
    };
}

document.getElementById('enableBackground').addEventListener('change', function() {
    document.getElementById('backgroundColor').disabled = !this.checked;
    updateLivePreview(animationEngine, gifGenerator);
});

document.getElementById('backgroundColor').addEventListener('input', function() {
    document.getElementById('backgroundColorValue').textContent = this.value;
    updateLivePreview(animationEngine, gifGenerator);
});

document.querySelectorAll('.image-settings input, .image-settings select').forEach(input => {
    input.addEventListener('input', updateLivePreview(animationEngine, gifGenerator));
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);