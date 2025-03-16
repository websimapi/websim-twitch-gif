// GIF generation code
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
        workerScript: URL.createObjectURL(gifWorkerBlob),
        transparent: settings.backgroundColor ? null : 0x00000000
    });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 112;
    tempCanvas.height = 112;
    const tempCtx = tempCanvas.getContext('2d');

    for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
        const progress = frameNum / totalFrames;
        
        frames.forEach((frame) => {
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            if (settings.backgroundColor) {
                tempCtx.fillStyle = settings.backgroundColor;
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            }
            
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
                    case 'bounce-around':
                        // Bounce around corners in a loop
                        const cycle = (progress * 4) % 4;
                        let xOffset = 0, yOffset = 0;
                        
                        if (cycle < 1) { // Top-left to top-right
                            xOffset = cycle * 10 * intensityFactor;
                            yOffset = -5 * intensityFactor;
                        } else if (cycle < 2) { // Top-right to bottom-right
                            xOffset = 10 * intensityFactor;
                            yOffset = (cycle - 1) * 10 * intensityFactor - 5 * intensityFactor;
                        } else if (cycle < 3) { // Bottom-right to bottom
                            xOffset = (3 - cycle) * 10 * intensityFactor;
                            yOffset = 5 * intensityFactor;
                        } else { // Bottom to top-left
                            xOffset = -10 * intensityFactor;
                            yOffset = (4 - cycle) * 10 * intensityFactor - 5 * intensityFactor;
                        }
                        
                        tempCtx.translate(xOffset, yOffset);
                        tempCtx.rotate(-cycle * Math.PI / 2);
                        break;
                    case 'float':
                        const floatY = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                        const floatRotation = Math.sin(progress * Math.PI * 2) * 2 * intensityFactor * (Math.PI / 180);
                        tempCtx.translate(0, floatY);
                        tempCtx.rotate(floatRotation);
                        break;
                    case 'spiral':
                        const spiralRotation = progress * Math.PI * 2;
                        const spiralScale = 0.5 + Math.abs(Math.sin(progress * Math.PI)) * 0.5 * intensityFactor;
                        tempCtx.rotate(spiralRotation);
                        tempCtx.scale(spiralScale, spiralScale);
                        break;
                    case 'throb':
                        const throbScale = 1 + Math.sin(progress * Math.PI * 2) * 0.3 * intensityFactor;
                        tempCtx.scale(throbScale, throbScale);
                        tempCtx.globalAlpha = (settings.opacity / 100) * (0.8 + Math.sin(progress * Math.PI * 2) * 0.2);
                        break;
                    case 'heartbeat':
                        const t = progress * 10 % 1;
                        let heartbeatScale = 1;
                        if (t < 0.1) heartbeatScale = 1.2 * intensityFactor;
                        else if (t < 0.2) heartbeatScale = 1.1 * intensityFactor;
                        else if (t < 0.3) heartbeatScale = 1.0;
                        else if (t < 0.4) heartbeatScale = 1.25 * intensityFactor;
                        else if (t < 0.5) heartbeatScale = 1.15 * intensityFactor;
                        tempCtx.scale(heartbeatScale, heartbeatScale);
                        break;
                    case 'jello':
                        const jelloProgress = progress * 4 % 1;
                        const skewX = Math.sin(jelloProgress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                        const skewY = Math.sin(jelloProgress * Math.PI * 2) * 5 * intensityFactor * (Math.PI / 180);
                        tempCtx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
                        break;
                    case 'pendulum':
                        const pendulumAngle = Math.sin(progress * Math.PI * 2) * 20 * intensityFactor * (Math.PI / 180);
                        tempCtx.rotate(pendulumAngle);
                        break;
                    case 'blink':
                        if ((progress * 2) % 1 < 0.5) {
                            tempCtx.globalAlpha = 0;
                        }
                        break;
                    case 'rainbow':
                        // Apply rainbow effect directly to each frame
                        tempCtx.filter = `hue-rotate(${progress * 360}deg)`;
                        break;
                    case 'tornado':
                        const tornadoAngle = progress * Math.PI * 2;
                        const tornadoScale = 0.6 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.4;
                        const tornadoX = Math.sin(progress * Math.PI * 4) * 10 * intensityFactor;
                        tempCtx.rotate(tornadoAngle);
                        tempCtx.scale(tornadoScale, tornadoScale);
                        tempCtx.translate(tornadoX, 0);
                        break;
                    case 'orbit':
                        const orbitAngle = progress * Math.PI * 2;
                        const orbitRadius = 15 * intensityFactor;
                        tempCtx.translate(
                            Math.cos(orbitAngle) * orbitRadius,
                            Math.sin(orbitAngle) * orbitRadius
                        );
                        tempCtx.rotate(-orbitAngle);
                        break;
                    case 'diagonal-bounce':
                        const diagProgress = progress * 4 % 4;
                        let diagX = 0, diagY = 0, diagRotation = 0;
                        
                        if (diagProgress < 1) {
                            diagX = diagY = 0;
                        } else if (diagProgress < 2) {
                            diagX = 15 * intensityFactor;
                            diagY = -15 * intensityFactor;
                            diagRotation = -5 * (diagProgress - 1);
                        } else if (diagProgress < 3) {
                            diagX = -15 * intensityFactor;
                            diagY = 15 * intensityFactor;
                            diagRotation = 5 * (diagProgress - 2);
                        } else {
                            diagX = 15 * intensityFactor;
                            diagY = 15 * intensityFactor;
                            diagRotation = -5 * (diagProgress - 3);
                        }
                        
                        tempCtx.translate(diagX, diagY);
                        tempCtx.rotate(diagRotation * (Math.PI / 180));
                        break;
                    case 'pixelate':
                        const pixelProgress = Math.sin(progress * Math.PI * 2);
                        const pixelScale = 1 - Math.abs(pixelProgress) * 0.4 * intensityFactor;
                        tempCtx.scale(pixelScale, pixelScale);
                        // Note: image-rendering and filter can't be applied to canvas context directly
                        break;
                    case 'sway':
                        const swayProgress = Math.sin(progress * Math.PI * 2);
                        const swayAngle = swayProgress * 10 * intensityFactor * (Math.PI / 180);
                        const swayX = swayProgress * 10 * intensityFactor;
                        tempCtx.transform(1, 0, Math.tan(swayAngle), 1, swayX, 0);
                        break;
                    case 'ripple':
                        const rippleProgress = Math.sin(progress * Math.PI * 2);
                        const rippleScale = 1 + rippleProgress * 0.2 * intensityFactor;
                        // Blur can't be applied directly to canvas context
                        tempCtx.scale(rippleScale, rippleScale);
                        break;
                    case 'split-shift':
                        // Split-shift effect can't be fully recreated in canvas context
                        // We can approximate with small position shifts
                        const splitShiftProgress = progress * 10 % 1;
                        if (splitShiftProgress < 0.25) {
                            tempCtx.translate(-5 * intensityFactor, 0);
                        } else if (splitShiftProgress < 0.5) {
                            tempCtx.translate(0, -5 * intensityFactor);
                        } else if (splitShiftProgress < 0.75) {
                            tempCtx.translate(5 * intensityFactor, 0);
                        } else {
                            tempCtx.translate(0, 5 * intensityFactor);
                        }
                        break;
                    case 'confetti':
                        const confettiAngle = progress * Math.PI * 2;
                        const confettiScale = 0.8 + Math.sin(progress * Math.PI * 4) * 0.2 * intensityFactor;
                        tempCtx.rotate(confettiAngle);
                        tempCtx.scale(confettiScale, confettiScale);
                        // Color changes handled in CSS
                        break;
                    case 'wave':
                        const waveY = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                        const waveSkew = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                        tempCtx.transform(1, 0, Math.tan(waveSkew), 1, 0, waveY);
                        break;
                    case 'jump-rope':
                        const jumpY = Math.abs(Math.sin(progress * Math.PI * 2)) * -15 * intensityFactor;
                        const jumpScale = 1 - Math.abs(Math.sin(progress * Math.PI * 2)) * 0.3 * intensityFactor;
                        const jumpRotation = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                        tempCtx.translate(0, jumpY);
                        tempCtx.scale(1, jumpScale);
                        tempCtx.rotate(jumpRotation);
                        break;
                    case 'typewriter':
                        // Typewriter effect - implemented through clipping
                        const typeProgress = progress * 4 % 1;
                        const clipWidth = tempCanvas.width * (1 - typeProgress);
                        tempCtx.beginPath();
                        tempCtx.rect(0, 0, clipWidth, tempCanvas.height);
                        tempCtx.clip();
                        break;
                    case 'bounce-flip':
                        const bfProgress = progress * 4 % 4;
                        let bfY = 0, bfRotationY = 0;
                        
                        if (bfProgress < 1) {
                            bfY = -10 * intensityFactor * Math.sin(bfProgress * Math.PI);
                            bfRotationY = bfProgress * 90;
                        } else if (bfProgress < 2) {
                            bfRotationY = 90 + (bfProgress - 1) * 90;
                        } else if (bfProgress < 3) {
                            bfY = -10 * intensityFactor * Math.sin((bfProgress - 2) * Math.PI);
                            bfRotationY = 180 + (bfProgress - 2) * 90;
                        } else {
                            bfRotationY = 270 + (bfProgress - 3) * 90;
                        }
                        
                        tempCtx.translate(0, bfY);
                        // Simulate 3D rotation by scaling
                        const scaleX = Math.abs(Math.cos(bfRotationY * Math.PI / 180));
                        tempCtx.scale(scaleX, 1);
                        break;
                    case 'dizzy':
                        const dizzyAngle = progress * Math.PI * 2;
                        const dizzyScale = 0.8 + Math.sin(progress * Math.PI * 3) * 0.2 * intensityFactor;
                        const dizzyX = Math.sin(progress * Math.PI * 3) * 10 * intensityFactor;
                        tempCtx.rotate(dizzyAngle);
                        tempCtx.scale(dizzyScale, dizzyScale);
                        tempCtx.translate(dizzyX, 0);
                        break;
                    case 'dance':
                        const danceRotation = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor * (Math.PI / 180);
                        const danceY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                        const danceSkewX = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor * (Math.PI / 180);
                        tempCtx.rotate(danceRotation);
                        tempCtx.transform(1, 0, Math.tan(danceSkewX), 1, 0, danceY);
                        break;
                    case 'elastic':
                        const elasticProgress = progress * 4 % 1;
                        let elasticScaleX = 1, elasticScaleY = 1;
                        
                        if (elasticProgress < 0.25) {
                            elasticScaleX = 1 + elasticProgress * 2 * intensityFactor;
                            elasticScaleY = 1 - elasticProgress * 2 * intensityFactor;
                        } else if (elasticProgress < 0.5) {
                            const t = (elasticProgress - 0.25) * 4;
                            elasticScaleX = 1.5 * intensityFactor - t * intensityFactor;
                            elasticScaleY = 0.5 + t * intensityFactor;
                        } else if (elasticProgress < 0.75) {
                            const t = (elasticProgress - 0.5) * 4;
                            elasticScaleX = 1 - t * intensityFactor;
                            elasticScaleY = 1 + t * intensityFactor;
                        } else {
                            const t = (elasticProgress - 0.75) * 4;
                            elasticScaleX = 0.8 + t * 0.2 * intensityFactor;
                            elasticScaleY = 1.2 - t * 0.2 * intensityFactor;
                        }
                        
                        tempCtx.scale(elasticScaleX, elasticScaleY);
                        break;
                    case 'shadow-play':
                        const shadowX = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                        const shadowRotation = Math.sin(progress * Math.PI * 2) * 5 * intensityFactor * (Math.PI / 180);
                        tempCtx.translate(shadowX, 0);
                        tempCtx.rotate(shadowRotation);
                        // Shadow effect can't be applied directly in canvas context
                        break;
                    case 'bounce-rotate':
                        const brY = Math.sin(progress * Math.PI * 2) * -15 * intensityFactor;
                        const brRotation = progress * Math.PI * 2;
                        tempCtx.translate(0, brY);
                        tempCtx.rotate(brRotation);
                        break;
                    case 'party-mode':
                        const partyPhase = (progress * 5) % 5;
                        if (partyPhase < 1) {
                            tempCtx.scale(1 + 0.1 * intensityFactor, 1 + 0.1 * intensityFactor);
                            tempCtx.rotate(10 * intensityFactor * (Math.PI / 180));
                        } else if (partyPhase < 2) {
                            tempCtx.scale(0.9 * intensityFactor, 0.9 * intensityFactor);
                            tempCtx.translate(5 * intensityFactor, -5 * intensityFactor);
                            tempCtx.rotate(-5 * intensityFactor * (Math.PI / 180));
                        } else if (partyPhase < 3) {
                            tempCtx.scale(1.2 * intensityFactor, 1.2 * intensityFactor);
                            tempCtx.translate(-5 * intensityFactor, 5 * intensityFactor);
                            tempCtx.rotate(15 * intensityFactor * (Math.PI / 180));
                        } else if (partyPhase < 4) {
                            tempCtx.scale(0.8 * intensityFactor, 0.8 * intensityFactor);
                            tempCtx.rotate(-15 * intensityFactor * (Math.PI / 180));
                        } else {
                            tempCtx.scale(1, 1);
                            tempCtx.rotate(0);
                        }
                        break;
                    case 'rolling':
                        const rollX = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor;
                        const rollRotation = progress * Math.PI * 4; // 720 degrees
                        tempCtx.translate(rollX, 0);
                        tempCtx.rotate(rollRotation);
                        break;
                    case 'kaleidoscope':
                        const kPhase = (progress * 3) % 3;
                        let kScale = 1, kRotation = progress * Math.PI * 2;
                        if (kPhase < 1) {
                            kScale = 1;
                        } else if (kPhase < 2) {
                            kScale = 0.8;
                            kRotation = progress * Math.PI * 2 + (Math.PI * 2/3);
                        } else {
                            kScale = 1.2;
                            kRotation = progress * Math.PI * 2 + (Math.PI * 4/3);
                        }
                        tempCtx.rotate(kRotation);
                        tempCtx.scale(kScale, kScale);
                        // Note: clip-path would be applied here if canvas supported it
                        break;
                    case 'wobble':
                        const wPhase = (progress * 4) % 4;
                        if (wPhase < 1) {
                            tempCtx.transform(1, 0, 0, 1, 0, 0);
                        } else if (wPhase < 2) {
                            tempCtx.transform(1, Math.tan(5 * intensityFactor * (Math.PI / 180)), 
                                             Math.tan(15 * intensityFactor * (Math.PI / 180)), 1, 0, 0);
                            tempCtx.scale(0.9, 1.1);
                        } else if (wPhase < 3) {
                            tempCtx.transform(1, Math.tan(-3 * intensityFactor * (Math.PI / 180)), 
                                             Math.tan(-10 * intensityFactor * (Math.PI / 180)), 1, 0, 0);
                            tempCtx.scale(1.1, 0.9);
                        } else {
                            tempCtx.transform(1, Math.tan(1 * intensityFactor * (Math.PI / 180)), 
                                             Math.tan(5 * intensityFactor * (Math.PI / 180)), 1, 0, 0);
                            tempCtx.scale(0.95, 1.05);
                        }
                        break;
                    case 'teleport':
                        const tPhase = (progress * 20) % 100;
                        if (tPhase < 15 || tPhase >= 85) {
                            // Visible
                            tempCtx.scale(1, 1);
                            tempCtx.globalAlpha = (settings.opacity / 100);
                        } else if (tPhase < 30) {
                            // Shrinking
                            const shrinkFactor = 1 - ((tPhase - 15) / 15);
                            tempCtx.scale(shrinkFactor, shrinkFactor);
                            tempCtx.globalAlpha = (settings.opacity / 100) * 0.5;
                        } else if (tPhase < 50) {
                            // Hidden, moved right
                            tempCtx.scale(0.1, 0.1);
                            tempCtx.translate(30 * intensityFactor, 0);
                            tempCtx.globalAlpha = 0;
                        } else if (tPhase < 70) {
                            // Hidden, moved left
                            tempCtx.scale(0.1, 0.1);
                            tempCtx.translate(-30 * intensityFactor, 0);
                            tempCtx.globalAlpha = (settings.opacity / 100) * 0.5;
                        } else {
                            // Growing
                            const growFactor = (tPhase - 70) / 15;
                            tempCtx.scale(growFactor, growFactor);
                            tempCtx.globalAlpha = (settings.opacity / 100) * 0.8;
                        }
                        break;
                    case 'pinwheel':
                        tempCtx.rotate(progress * Math.PI * 2);
                        // Note: clip-path would be handled in CSS, can't apply to canvas context directly
                        break;
                    case 'bounce-orbit':
                        let orbitX = 0, orbitY = 0;
                        if (progress < 0.25) {
                            // Top left to top
                            orbitX = -15 * intensityFactor + (progress * 4) * 15 * intensityFactor;
                            orbitY = -15 * intensityFactor - Math.sin(progress * 4 * Math.PI/2) * 5 * intensityFactor;
                        } else if (progress < 0.5) {
                            // Top to top right
                            orbitX = (progress - 0.25) * 4 * 15 * intensityFactor;
                            orbitY = -20 * intensityFactor + Math.sin((progress - 0.25) * 4 * Math.PI/2) * 5 * intensityFactor;
                        } else if (progress < 0.75) {
                            // Top right to bottom
                            orbitX = 15 * intensityFactor - ((progress - 0.5) * 4) * 15 * intensityFactor;
                            orbitY = -15 * intensityFactor + (progress - 0.5) * 4 * 30 * intensityFactor;
                        } else {
                            // Bottom to top left
                            orbitX = -15 * intensityFactor * (progress - 0.75) * 4;
                            orbitY = 15 * intensityFactor - (progress - 0.75) * 4 * 30 * intensityFactor;
                        }
                        tempCtx.translate(orbitX, orbitY);
                        break;
                    case 'vvcool':
                        // Vibrating pulse effect similar to Discord's VVCool
                        const vvScale = 1 + Math.sin(progress * Math.PI * 8) * 0.1 * intensityFactor;
                        const vvRotate = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor * (Math.PI / 180);
                        const vvShiftX = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor;
                        const vvShiftY = Math.cos(progress * Math.PI * 20) * 2 * intensityFactor;
                        tempCtx.translate(vvShiftX, vvShiftY);
                        tempCtx.rotate(vvRotate);
                        tempCtx.scale(vvScale, vvScale);
                        break;
                    case 'neon-flash':
                        // Neon flashing effect
                        const neonOpacity = 0.7 + Math.sin(progress * Math.PI * 10) * 0.3 * intensityFactor;
                        const neonScale = 1 + Math.sin(progress * Math.PI * 8) * 0.05 * intensityFactor;
                        tempCtx.globalAlpha = (settings.opacity / 100) * neonOpacity;
                        tempCtx.scale(neonScale, neonScale);
                        // Would add glow effect via shadow in CSS, simulated here with scale
                        break;
                    case 'spin-zoom':
                        // Spinning zoom in/out
                        const szAngle = progress * Math.PI * 4;
                        const szScale = 0.8 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.4 * intensityFactor;
                        tempCtx.rotate(szAngle);
                        tempCtx.scale(szScale, szScale);
                        break;
                    case 'bounce-wave':
                        // Bouncing with wave distortion
                        const bwY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                        const bwSkewX = Math.sin(progress * Math.PI * 4) * 8 * intensityFactor * (Math.PI / 180);
                        const bwScaleY = 1 + Math.sin(progress * Math.PI * 2) * 0.15 * intensityFactor;
                        tempCtx.translate(0, bwY);
                        tempCtx.transform(1, 0, Math.tan(bwSkewX), 1, 0, 0);
                        tempCtx.scale(1, bwScaleY);
                        break;
                    case 'hyperspeed':
                        // Very fast vibrations with slight rotations
                        const hsScale = 1 + Math.sin(progress * Math.PI * 8) * 0.1 * intensityFactor;
                        const hsRotate = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor * (Math.PI / 180);
                        const hsShiftX = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor;
                        const hsShiftY = Math.cos(progress * Math.PI * 20) * 2 * intensityFactor;
                        tempCtx.translate(hsShiftX, hsShiftY);
                        tempCtx.rotate(hsRotate);
                        tempCtx.scale(hsScale, hsScale);
                        break;
                    case 'color-pulse':
                        // Apply color pulse (note: this would be handled through a filter in CSS)
                        let hue = (progress * 360) % 360;
                        tempCtx.filter = `hue-rotate(${hue}deg)`;
                        break;
                    case 'pixel-shuffle':
                        const psX = Math.sin(progress * Math.PI * 10) * 3 * intensityFactor;
                        const psY = Math.cos(progress * Math.PI * 10) * 3 * intensityFactor;
                        tempCtx.translate(psX, psY);
                        break;
                    case 'glitch-out':
                        if (Math.random() > 0.7) {
                            const goX = (Math.random() - 0.5) * 10 * intensityFactor;
                            tempCtx.translate(goX, 0);
                            // Would apply clip-path and hue-rotate in CSS
                        }
                        break;
                    case 'liquid':
                        // Simulate liquid effect by scaling parts differently
                        const lqScaleX = 1 + Math.sin(progress * Math.PI * 2) * 0.15 * intensityFactor;
                        const lqScaleY = 1 + Math.cos(progress * Math.PI * 2) * 0.15 * intensityFactor;
                        tempCtx.scale(lqScaleX, lqScaleY);
                        // Would apply border-radius in CSS
                        break;
                    case 'warp-drive':
                        const wdScale = 1 - Math.abs(Math.sin(progress * Math.PI)) * 0.5 * intensityFactor;
                        const wdRotation = progress * Math.PI * 2;
                        tempCtx.rotate(wdRotation);
                        tempCtx.scale(wdScale, wdScale);
                        // Would apply filter effects in CSS
                        break;
                    case 'micro-bounce':
                        const microScale = 1 + Math.sin(progress * Math.PI * 2) * 0.1 * intensityFactor;
                        tempCtx.scale(microScale, microScale);
                        break;
                    case 'shatter':
                        const shatterAngle = progress * Math.PI * 2;
                        const shatterScale = 0.8 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.2 * intensityFactor;
                        tempCtx.rotate(shatterAngle);
                        tempCtx.scale(shatterScale, shatterScale);
                        break;
                    case 'clock':
                        const clockAngle = progress * Math.PI * 2;
                        tempCtx.rotate(clockAngle);
                        break;
                    case 'slime':
                        const slimeY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                        const slimeRotation = Math.sin(progress * Math.PI * 2) * 2 * intensityFactor * (Math.PI / 180);
                        tempCtx.translate(0, slimeY);
                        tempCtx.rotate(slimeRotation);
                        break;
                    case 'paper-plane':
                        const planeAngle = progress * Math.PI * 2;
                        const planeScale = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                        tempCtx.rotate(planeAngle);
                        tempCtx.scale(planeScale, planeScale);
                        break;
                    case 'bubble-pop':
                        const bubbleScale = 1 + Math.sin(progress * Math.PI * 2) * 0.1 * intensityFactor;
                        tempCtx.scale(bubbleScale, bubbleScale);
                        break;
                    case 'vibrate':
                        const vibrateScale = 1 + Math.sin(progress * Math.PI * 8) * 0.05 * intensityFactor;
                        tempCtx.scale(vibrateScale, vibrateScale);
                        break;
                    case 'firework':
                        const fireworkScale = 1 + Math.sin(progress * Math.PI * 2) * 0.3 * intensityFactor;
                        tempCtx.scale(fireworkScale, fireworkScale);
                        break;
                    case 'magnet':
                        const magnetAngle = progress * Math.PI * 2;
                        tempCtx.rotate(magnetAngle);
                        break;
                    case 'pulse-rings':
                        const pulseRingsScale = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                        tempCtx.scale(pulseRingsScale, pulseRingsScale);
                        break;
                    case 'drip':
                        const dripY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                        tempCtx.translate(0, dripY);
                        break;
                    case 'ricochet':
                        const ricochetAngle = progress * Math.PI * 2;
                        const ricochetScale = 0.8 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.2 * intensityFactor;
                        tempCtx.rotate(ricochetAngle);
                        tempCtx.scale(ricochetScale, ricochetScale);
                        break;
                    case 'flip-3d':
                        const flip3DProgress = progress * 4 % 4;
                        let flip3DY = 0, flip3DRotationY = 0;
                        
                        if (flip3DProgress < 1) {
                            flip3DY = -10 * intensityFactor * Math.sin(flip3DProgress * Math.PI);
                            flip3DRotationY = flip3DProgress * 90;
                        } else if (flip3DProgress < 2) {
                            flip3DRotationY = 90 + (flip3DProgress - 1) * 90;
                        } else if (flip3DProgress < 3) {
                            flip3DY = -10 * intensityFactor * Math.sin((flip3DProgress - 2) * Math.PI);
                            flip3DRotationY = 180 + (flip3DProgress - 2) * 90;
                        } else {
                            flip3DRotationY = 270 + (flip3DProgress - 3) * 90;
                        }
                        
                        tempCtx.translate(0, flip3DY);
                        // Simulate 3D rotation by scaling
                        const flip3DScaleX = Math.abs(Math.cos(flip3DRotationY * Math.PI / 180));
                        tempCtx.scale(flip3DScaleX, 1);
                        break;
                    case 'thunder':
                        const thunderAngle = progress * Math.PI * 2;
                        tempCtx.rotate(thunderAngle);
                        break;
                    case 'tv-static':
                        const tvStaticScale = 1 + Math.sin(progress * Math.PI * 10) * 0.1 * intensityFactor;
                        tempCtx.scale(tvStaticScale, tvStaticScale);
                        break;
                    case 'flip-coin':
                        const flipCoinProgress = progress * 4 % 4;
                        let flipCoinY = 0, flipCoinRotationY = 0;
                        
                        if (flipCoinProgress < 1) {
                            flipCoinY = -10 * intensityFactor * Math.sin(flipCoinProgress * Math.PI);
                            flipCoinRotationY = flipCoinProgress * 90;
                        } else if (flipCoinProgress < 2) {
                            flipCoinRotationY = 90 + (flipCoinProgress - 1) * 90;
                        } else if (flipCoinProgress < 3) {
                            flipCoinY = -10 * intensityFactor * Math.sin((flipCoinProgress - 2) * Math.PI);
                            flipCoinRotationY = 180 + (flipCoinProgress - 2) * 90;
                        } else {
                            flipCoinRotationY = 270 + (flipCoinProgress - 3) * 90;
                        }
                        
                        tempCtx.translate(0, flipCoinY);
                        // Simulate 3D rotation by scaling
                        const flipCoinScaleX = Math.abs(Math.cos(flipCoinRotationY * Math.PI / 180));
                        tempCtx.scale(flipCoinScaleX, 1);
                        break;
                    case 'matrix':
                        const matrixProgress = (progress * 4) % 1;
                        const matrixY = Math.floor(matrixProgress * 4) * 10 * intensityFactor;
                        const matrixOpacity = 1 - (matrixProgress * 0.8);
                        tempCtx.globalAlpha = (settings.opacity / 100) * matrixOpacity;
                        tempCtx.translate(0, matrixY);
                        break;
                    case 'meteor':
                        const meteorProgress = progress % 1;
                        const meteorX = (meteorProgress * 2 - 1) * 20 * intensityFactor;
                        const meteorY = (meteorProgress * 2 - 1) * 20 * intensityFactor;
                        const meteorScale = 0.5 + meteorProgress * 0.5;
                        const meteorOpacity = meteorProgress < 0.2 ? meteorProgress * 5 : 
                                             meteorProgress > 0.8 ? (1 - meteorProgress) * 5 : 1;
                        tempCtx.globalAlpha = (settings.opacity / 100) * meteorOpacity;
                        tempCtx.translate(meteorX, meteorY);
                        tempCtx.rotate(progress * Math.PI * 2);
                        tempCtx.scale(meteorScale, meteorScale);
                        break;
                }
                
                tempCtx.translate(-centerX, -centerY);
            }
            
            tempCtx.globalAlpha = settings.opacity / 100;
            
            // Apply rainbow effect to image data if enabled
            if (rainbowEffect) {
                const frameImage = new Image();
                frameImage.src = frame.src || createImageBitmap(frame).then(bmp => {
                    const tempCanvas2 = document.createElement('canvas');
                    tempCanvas2.width = bmp.width;
                    tempCanvas2.height = bmp.height;
                    const tempCtx2 = tempCanvas2.getContext('2d');
                    tempCtx2.drawImage(bmp, 0, 0);
                    return tempCanvas2.toDataURL();
                });
                
                const hueRotation = (progress * 360) % 360;
                
                // Create a temporary canvas to apply the hue-rotate
                const effectCanvas = document.createElement('canvas');
                effectCanvas.width = effectiveWidth;
                effectCanvas.height = effectiveHeight;
                const effectCtx = effectCanvas.getContext('2d');
                
                // Draw the frame
                effectCtx.drawImage(frame, 0, 0, effectiveWidth, effectiveHeight);
                
                // Get image data
                const imageData = effectCtx.getImageData(0, 0, effectiveWidth, effectiveHeight);
                const data = imageData.data;
                
                // Apply hue rotation manually to each pixel
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] > 0) { // Only process non-transparent pixels
                        // Convert RGB to HSL
                        const r = data[i] / 255;
                        const g = data[i + 1] / 255;
                        const b = data[i + 2] / 255;
                        
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        let h, s, l = (max + min) / 2;
                        
                        if (max === min) {
                            h = s = 0; // achromatic
                        } else {
                            const d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                            
                            switch (max) {
                                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                case g: h = (b - r) / d + 2; break;
                                case b: h = (r - g) / d + 4; break;
                            }
                            
                            h /= 6;
                        }
                        
                        // Rotate hue
                        h = (h + hueRotation / 360) % 1;
                        
                        // Convert back to RGB
                        let r1, g1, b1;
                        
                        if (s === 0) {
                            r1 = g1 = b1 = l; // achromatic
                        } else {
                            const hue2rgb = (p, q, t) => {
                                if (t < 0) t += 1;
                                if (t > 1) t -= 1;
                                if (t < 1/6) return p + (q - p) * 6 * t;
                                if (t < 1/2) return q;
                                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                                return p;
                            };
                            
                            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                            const p = 2 * l - q;
                            
                            r1 = hue2rgb(p, q, h + 1/3);
                            g1 = hue2rgb(p, q, h);
                            b1 = hue2rgb(p, q, h - 1/3);
                        }
                        
                        // Put back into data array
                        data[i] = Math.round(r1 * 255);
                        data[i + 1] = Math.round(g1 * 255);
                        data[i + 2] = Math.round(b1 * 255);
                    }
                }
                
                // Put the modified image data back
                effectCtx.putImageData(imageData, 0, 0);
                
                // Draw to main canvas
                tempCtx.drawImage(effectCanvas, x, y, effectiveWidth, effectiveHeight);
            } else {
                // Normal drawing without rainbow effect
                tempCtx.drawImage(frame, x, y, effectiveWidth, effectiveHeight);
            }
            
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