import { getImageSettings } from './animationUtils.js';

async function fetchGifWorker() {
    try {
        const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js');
        return await response.blob();
    } catch (error) {
        console.error('Error fetching GIF worker:', error);
        return null;
    }
}

async function generateGif() {
    const settings = getImageSettings();
    
    if (window.frames.length === 0) {
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
        workerScript: URL.createObjectURL(window.gifWorkerBlob),
        transparent: settings.backgroundColor === 'transparent' ? 0x00FFFFFF : null
    });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 112;
    tempCanvas.height = 112;
    const tempCtx = tempCanvas.getContext('2d');

    for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
        const progress = frameNum / totalFrames;
        
        window.frames.forEach((frame) => {
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
            if (window.selectedAnimation !== 'none') {
                const centerX = tempCanvas.width / 2;
                const centerY = tempCanvas.height / 2;
                
                tempCtx.translate(centerX, centerY);
                
                const intensityFactor = window.animationIntensity / 5;
                
                switch(window.selectedAnimation) {
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
                delay: 1000 / (fps * window.animationSpeed),
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
}

export { fetchGifWorker, generateGif };