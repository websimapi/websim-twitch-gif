import { 
    frames, 
    selectedAnimation, 
    animationIntensity, 
    animationSpeed, 
    drawPreview 
} from './app.js';
import { updateLivePreview } from './animationUtils.js';
import { generateGif } from './gifUtils.js';
import { startImageEditor } from './imageEditor.js';
import { generateAIImage } from './aiGeneration.js';

function setupEventListeners() {
    // File input event listener
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Animation option selection
    document.querySelectorAll('.animation-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.animation-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            window.selectedAnimation = option.dataset.animation;
            updateLivePreview();
        });
    });
    
    // Animation settings
    const animationSpeedInput = document.getElementById('animationSpeed');
    if (animationSpeedInput) {
        animationSpeedInput.addEventListener('input', function() {
            window.animationSpeed = parseFloat(this.value);
            document.getElementById('animationSpeedValue').textContent = `${window.animationSpeed.toFixed(1)}x`;
            updateLivePreview();
        });
    }
    
    const animationIntensityInput = document.getElementById('animationIntensity');
    if (animationIntensityInput) {
        animationIntensityInput.addEventListener('input', function() {
            window.animationIntensity = parseInt(this.value);
            document.getElementById('animationIntensityValue').textContent = window.animationIntensity;
            updateLivePreview();
        });
    }
    
    // Edit image button
    const editImageBtn = document.getElementById('editImage');
    if (editImageBtn) {
        editImageBtn.addEventListener('click', () => {
            if (window.frames.length === 0) {
                alert('Please upload an image first!');
                return;
            }
            
            startImageEditor(window.frames[0]);
        });
    }
    
    // Clear canvas button
    const clearCanvasBtn = document.getElementById('clearCanvas');
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', () => {
            window.frames = [];
            const canvas = document.getElementById('preview');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            document.getElementById('fileInput').value = '';
            window.selectedAnimation = 'none';
            document.querySelectorAll('.animation-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelector('[data-animation="none"]').classList.add('selected');
            
            const previewCanvas = document.getElementById('previewAnimation');
            const previewCtx = previewCanvas.getContext('2d');
            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            previewCanvas.style.animation = 'none';
        });
    }
    
    // Generate GIF button
    const generateGifBtn = document.getElementById('generateGif');
    if (generateGifBtn) {
        generateGifBtn.addEventListener('click', generateGif);
    }
    
    // Generate AI Image button
    const generateImageBtn = document.getElementById('generateImage');
    if (generateImageBtn) {
        generateImageBtn.addEventListener('click', generateAIImage);
    }
    
    // Image settings inputs
    document.querySelectorAll('.image-settings input, .image-settings select').forEach(input => {
        input.addEventListener('input', updateLivePreview);
    });
    
    // Background color picker
    const bgColorPicker = document.getElementById('backgroundColor');
    if (bgColorPicker) {
        bgColorPicker.addEventListener('input', function() {
            const alpha = parseInt(document.getElementById('backgroundAlpha').value);
            const hex = this.value;
            // Convert hex to rgba
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const rgba = `rgba(${r}, ${g}, ${b}, ${alpha/255})`;
            
            document.getElementById('backgroundColorValue').textContent = rgba;
            updateLivePreview();
        });
    }
    
    // Background alpha slider
    const bgAlphaSlider = document.getElementById('backgroundAlpha');
    if (bgAlphaSlider) {
        bgAlphaSlider.addEventListener('input', function() {
            const hex = document.getElementById('backgroundColor').value;
            const alpha = parseInt(this.value);
            document.getElementById('backgroundAlphaValue').textContent = alpha;
            
            // Convert hex to rgba
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const rgba = `rgba(${r}, ${g}, ${b}, ${alpha/255})`;
            
            document.getElementById('backgroundColorValue').textContent = rgba;
            updateLivePreview();
        });
    }
    
    // Toggle transparent background
    const toggleTransparentBtn = document.getElementById('toggleTransparent');
    if (toggleTransparentBtn) {
        toggleTransparentBtn.addEventListener('click', function() {
            document.getElementById('backgroundColorValue').textContent = 'transparent';
            updateLivePreview();
        });
    }
    
    // Update value displays
    const fpsInput = document.getElementById('fps');
    if (fpsInput) {
        fpsInput.addEventListener('input', function() {
            document.getElementById('fpsValue').textContent = `${this.value} FPS`;
        });
    }
    
    const qualityInput = document.getElementById('quality');
    if (qualityInput) {
        qualityInput.addEventListener('input', function() {
            document.getElementById('qualityValue').textContent = this.value;
        });
    }
    
    const durationInput = document.getElementById('duration');
    if (durationInput) {
        durationInput.addEventListener('input', function() {
            document.getElementById('durationValue').textContent = `${this.value}s`;
        });
    }
}

async function handleFileUpload(e) {
    window.frames = [];
    for (let file of e.target.files) {
        const frame = await createImageBitmap(file);
        window.frames.push(frame);
    }
    if (window.frames.length > 0) {
        drawPreview(window.frames[0]);
        updateLivePreview();
    }
}

export { setupEventListeners };