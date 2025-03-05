function updateLivePreview() {
    const previewCanvas = document.getElementById('previewAnimation');
    if (!previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    if (window.frames.length === 0) return;

    const settings = getImageSettings();
    
    // Reset any previous animations
    previewCanvas.style.animation = 'none';
    previewCanvas.offsetHeight; // Trigger reflow to reset animation
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

    const currentFrame = window.frames[0];
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
    
    // Apply animation to the canvas through CSS
    if (window.selectedAnimation !== 'none') {
        const animationCSS = generateAnimationCSS(window.selectedAnimation);
        previewCanvas.style.animation = animationCSS;
        previewCanvas.style.transformOrigin = 'center center';
    }
}

function generateAnimationCSS(animation) {
    const speed = (1 / window.animationSpeed).toFixed(1);
    const intensity = window.animationIntensity / 5;
    
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