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

document.getElementById('borderColor').addEventListener('input', function() {
    document.getElementById('borderColorValue').textContent = this.value;
    updateLivePreview();
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