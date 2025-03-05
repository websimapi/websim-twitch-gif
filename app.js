let frames = [];
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
let gifWorkerBlob;
let selectedAnimation = 'none';
let animationIntensity = 5;
let animationSpeed = 1;

// Animation option selection
document.querySelectorAll('.animation-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.animation-option').forEach(opt => opt.classList.remove('selected'));
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

// Fetch GIF Worker
fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
    .then(response => response.blob())
    .then(blob => {
        gifWorkerBlob = blob;
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

function drawPreview(frame) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

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

function updateLivePreview() {
    const previewCanvas = document.getElementById('previewAnimation');
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    if (frames.length === 0) return;

    const settings = getImageSettings();
    
    // Reset any previous animations
    previewCanvas.style.animation = 'none';
    previewCanvas.style.transform = 'none';
    
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    const scale = settings.scale / 100;
    const scaledWidth = previewCanvas.width * scale;
    const scaledHeight = previewCanvas.height * scale;
    const x = (previewCanvas.width - scaledWidth) / 2;
    const y = (previewCanvas.height - scaledHeight) / 2;

    const effectiveWidth = scaledWidth;
    const effectiveHeight = scaledHeight;

    const currentFrame = frames[0];
    ctx.save();

    ctx.globalAlpha = settings.opacity / 100;

    // Draw the image without applying transformations yet
    ctx.drawImage(
        currentFrame,
        x,
        y,
        effectiveWidth,
        effectiveHeight
    );

    // Restore the original context state
    ctx.restore();
    
    // Apply animation to the canvas through CSS (simpler approach)
    if (selectedAnimation !== 'none') {
        const animationCSS = generateAnimationCSS(selectedAnimation);
        previewCanvas.style.animation = animationCSS;
        previewCanvas.style.transformOrigin = 'center center';
    }
}

function generateAnimationCSS(animation) {
    const speed = (1 / animationSpeed).toFixed(1);
    const intensity = animationIntensity / 5;
    
    switch (animation) {
        case 'rotate':
            return `rotate ${speed}s linear infinite`;
        case 'bounce':
            return `bounce ${speed}s ease-in-out infinite`;
        case 'fade':
            return `fade ${speed}s ease-in-out infinite`;
        case 'shake':
            return `shake ${speed}s ease-in-out infinite`;
        case 'pulse':
            return `pulse ${speed}s ease-in-out infinite`;
        case 'flip':
            return `flip ${speed}s ease-in-out infinite`;
        case 'swing':
            return `swing ${speed}s ease-in-out infinite`;
        case 'zoom':
            return `zoom ${speed}s ease-in-out infinite`;
        case 'spin':
            return `spin ${speed}s ease-in-out infinite`;
        case 'wiggle':
            return `wiggle ${speed}s ease-in-out infinite`;
        case 'squeeze':
            return `squeeze ${speed}s ease-in-out infinite`;
        case 'slide':
            return `slide ${speed}s ease-in-out infinite`;
        case 'glitch':
            return `glitch ${speed}s ease-in-out infinite`;
        default:
            return 'none';
    }
}

function getImageSettings() {
    return {
        backgroundColor: document.getElementById('backgroundColor').value,
        opacity: parseInt(document.getElementById('opacity').value),
        scale: parseInt(document.getElementById('scale').value)
    };
}

document.querySelectorAll('.image-settings input, .image-settings select').forEach(input => {
    input.addEventListener('input', updateLivePreview);
});

document.getElementById('backgroundColor').addEventListener('input', function() {
    document.getElementById('backgroundColorValue').textContent = this.value;
    updateLivePreview();
});

document.getElementById('generateGif').onclick = async function() {
    const settings = getImageSettings();
    
    if (frames.length === 0) {
        alert('Please upload some images first!');
        return;
    }

    const fps = parseInt(document.getElementById('fps').value);
    const quality = parseInt(document.getElementById('quality').value);
    const duration = parseInt(document.getElementById('duration').value);
    const totalFrames = fps * duration;
    
    const gif = new GIF({
        workers: 2,
        quality,
        width: 112,
        height: 112,
        workerScript: URL.createObjectURL(gifWorkerBlob)
    });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 112;
    tempCanvas.height = 112;
    const tempCtx = tempCanvas.getContext('2d');

    for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
        const progress = frameNum / totalFrames;
        
        frames.forEach((frame) => {
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            tempCtx.fillStyle = settings.backgroundColor;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            const scale = settings.scale / 100;
            const scaledWidth = tempCanvas.width * scale;
            const scaledHeight = tempCanvas.height * scale;
            const x = (tempCanvas.width - scaledWidth) / 2;
            const y = (tempCanvas.height - scaledHeight) / 2;
            
            const effectiveWidth = scaledWidth;
            const effectiveHeight = scaledHeight;
            
            tempCtx.save();
            
            // Apply animation transforms to the context
            if (selectedAnimation !== 'none') {
                const centerX = x + (effectiveWidth / 2);
                const centerY = y + (effectiveHeight / 2);
                
                tempCtx.translate(centerX, centerY);
                
                const intensityFactor = animationIntensity / 5;
                
                switch(selectedAnimation) {
                    case 'rotate':
                        tempCtx.rotate(progress * Math.PI * 2);
                        break;
                    case 'bounce':
                        const bounceOffset = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                        tempCtx.translate(0, bounceOffset);
                        break;
                    case 'fade':
                        tempCtx.globalAlpha = (settings.opacity / 100) * (0.3 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.7);
                        break;
                    case 'shake':
                        const shakeOffset = Math.sin(progress * Math.PI * 4) * 5 * intensityFactor;
                        tempCtx.translate(shakeOffset, 0);
                        break;
                    case 'pulse':
                        const pulseScale = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                        tempCtx.scale(pulseScale, pulseScale);
                        break;
                    case 'flip':
                        const flipProgress = Math.sin(progress * Math.PI * 2);
                        tempCtx.scale(flipProgress < 0 ? -1 : 1, 1);
                        break;
                    case 'swing':
                        const swingAngle = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                        tempCtx.rotate(swingAngle);
                        break;
                    case 'zoom':
                        const zoomScale = 1 - Math.abs(Math.sin(progress * Math.PI * 2)) * 0.3 * intensityFactor;
                        tempCtx.scale(zoomScale, zoomScale);
                        break;
                    case 'spin':
                        const spinRotation = progress * Math.PI * 2;
                        const spinScale = 1 - Math.abs(Math.sin(progress * Math.PI)) * 0.2 * intensityFactor;
                        tempCtx.rotate(spinRotation);
                        tempCtx.scale(spinScale, spinScale);
                        break;
                    case 'wiggle':
                        const wiggleAngle = Math.sin(progress * Math.PI * 4) * 10 * intensityFactor * (Math.PI / 180);
                        tempCtx.transform(1, 0, Math.tan(wiggleAngle), 1, 0, 0);
                        break;
                    case 'squeeze':
                        const squeezeX = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                        const squeezeY = 1 - Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                        tempCtx.scale(squeezeX, squeezeY);
                        break;
                    case 'slide':
                        const slideOffset = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                        tempCtx.translate(slideOffset, 0);
                        break;
                    case 'glitch':
                        if (progress * 10 % 1 < 0.3) {
                            const glitchX = (Math.random() - 0.5) * 8 * intensityFactor;
                            const glitchY = (Math.random() - 0.5) * 8 * intensityFactor;
                            tempCtx.translate(glitchX, glitchY);
                        }
                        break;
                }
                
                tempCtx.translate(-centerX, -centerY);
            }
            
            tempCtx.globalAlpha = settings.opacity / 100;
            
            tempCtx.drawImage(
                frame,
                x,
                y,
                effectiveWidth,
                effectiveHeight
            );
            
            tempCtx.restore();
            
            gif.addFrame(tempCanvas, {
                delay: 1000 / (fps * animationSpeed),
                copy: true
            });
        });
    }

    gif.on('finished', blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'twitch-emote.gif';
        link.click();
        
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    });

    gif.render();
};

document.getElementById('clearCanvas').addEventListener('click', () => {
    frames = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('fileInput').value = '';
    selectedAnimation = 'none';
    document.querySelectorAll('.animation-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('[data-animation="none"]').classList.add('selected');
    
    const previewCanvas = document.getElementById('previewAnimation');
    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCanvas.style.animation = 'none';
});

// AI Image Generation
document.getElementById('generateImage').addEventListener('click', async () => {
    const prompt = document.getElementById('imagePrompt').value.trim();
    const aspectRatio = document.getElementById('aspectRatio').value;
    const advancedMode = document.getElementById('advancedMode').checked;
    const statusElement = document.getElementById('generationStatus');
    
    if (!prompt) {
        statusElement.textContent = 'Please enter a description for your image.';
        return;
    }
    
    statusElement.innerHTML = '<div class="loading-spinner"></div> Processing your request...';
    
    try {
        let finalPrompt = prompt;
        
        // If advanced mode is enabled, enhance the prompt first
        if (advancedMode) {
            statusElement.innerHTML = '<div class="loading-spinner"></div> Enhancing your prompt...';
            
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert at creating detailed image generation prompts. 
                        Take the user's basic idea and expand it into a rich, detailed description that will 
                        create a visually interesting and high-quality image. Focus on visual details, style, 
                        lighting, mood, and composition. Your output should be just the enhanced prompt with no 
                        explanations or additional text.`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            });
            
            finalPrompt = completion.content;
            statusElement.innerHTML = '<div class="loading-spinner"></div> Generating image...';
        }
        
        // Generate the image
        const result = await websim.imageGen({
            prompt: finalPrompt,
            aspect_ratio: aspectRatio
        });
        
        // Create a new image from the generated URL
        const img = new Image();
        img.onload = async function() {
            const frame = await createImageBitmap(img);
            frames = [frame]; // Replace existing frames with this new one
            drawPreview(frame);
            updateLivePreview();
            statusElement.textContent = 'Image generated successfully!';
        };
        img.onerror = function() {
            statusElement.textContent = 'Error loading the generated image.';
        };
        img.src = result.url;
        
    } catch (error) {
        console.error('Error generating image:', error);
        statusElement.textContent = `Error: ${error.message || 'Failed to generate image'}`;
    }
});