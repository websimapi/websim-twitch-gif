import { getFrames, getImageSettings } from './image.js';

let selectedAnimation = 'none';
let animationIntensity = 5;
let animationSpeed = 1;
let rainbowEffect = false;
let previewGif = null;
let gifWorkerBlob;

export function setupAnimationControls() {
    // Fetch GIF Worker
    fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
        .then(response => response.blob())
        .then(blob => {
            gifWorkerBlob = blob;
        });

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
}

export function updateLivePreview() {
    const previewCanvas = document.getElementById('previewAnimation');
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    const frames = getFrames();
    if (frames.length === 0) return;

    const settings = getImageSettings();
    
    generateAccuratePreview(previewCanvas, settings);
}

export function getAnimationSettings() {
    return {
        selectedAnimation,
        animationIntensity,
        animationSpeed,
        rainbowEffect
    };
}

function generateAnimationCSS(animationType) {
    const duration = (1 / animationSpeed).toFixed(1);
    const intensity = animationIntensity / 5;
    
    switch(animationType) {
        case 'rotate':
            return `rotate ${duration}s linear infinite`;
        case 'bounce':
            return `bounce ${duration}s ease-in-out infinite`;
        case 'fade':
            return `fade ${duration}s ease-in-out infinite`;
        case 'shake':
            return `shake ${duration}s ease-in-out infinite`;
        case 'pulse':
            return `pulse ${duration}s ease-in-out infinite`;
        case 'flip':
            return `flip ${duration}s ease-in-out infinite`;
        case 'swing':
            return `swing ${duration}s ease-in-out infinite`;
        case 'zoom':
            return `zoom ${duration}s ease-in-out infinite`;
        case 'spin':
            return `spin ${duration}s linear infinite`;
        case 'wiggle':
            return `wiggle ${duration}s ease-in-out infinite`;
        case 'squeeze':
            return `squeeze ${duration}s ease-in-out infinite`;
        case 'slide':
            return `slide ${duration}s ease-in-out infinite`;
        case 'glitch':
            return `glitch ${duration}s ease-in-out infinite`;
        case 'bounce-around':
            return `bounceAround ${duration}s ease-in-out infinite`;
        case 'float':
            return `float ${duration}s ease-in-out infinite`;
        case 'spiral':
            return `spiral ${duration}s linear infinite`;
        case 'throb':
            return `throb ${duration}s ease-in-out infinite`;
        case 'heartbeat':
            return `heartbeat ${duration}s ease-in-out infinite`;
        case 'jello':
            return `jello ${duration}s ease-in-out infinite`;
        case 'pendulum':
            return `pendulum ${duration}s ease-in-out infinite`;
        case 'blink':
            return `blink ${duration}s step-end infinite`;
        case 'rainbow':
            return `rainbow ${duration}s linear infinite`;
        case 'tornado':
            return `tornado ${duration}s ease-in-out infinite`;
        case 'orbit':
            return `orbit ${duration}s linear infinite`;
        case 'diagonal-bounce':
            return `diagonalBounce ${duration}s ease-in-out infinite`;
        case 'pixelate':
            return `pixelate ${duration}s ease-in-out infinite`;
        case 'sway':
            return `sway ${duration}s ease-in-out infinite`;
        case 'ripple':
            return `ripple ${duration}s ease-in-out infinite`;
        case 'split-shift':
            return `splitShift ${duration}s ease-in-out infinite`;
        case 'confetti':
            return `confetti ${duration}s linear infinite`;
        case 'wave':
            return `wave ${duration}s ease-in-out infinite`;
        case 'jump-rope':
            return `jumpRope ${duration}s ease-in-out infinite`;
        case 'typewriter':
            return `typewriter ${duration}s steps(8, end) infinite`;
        case 'bounce-flip':
            return `bounceFlip ${duration}s ease-in-out infinite`;
        case 'dizzy':
            return `dizzy ${duration}s ease-in-out infinite`;
        case 'dance':
            return `dance ${duration}s ease-in-out infinite`;
        case 'elastic':
            return `elastic ${duration}s cubic-bezier(.68,-0.55,.27,1.55) infinite`;
        case 'shadow-play':
            return `shadowPlay ${duration}s ease-in-out infinite`;
        case 'bounce-rotate':
            return `bounceRotate ${duration}s ease-in-out infinite`;
        case 'party-mode':
            return `partyMode ${duration}s ease-in-out infinite`;
        case 'rolling':
            return `rolling ${duration}s ease-in-out infinite`;
        case 'kaleidoscope':
            return `kaleidoscope ${duration}s linear infinite`;
        case 'wobble':
            return `wobble ${duration}s ease-in-out infinite`;
        case 'teleport':
            return `teleport ${duration}s ease-in-out infinite`;
        case 'pinwheel':
            return `pinwheel ${duration}s linear infinite`;
        case 'rainbow-effect':
            return `rainbow ${duration}s linear infinite`;
        case 'bounce-orbit':
            return `bounceOrbit ${duration}s ease-in-out infinite`;
        case 'vvcool':
            return `vvcool ${duration}s linear infinite`;
        case 'neon-flash':
            return `neonFlash ${duration}s linear infinite`;
        case 'spin-zoom':
            return `spinZoom ${duration}s ease-in-out infinite`;
        case 'bounce-wave':
            return `bounceWave ${duration}s ease-in-out infinite`;
        case 'hyperspeed':
            return `hyperspeed ${duration}s linear infinite`;
        case 'color-pulse':
            return `colorPulse ${duration}s linear infinite`;
        case 'pixel-shuffle':
            return `pixelShuffle ${duration}s linear infinite`;
        case 'glitch-out':
            return `glitchOut ${duration}s ease-in-out infinite`;
        case 'liquid':
            return `liquid ${duration}s ease-in-out infinite`;
        case 'warp-drive':
            return `warpDrive ${duration}s linear infinite`;
        case 'micro-bounce':
            return `microBounce ${duration}s ease-in-out infinite`;
        case 'shatter':
            return `shatter ${duration}s ease-in-out infinite`;
        case 'clock':
            return `clock ${duration}s linear infinite`;
        case 'slime':
            return `slime ${duration}s ease-in-out infinite`;
        case 'paper-plane':
            return `paperPlane ${duration}s ease-in-out infinite`;
        case 'bubble-pop':
            return `bubblePop ${duration}s ease-in-out infinite`;
        case 'vibrate':
            return `vibrate ${duration}s linear infinite`;
        case 'firework':
            return `firework ${duration}s ease-out infinite`;
        case 'magnet':
            return `magnet ${duration}s ease-in-out infinite`;
        case 'pulse-rings':
            return `pulseRings ${duration}s ease-in-out infinite`;
        case 'drip':
            return `drip ${duration}s ease-in-out infinite`;
        case 'ricochet':
            return `ricochet ${duration}s ease-in-out infinite`;
        case 'flip-3d':
            return `flip3D ${duration}s ease-in-out infinite`;
        case 'thunder':
            return `thunder ${duration}s ease-in-out infinite`;
        case 'tv-static':
            return `tvStatic ${duration}s step-end infinite`;
        case 'flip-coin':
            return `flipCoin ${duration}s linear infinite`;
        case 'matrix':
            return `matrix ${duration}s ease-in-out infinite`;
        case 'meteor':
            return `meteor ${duration}s linear infinite`;
        case 'pendulum-wave':
            return `pendulumWave ${duration}s ease-in-out infinite`;
        case 'tumbleweed':
            return `tumbleweed ${duration}s linear infinite`;
        case 'gentle-shake':
            return `gentleShake ${duration}s ease-in-out infinite`;
        case 'tiny-jump':
            return `tinyJump ${duration}s ease-in-out infinite`;
        case 'subtle-pulse':
            return `subtlePulse ${duration}s ease-in-out infinite`;
        case 'soft-wobble':
            return `softWobble ${duration}s ease-in-out infinite`;
        case 'micro-spin':
            return `microSpin ${duration}s linear infinite`;
        case 'mini-orbit':
            return `miniOrbit ${duration}s linear infinite`;
        case 'light-flicker':
            return `lightFlicker ${duration}s step-end infinite`;
        case 'smooth-slide':
            return `smoothSlide ${duration}s ease-in-out infinite`;
        case 'tiny-twist':
            return `tinyTwist ${duration}s ease-in-out infinite`;
        case 'quick-pulse':
            return `quickPulse ${duration}s ease-in-out infinite`;
        case 'mini-rotate':
            return `miniRotate ${duration}s linear infinite`;
        case 'soft-breathe':
            return `softBreathe ${duration}s ease-in-out infinite`;
        case 'nano-bounce':
            return `nanoBounce ${duration}s ease-in-out infinite`;
        case 'subtle-wave':
            return `subtleWave ${duration}s ease-in-out infinite`;
        case 'gentle-rock':
            return `gentleRock ${duration}s ease-in-out infinite`;
        case 'tiny-bounce':
            return `tinyBounce ${duration}s ease-in-out infinite`;
        case 'micro-waggle':
            return `microWaggle ${duration}s ease-in-out infinite`;
        case 'soft-vibrate':
            return `softVibrate ${duration}s linear infinite`;
        case 'micro-float':
            return `microFloat ${duration}s ease-in-out infinite`;
        case 'subtle-throb':
            return `subtleThrob ${duration}s ease-in-out infinite`;
        case 'diagonal-shake':
            return `diagonal-shake ${duration}s ease-in-out infinite`;
        case 'diagonal-jitter':
            return `diagonal-jitter ${duration}s ease-in-out infinite`;
        case 'diagonal-pulse-shake':
            return `diagonal-pulse-shake ${duration}s ease-in-out infinite`;
        case 'diagonal-zigzag':
            return `diagonal-zigzag ${duration}s ease-in-out infinite`;
        case 'diagonal-wave-shake':
            return `diagonal-wave-shake ${duration}s ease-in-out infinite`;
        default:
            return '';
    }
}

async function generateAccuratePreview(previewCanvas, settings) {
    if (!gifWorkerBlob) {
        await new Promise(resolve => {
            const checkWorker = () => {
                if (gifWorkerBlob) {
                    resolve();
                } else {
                    setTimeout(checkWorker, 100);
                }
            };
            checkWorker();
        });
    }
    
    const frames = getFrames();
    if (frames.length === 0) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 112;
    tempCanvas.height = 112;
    const tempCtx = tempCanvas.getContext('2d');

    const gif = new GIF({
        workers: 1,
        quality: 5,
        width: 112,
        height: 112,
        workerScript: URL.createObjectURL(gifWorkerBlob),
        transparent: settings.backgroundColor ? null : 0x00000000
    });

    const fps = 10;
    const previewDuration = 1;
    const totalFrames = fps * previewDuration;

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
                        const cycle = (progress * 4) % 4;
                        let xOffset = 0, yOffset = 0;
                        
                        if (cycle < 1) { 
                            xOffset = cycle * 10 * intensityFactor;
                            yOffset = -5 * intensityFactor;
                        } else if (cycle < 2) { 
                            xOffset = 10 * intensityFactor;
                            yOffset = (cycle - 1) * 10 * intensityFactor - 5 * intensityFactor;
                        } else if (cycle < 3) { 
                            xOffset = (3 - cycle) * 10 * intensityFactor;
                            yOffset = 5 * intensityFactor;
                        } else { 
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
                        tempCtx.scale(rippleScale, rippleScale);
                        break;
                    case 'split-shift':
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
                        const rollRotation = progress * Math.PI * 4; 
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
                            tempCtx.scale(1, 1);
                            tempCtx.globalAlpha = (settings.opacity / 100);
                        } else if (tPhase < 30) {
                            const shrinkFactor = 1 - ((tPhase - 15) / 15);
                            tempCtx.scale(shrinkFactor, shrinkFactor);
                            tempCtx.globalAlpha = (settings.opacity / 100) * 0.5;
                        } else if (tPhase < 50) {
                            tempCtx.scale(0.1, 0.1);
                            tempCtx.translate(30 * intensityFactor, 0);
                            tempCtx.globalAlpha = 0;
                        } else if (tPhase < 70) {
                            tempCtx.scale(0.1, 0.1);
                            tempCtx.translate(-30 * intensityFactor, 0);
                            tempCtx.globalAlpha = (settings.opacity / 100) * 0.5;
                        } else {
                            const growFactor = (tPhase - 70) / 15;
                            tempCtx.scale(growFactor, growFactor);
                            tempCtx.globalAlpha = (settings.opacity / 100) * 0.8;
                        }
                        break;
                    case 'pinwheel':
                        tempCtx.rotate(progress * Math.PI * 2);
                        break;
                    case 'bounce-orbit':
                        let orbitX = 0, orbitY = 0;
                        if (progress < 0.25) {
                            orbitX = -15 * intensityFactor + (progress * 4) * 15 * intensityFactor;
                            orbitY = -15 * intensityFactor - Math.sin(progress * 4 * Math.PI/2) * 5 * intensityFactor;
                        } else if (progress < 0.5) {
                            orbitX = (progress - 0.25) * 4 * 15 * intensityFactor;
                            orbitY = -20 * intensityFactor + Math.sin((progress - 0.25) * 4 * Math.PI/2) * 5 * intensityFactor;
                        } else if (progress < 0.75) {
                            orbitX = 15 * intensityFactor - ((progress - 0.5) * 4) * 15 * intensityFactor;
                            orbitY = -15 * intensityFactor + (progress - 0.5) * 4 * 30 * intensityFactor;
                        } else {
                            orbitX = -15 * intensityFactor * (progress - 0.75) * 4;
                            orbitY = 15 * intensityFactor - (progress - 0.75) * 4 * 30 * intensityFactor;
                        }
                        tempCtx.translate(orbitX, orbitY);
                        break;
                    case 'vvcool':
                        const vvScale = 1 + Math.sin(progress * Math.PI * 8) * 0.1 * intensityFactor;
                        const vvRotate = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor * (Math.PI / 180);
                        const vvShiftX = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor;
                        const vvShiftY = Math.cos(progress * Math.PI * 20) * 2 * intensityFactor;
                        tempCtx.translate(vvShiftX, vvShiftY);
                        tempCtx.rotate(vvRotate);
                        tempCtx.scale(vvScale, vvScale);
                        break;
                    case 'neon-flash':
                        const neonOpacity = 0.7 + Math.sin(progress * Math.PI * 10) * 0.3 * intensityFactor;
                        const neonScale = 1 + Math.sin(progress * Math.PI * 8) * 0.05 * intensityFactor;
                        tempCtx.globalAlpha = (settings.opacity / 100) * neonOpacity;
                        tempCtx.scale(neonScale, neonScale);
                        break;
                    case 'spin-zoom':
                        const szAngle = progress * Math.PI * 4;
                        const szScale = 0.8 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.4 * intensityFactor;
                        tempCtx.rotate(szAngle);
                        tempCtx.scale(szScale, szScale);
                        break;
                    case 'bounce-wave':
                        const bwY = Math.sin(progress * Math.PI * 2) * -10 * intensityFactor;
                        const bwSkewX = Math.sin(progress * Math.PI * 4) * 8 * intensityFactor * (Math.PI / 180);
                        const bwScaleY = 1 + Math.sin(progress * Math.PI * 2) * 0.15 * intensityFactor;
                        tempCtx.translate(0, bwY);
                        tempCtx.transform(1, 0, Math.tan(bwSkewX), 1, 0, 0);
                        tempCtx.scale(1, bwScaleY);
                        break;
                    case 'hyperspeed':
                        const hsScale = 1 + Math.sin(progress * Math.PI * 8) * 0.1 * intensityFactor;
                        const hsRotate = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor * (Math.PI / 180);
                        const hsShiftX = Math.sin(progress * Math.PI * 20) * 2 * intensityFactor;
                        const hsShiftY = Math.cos(progress * Math.PI * 20) * 2 * intensityFactor;
                        tempCtx.translate(hsShiftX, hsShiftY);
                        tempCtx.rotate(hsRotate);
                        tempCtx.scale(hsScale, hsScale);
                        break;
                    case 'color-pulse':
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
                        }
                        break;
                    case 'liquid':
                        const lqScaleX = 1 + Math.sin(progress * Math.PI * 2) * 0.15 * intensityFactor;
                        const lqScaleY = 1 + Math.cos(progress * Math.PI * 2) * 0.15 * intensityFactor;
                        tempCtx.scale(lqScaleX, lqScaleY);
                        break;
                    case 'warp-drive':
                        const wdScale = 1 - Math.abs(Math.sin(progress * Math.PI)) * 0.5 * intensityFactor;
                        const wdRotation = progress * Math.PI * 2;
                        tempCtx.rotate(wdRotation);
                        tempCtx.scale(wdScale, wdScale);
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
                
                const effectCanvas = document.createElement('canvas');
                effectCanvas.width = effectiveWidth;
                effectCanvas.height = effectiveHeight;
                const effectCtx = effectCanvas.getContext('2d');
                
                effectCtx.drawImage(frame, 0, 0, effectiveWidth, effectiveHeight);
                
                const imageData = effectCtx.getImageData(0, 0, effectiveWidth, effectiveHeight);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] > 0) { 
                        const r = data[i] / 255;
                        const g = data[i + 1] / 255;
                        const b = data[i + 2] / 255;
                        
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        let h, s, l = (max + min) / 2;
                        
                        if (max === min) {
                            h = s = 0; 
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
                        
                        h = (h + hueRotation / 360) % 1;
                        
                        let r1, g1, b1;
                        
                        if (s === 0) {
                            r1 = g1 = b1 = l; 
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
                        
                        data[i] = Math.round(r1 * 255);
                        data[i + 1] = Math.round(g1 * 255);
                        data[i + 2] = Math.round(b1 * 255);
                    }
                }
                
                effectCtx.putImageData(imageData, 0, 0);
                
                tempCtx.drawImage(effectCanvas, x, y, effectiveWidth, effectiveHeight);
            } else {
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
}