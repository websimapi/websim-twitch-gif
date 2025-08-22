import Utils from './utils.js';

export class AnimationEngine {
    constructor(constants) {
        this.animations = constants.animations;
    }

    // Generate CSS animation string
    generateAnimationCSS(animationType, speed = 1) {
        const animation = this.animations[animationType];
        if (!animation || animationType === 'none') return '';
        
        const duration = (animation.duration / speed).toFixed(1);
        return `${animation.css} ${duration}s linear infinite`;
    }

    // Apply animation transforms to canvas context
    applyAnimationTransform(ctx, animationType, progress, intensity, canvasWidth, canvasHeight, effectiveWidth, effectiveHeight, x, y) {
        if (animationType === 'none') return;

        const centerX = x + (effectiveWidth / 2);
        const centerY = y + (effectiveHeight / 2);
        
        ctx.translate(centerX, centerY);
        
        const intensityFactor = intensity / 5;
        
        switch(animationType) {
            case 'rotate':
                ctx.rotate(progress * Math.PI * 2);
                break;
            case 'bounce':
                const bounceOffset = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                ctx.translate(0, bounceOffset);
                break;
            case 'fade':
                ctx.globalAlpha *= (0.3 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.7);
                break;
            case 'shake':
                const shakeOffset = Math.sin(progress * Math.PI * 4) * 5 * intensityFactor;
                ctx.translate(shakeOffset, 0);
                break;
            case 'pulse':
                const pulseScale = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                ctx.scale(pulseScale, pulseScale);
                break;
            case 'flip':
                const flipProgress = Math.sin(progress * Math.PI * 2);
                ctx.scale(flipProgress < 0 ? -1 : 1, 1);
                break;
            case 'swing':
                const swingAngle = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                ctx.rotate(swingAngle);
                break;
            case 'zoom':
                const zoomScale = 1 - Math.abs(Math.sin(progress * Math.PI * 2)) * 0.3 * intensityFactor;
                ctx.scale(zoomScale, zoomScale);
                break;
            case 'spin':
                const spinRotation = progress * Math.PI * 2;
                const spinScale = 1 - Math.abs(Math.sin(progress * Math.PI)) * 0.2 * intensityFactor;
                ctx.rotate(spinRotation);
                ctx.scale(spinScale, spinScale);
                break;
            case 'wiggle':
                const wiggleAngle = Math.sin(progress * Math.PI * 4) * 10 * intensityFactor * (Math.PI / 180);
                ctx.transform(1, 0, Math.tan(wiggleAngle), 1, 0, 0);
                break;
            case 'squeeze':
                const squeezeX = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                const squeezeY = 1 - Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                ctx.scale(squeezeX, squeezeY);
                break;
            case 'slide':
                const slideOffset = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                ctx.translate(slideOffset, 0);
                break;
            case 'glitch':
                if (progress * 10 % 1 < 0.3) {
                    const glitchX = (Math.random() - 0.5) * 8 * intensityFactor;
                    const glitchY = (Math.random() - 0.5) * 8 * intensityFactor;
                    ctx.translate(glitchX, glitchY);
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
                
                ctx.translate(xOffset, yOffset);
                ctx.rotate(-cycle * Math.PI / 2);
                break;
            case 'float':
                const floatY = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                const floatRotation = Math.sin(progress * Math.PI * 2) * 2 * intensityFactor * (Math.PI / 180);
                ctx.translate(0, floatY);
                ctx.rotate(floatRotation);
                break;
            case 'spiral':
                const spiralRotation = progress * Math.PI * 2;
                const spiralScale = 0.5 + Math.abs(Math.sin(progress * Math.PI)) * 0.5 * intensityFactor;
                ctx.rotate(spiralRotation);
                ctx.scale(spiralScale, spiralScale);
                break;
            case 'throb':
                const throbScale = 1 + Math.sin(progress * Math.PI * 2) * 0.3 * intensityFactor;
                ctx.scale(throbScale, throbScale);
                ctx.globalAlpha *= (0.8 + Math.sin(progress * Math.PI * 2) * 0.2);
                break;
            case 'heartbeat':
                const t = progress * 10 % 1;
                let heartbeatScale = 1;
                if (t < 0.1) heartbeatScale = 1.2 * intensityFactor;
                else if (t < 0.2) heartbeatScale = 1.1 * intensityFactor;
                else if (t < 0.3) heartbeatScale = 1.0;
                else if (t < 0.4) heartbeatScale = 1.25 * intensityFactor;
                else if (t < 0.5) heartbeatScale = 1.15 * intensityFactor;
                ctx.scale(heartbeatScale, heartbeatScale);
                break;
            case 'jello':
                const jelloProgress = progress * 4 % 1;
                const skewX = Math.sin(jelloProgress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                const skewY = Math.sin(jelloProgress * Math.PI * 2) * 5 * intensityFactor * (Math.PI / 180);
                ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
                break;
            case 'pendulum':
                const pendulumAngle = Math.sin(progress * Math.PI * 2) * 20 * intensityFactor * (Math.PI / 180);
                ctx.rotate(pendulumAngle);
                break;
            case 'blink':
                if ((progress * 2) % 1 < 0.5) {
                    ctx.globalAlpha = 0;
                }
                break;
            case 'rainbow':
                // Apply rainbow effect directly to each frame
                ctx.filter = `hue-rotate(${progress * 360}deg)`;
                break;
            case 'tornado':
                const tornadoAngle = progress * Math.PI * 2;
                const tornadoScale = 0.6 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.4;
                const tornadoX = Math.sin(progress * Math.PI * 4) * 10 * intensityFactor;
                ctx.rotate(tornadoAngle);
                ctx.scale(tornadoScale, tornadoScale);
                ctx.translate(tornadoX, 0);
                break;
            case 'orbit':
                const orbitAngle = progress * Math.PI * 2;
                const orbitRadius = 15 * intensityFactor;
                ctx.translate(
                    Math.cos(orbitAngle) * orbitRadius,
                    Math.sin(orbitAngle) * orbitRadius
                );
                ctx.rotate(-orbitAngle);
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
                
                ctx.translate(diagX, diagY);
                ctx.rotate(diagRotation * (Math.PI / 180));
                break;
            case 'pixelate':
                const pixelProgress = Math.sin(progress * Math.PI * 2);
                const pixelScale = 1 - Math.abs(pixelProgress) * 0.4 * intensityFactor;
                ctx.scale(pixelScale, pixelScale);
                // Note: image-rendering and filter can't be applied to canvas context directly
                break;
            case 'sway':
                const swayProgress = Math.sin(progress * Math.PI * 2);
                const swayAngle = swayProgress * 10 * intensityFactor * (Math.PI / 180);
                const swayX = swayProgress * 10 * intensityFactor;
                ctx.transform(1, 0, Math.tan(swayAngle), 1, swayX, 0);
                break;
            case 'ripple':
                const rippleProgress = Math.sin(progress * Math.PI * 2);
                const rippleScale = 1 + rippleProgress * 0.2 * intensityFactor;
                // Blur can't be applied directly to canvas context
                ctx.scale(rippleScale, rippleScale);
                break;
            case 'split-shift':
                // Split-shift effect can't be fully recreated in canvas context
                // We can approximate with small position shifts
                const splitShiftProgress = progress * 10 % 1;
                if (splitShiftProgress < 0.25) {
                    ctx.translate(-5 * intensityFactor, 0);
                } else if (splitShiftProgress < 0.5) {
                    ctx.translate(0, -5 * intensityFactor);
                } else if (splitShiftProgress < 0.75) {
                    ctx.translate(5 * intensityFactor, 0);
                } else {
                    ctx.translate(0, 5 * intensityFactor);
                }
                break;
            case 'confetti':
                const confettiAngle = progress * Math.PI * 2;
                const confettiScale = 0.8 + Math.sin(progress * Math.PI * 4) * 0.2 * intensityFactor;
                ctx.rotate(confettiAngle);
                ctx.scale(confettiScale, confettiScale);
                // Color changes handled in CSS
                break;
            case 'wave':
                const waveY = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                const waveSkew = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                ctx.transform(1, 0, Math.tan(waveSkew), 1, 0, waveY);
                break;
            case 'jump-rope':
                const jumpY = Math.abs(Math.sin(progress * Math.PI * 2)) * -15 * intensityFactor;
                const jumpScale = 1 - Math.abs(Math.sin(progress * Math.PI * 2)) * 0.3 * intensityFactor;
                const jumpRotation = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor * (Math.PI / 180);
                ctx.translate(0, jumpY);
                ctx.scale(1, jumpScale);
                ctx.rotate(jumpRotation);
                break;
            case 'typewriter':
                // Typewriter effect - implemented through clipping
                const typeProgress = progress * 4 % 1;
                const clipWidth = canvasWidth * (1 - typeProgress);
                ctx.beginPath();
                ctx.rect(0, 0, clipWidth, canvasHeight);
                ctx.clip();
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
                
                ctx.translate(0, bfY);
                // Simulate 3D rotation by scaling
                const scaleX = Math.abs(Math.cos(bfRotationY * Math.PI / 180));
                ctx.scale(scaleX, 1);
                break;
            case 'dizzy':
                const dizzyAngle = progress * Math.PI * 2;
                const dizzyScale = 0.8 + Math.sin(progress * Math.PI * 3) * 0.2 * intensityFactor;
                const dizzyX = Math.sin(progress * Math.PI * 3) * 10 * intensityFactor;
                ctx.rotate(dizzyAngle);
                ctx.scale(dizzyScale, dizzyScale);
                ctx.translate(dizzyX, 0);
                break;
            case 'dance':
                const danceRotation = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor * (Math.PI / 180);
                const danceY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                const danceSkewX = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor * (Math.PI / 180);
                ctx.rotate(danceRotation);
                ctx.transform(1, 0, Math.tan(danceSkewX), 1, 0, danceY);
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
                
                ctx.scale(elasticScaleX, elasticScaleY);
                break;
            case 'shadow-play':
                const shadowX = Math.sin(progress * Math.PI * 2) * 10 * intensityFactor;
                const shadowRotation = Math.sin(progress * Math.PI * 2) * 5 * intensityFactor * (Math.PI / 180);
                ctx.translate(shadowX, 0);
                ctx.rotate(shadowRotation);
                // Shadow effect can't be applied directly in canvas context
                break;
            case 'bounce-rotate':
                const brY = Math.sin(progress * Math.PI * 2) * -15 * intensityFactor;
                const brRotation = progress * Math.PI * 2;
                ctx.translate(0, brY);
                ctx.rotate(brRotation);
                break;
            case 'party-mode':
                const partyPhase = (progress * 5) % 5;
                if (partyPhase < 1) {
                    ctx.scale(1 + 0.1 * intensityFactor, 1 + 0.1 * intensityFactor);
                    ctx.rotate(10 * intensityFactor * (Math.PI / 180));
                } else if (partyPhase < 2) {
                    ctx.scale(0.9 * intensityFactor, 0.9 * intensityFactor);
                    ctx.translate(5 * intensityFactor, -5 * intensityFactor);
                    ctx.rotate(-5 * intensityFactor * (Math.PI / 180));
                } else if (partyPhase < 3) {
                    ctx.scale(1.2 * intensityFactor, 1.2 * intensityFactor);
                    ctx.translate(-5 * intensityFactor, 5 * intensityFactor);
                    ctx.rotate(15 * intensityFactor * (Math.PI / 180));
                } else if (partyPhase < 4) {
                    ctx.scale(0.8 * intensityFactor, 0.8 * intensityFactor);
                    ctx.rotate(-15 * intensityFactor * (Math.PI / 180));
                } else {
                    ctx.scale(1, 1);
                    ctx.rotate(0);
                }
                break;
            case 'rolling':
                const rollX = Math.sin(progress * Math.PI * 2) * 15 * intensityFactor;
                const rollRotation = progress * Math.PI * 4; // 720 degrees
                ctx.translate(rollX, 0);
                ctx.rotate(rollRotation);
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
                ctx.rotate(kRotation);
                ctx.scale(kScale, kScale);
                // Note: clip-path would be applied here if canvas supported it
                break;
            case 'wobble':
                const wPhase = (progress * 4) % 4;
                if (wPhase < 1) {
                    ctx.transform(1, 0, 0, 1, 0, 0);
                } else if (wPhase < 2) {
                    ctx.transform(1, Math.tan(5 * intensityFactor * (Math.PI / 180)), 
                                 Math.tan(15 * intensityFactor * (Math.PI / 180)), 1, 0, 0);
                    ctx.scale(0.9, 1.1);
                } else if (wPhase < 3) {
                    ctx.transform(1, Math.tan(-3 * intensityFactor * (Math.PI / 180)), 
                                 Math.tan(-10 * intensityFactor * (Math.PI / 180)), 1, 0, 0);
                    ctx.scale(1.1, 0.9);
                } else {
                    ctx.transform(1, Math.tan(1 * intensityFactor * (Math.PI / 180)), 
                                 Math.tan(5 * intensityFactor * (Math.PI / 180)), 1, 0, 0);
                    ctx.scale(0.95, 1.05);
                }
                break;
            case 'teleport':
                const tPhase = (progress * 20) % 100;
                if (tPhase < 15 || tPhase >= 85) {
                    // Visible
                    ctx.scale(1, 1);
                } else if (tPhase < 30) {
                    // Shrinking
                    const shrinkFactor = 1 - ((tPhase - 15) / 15);
                    ctx.scale(shrinkFactor, shrinkFactor);
                } else if (tPhase < 50) {
                    // Hidden, moved right
                    ctx.scale(0.1, 0.1);
                    ctx.translate(30 * intensityFactor, 0);
                } else if (tPhase < 70) {
                    // Hidden, moved left
                    ctx.scale(0.1, 0.1);
                    ctx.translate(-30 * intensityFactor, 0);
                } else {
                    // Growing
                    const growFactor = (tPhase - 70) / 15;
                    ctx.scale(growFactor, growFactor);
                }
                break;
            case 'pinwheel':
                ctx.rotate(progress * Math.PI * 2);
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
                ctx.translate(orbitX, orbitY);
                break;
            case 'vvcool':
                // Vibrating pulse effect similar to Discord's VVCool
                const vvScale = 1 + Math.sin(progress * Math.PI * 8) * 0.1 * intensityFactor;
                const vvRotate = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor * (Math.PI / 180);
                const vvShiftX = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor;
                const vvShiftY = Math.cos(progress * Math.PI * 20) * 2 * intensityFactor;
                ctx.translate(vvShiftX, vvShiftY);
                ctx.rotate(vvRotate);
                ctx.scale(vvScale, vvScale);
                break;
            case 'neon-flash':
                // Neon flashing effect
                const neonOpacity = 0.7 + Math.sin(progress * Math.PI * 10) * 0.3 * intensityFactor;
                const neonScale = 1 + Math.sin(progress * Math.PI * 8) * 0.05 * intensityFactor;
                ctx.globalAlpha *= neonOpacity;
                ctx.scale(neonScale, neonScale);
                // Would add glow effect via shadow in CSS, simulated here with scale
                break;
            case 'spin-zoom':
                // Spinning zoom in/out
                const szAngle = progress * Math.PI * 4;
                const szScale = 0.8 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.4 * intensityFactor;
                ctx.rotate(szAngle);
                ctx.scale(szScale, szScale);
                break;
            case 'bounce-wave':
                // Bouncing with wave distortion
                const bwY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                const bwSkewX = Math.sin(progress * Math.PI * 4) * 8 * intensityFactor * (Math.PI / 180);
                const bwScaleY = 1 + Math.sin(progress * Math.PI * 2) * 0.15 * intensityFactor;
                ctx.translate(0, bwY);
                ctx.transform(1, 0, Math.tan(bwSkewX), 1, 0, 0);
                ctx.scale(1, bwScaleY);
                break;
            case 'hyperspeed':
                // Very fast vibrations with slight rotations
                const hsScale = 1 + Math.sin(progress * Math.PI * 8) * 0.1 * intensityFactor;
                const hsRotate = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor * (Math.PI / 180);
                const hsShiftX = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor;
                const hsShiftY = Math.cos(progress * Math.PI * 20) * 2 * intensityFactor;
                ctx.translate(hsShiftX, hsShiftY);
                ctx.rotate(hsRotate);
                ctx.scale(hsScale, hsScale);
                break;
            case 'color-pulse':
                // Apply color pulse (note: this would be handled through a filter in CSS)
                let hue = (progress * 360) % 360;
                ctx.filter = `hue-rotate(${hue}deg)`;
                break;
            case 'pixel-shuffle':
                const psX = Math.sin(progress * Math.PI * 10) * 3 * intensityFactor;
                const psY = Math.cos(progress * Math.PI * 10) * 3 * intensityFactor;
                ctx.translate(psX, psY);
                break;
            case 'glitch-out':
                if (Math.random() > 0.7) {
                    const goX = (Math.random() - 0.5) * 10 * intensityFactor;
                    ctx.translate(goX, 0);
                    // Would apply clip-path and hue-rotate in CSS
                }
                break;
            case 'liquid':
                // Simulate liquid effect by scaling parts differently
                const lqScaleX = 1 + Math.sin(progress * Math.PI * 2) * 0.15 * intensityFactor;
                const lqScaleY = 1 + Math.cos(progress * Math.PI * 2) * 0.15 * intensityFactor;
                ctx.scale(lqScaleX, lqScaleY);
                // Would apply border-radius in CSS
                break;
            case 'warp-drive':
                const wdScale = 1 - Math.abs(Math.sin(progress * Math.PI)) * 0.5 * intensityFactor;
                const wdRotation = progress * Math.PI * 2;
                ctx.rotate(wdRotation);
                ctx.scale(wdScale, wdScale);
                // Would apply filter effects in CSS
                break;
            case 'micro-bounce':
                const microScale = 1 + Math.sin(progress * Math.PI * 2) * 0.1 * intensityFactor;
                ctx.scale(microScale, microScale);
                break;
            case 'shatter':
                const shatterAngle = progress * Math.PI * 2;
                const shatterScale = 0.8 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.2 * intensityFactor;
                ctx.rotate(shatterAngle);
                ctx.scale(shatterScale, shatterScale);
                break;
            case 'clock':
                const clockAngle = progress * Math.PI * 2;
                ctx.rotate(clockAngle);
                break;
            case 'slime':
                const slimeY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                const slimeRotation = Math.sin(progress * Math.PI * 2) * 2 * intensityFactor * (Math.PI / 180);
                ctx.translate(0, slimeY);
                ctx.rotate(slimeRotation);
                break;
            case 'paper-plane':
                const planeAngle = progress * Math.PI * 2;
                const planeScale = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                ctx.rotate(planeAngle);
                ctx.scale(planeScale, planeScale);
                break;
            case 'bubble-pop':
                const bubbleScale = 1 + Math.sin(progress * Math.PI * 2) * 0.1 * intensityFactor;
                ctx.scale(bubbleScale, bubbleScale);
                break;
            case 'vibrate':
                const vibrateScale = 1 + Math.sin(progress * Math.PI * 8) * 0.05 * intensityFactor;
                ctx.scale(vibrateScale, vibrateScale);
                break;
            case 'firework':
                const fireworkScale = 1 + Math.sin(progress * Math.PI * 2) * 0.3 * intensityFactor;
                ctx.scale(fireworkScale, fireworkScale);
                break;
            case 'magnet':
                const magnetAngle = progress * Math.PI * 2;
                ctx.rotate(magnetAngle);
                break;
            case 'pulse-rings':
                const pulseRingsScale = 1 + Math.sin(progress * Math.PI * 2) * 0.2 * intensityFactor;
                ctx.scale(pulseRingsScale, pulseRingsScale);
                break;
            case 'drip':
                const dripY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                ctx.translate(0, dripY);
                break;
            case 'ricochet':
                const ricochetAngle = progress * Math.PI * 2;
                const ricochetScale = 0.8 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.2 * intensityFactor;
                ctx.rotate(ricochetAngle);
                ctx.scale(ricochetScale, ricochetScale);
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
                
                ctx.translate(0, flip3DY);
                // Simulate 3D rotation by scaling
                const flip3DScaleX = Math.abs(Math.cos(flip3DRotationY * Math.PI / 180));
                ctx.scale(flip3DScaleX, 1);
                break;
            case 'thunder':
                const thunderAngle = progress * Math.PI * 2;
                ctx.rotate(thunderAngle);
                break;
            case 'tv-static':
                const tvStaticScale = 1 + Math.sin(progress * Math.PI * 10) * 0.1 * intensityFactor;
                ctx.scale(tvStaticScale, tvStaticScale);
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
                
                ctx.translate(0, flipCoinY);
                // Simulate 3D rotation by scaling
                const flipCoinScaleX = Math.abs(Math.cos(flipCoinRotationY * Math.PI / 180));
                ctx.scale(flipCoinScaleX, 1);
                break;
            case 'matrix':
                const matrixProgress = (progress * 4) % 1;
                const matrixY = Math.floor(matrixProgress * 4) * 10 * intensityFactor;
                const matrixOpacity = 1 - (matrixProgress * 0.8);
                ctx.globalAlpha *= matrixOpacity;
                ctx.translate(0, matrixY);
                break;
            case 'meteor':
                const meteorProgress = progress % 1;
                const meteorX = (meteorProgress * 2 - 1) * 20 * intensityFactor;
                const meteorY = (meteorProgress * 2 - 1) * 20 * intensityFactor;
                const meteorScale = 0.5 + meteorProgress * 0.5;
                const meteorOpacity = meteorProgress < 0.2 ? meteorProgress * 5 : 
                                     meteorProgress > 0.8 ? (1 - meteorProgress) * 5 : 1;
                ctx.globalAlpha *= meteorOpacity;
                ctx.translate(meteorX, meteorY);
                ctx.rotate(progress * Math.PI * 2);
                ctx.scale(meteorScale, meteorScale);
                break;
        }
        
        ctx.translate(-centerX, -centerY);
    }

    // Apply rainbow effect to frame
    applyRainbowEffect(frame, progress, effectiveWidth, effectiveHeight) {
        const hueRotation = (progress * 360) % 360;
        
        // Create a temporary canvas to apply the hue-rotate
        const effectCanvas = document.createElement('canvas');
        effectCanvas.width = effectiveWidth;
        effectCanvas.height = effectiveHeight;
        const effectCtx = effectCanvas.getContext('2d');
        
        // Draw the frame
        effectCtx.drawImage(frame, 0, 0, effectiveWidth, effectiveHeight);
        
        // Get image data and apply hue rotation
        const imageData = effectCtx.getImageData(0, 0, effectiveWidth, effectiveHeight);
        Utils.applyHueRotation(imageData, hueRotation);
        
        // Put the modified image data back
        effectCtx.putImageData(imageData, 0, 0);
        
        return effectCanvas;
    }
}

export default AnimationEngine;