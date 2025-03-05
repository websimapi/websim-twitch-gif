// Animation-related code
function generateAnimationCSS(animationType, duration, intensity) {
    const intensityFactor = intensity / 5;
    
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

// Animation keyframes
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

@keyframes fade {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

@keyframes flip {
    0%, 100% { transform: perspective(400px) rotateY(0); }
    50% { transform: perspective(400px) rotateY(180deg); }
}

@keyframes swing {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(15deg); }
    75% { transform: rotate(-15deg); }
}

@keyframes zoom {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.5); }
}

@keyframes spin {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(0.8); }
    100% { transform: rotate(360deg) scale(1); }
}

@keyframes wiggle {
    0%, 100% { transform: skewX(0deg); }
    25% { transform: skewX(10deg); }
    75% { transform: skewX(-10deg); }
}

@keyframes squeeze {
    0%, 100% { transform: scaleX(1) scaleY(1); }
    50% { transform: scaleX(1.2) scaleY(0.8); }
}

@keyframes slide {
    0% { transform: translateX(-15px); }
    50% { transform: translateX(15px); }
    100% { transform: translateX(-15px); }
}

@keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-5px, 5px); }
    40% { transform: translate(5px, -5px); }
    60% { transform: translate(-3px, -3px); }
    80% { transform: translate(3px, 3px); }
}

@keyframes bounceAround {
    0% { transform: translate(-15px, -15px); }
    25% { transform: translate(15px, -15px); }
    50% { transform: translate(15px, 15px); }
    75% { transform: translate(-15px, 15px); }
    100% { transform: translate(-15px, -15px); }
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(2deg); }
    75% { transform: translateY(10px) rotate(-2deg); }
}

@keyframes spiral {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(0.5); }
    100% { transform: rotate(360deg) scale(1); }
}

@keyframes throb {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.3); opacity: 1; }
}

@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    10%, 30% { transform: scale(1.2); }
    20%, 40% { transform: scale(1.1); }
    50%, 70% { transform: scale(1.25); }
    60%, 80% { transform: scale(1.15); }
}

@keyframes jello {
    0%, 100% { transform: skewX(0deg) skewY(0deg); }
    25% { transform: skewX(15deg) skewY(5deg); }
    50% { transform: skewX(-10deg) skewY(-3deg); }
    75% { transform: skewX(5deg) skewY(1deg); }
}

@keyframes pendulum {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(-20deg); }
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

@keyframes tornado {
    0% { transform: rotate(0deg) scale(1) translateX(0); }
    25% { transform: rotate(90deg) scale(0.8) translateX(10px); }
    50% { transform: rotate(180deg) scale(0.6) translateX(-10px); }
    75% { transform: rotate(270deg) scale(0.8) translateX(10px); }
    100% { transform: rotate(360deg) scale(1) translateX(0); }
}

@keyframes orbit {
    0% { transform: rotate(0deg) translateX(15px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); }
}

@keyframes diagonalBounce {
    0% { transform: translate(-15px, -15px) rotate(-5deg); }
    25% { transform: translate(0px, 0px) rotate(5deg); }
    50% { transform: translate(15px, 15px) rotate(-5deg); }
    75% { transform: translate(0px, 0px) rotate(5deg); }
    100% { transform: translate(-15px, -15px) rotate(-5deg); }
}

@keyframes pixelate {
    0%, 100% { transform: scale(1); image-rendering: auto; }
    25%, 75% { transform: scale(0.8); image-rendering: pixelated; filter: contrast(1.4); }
    50% { transform: scale(0.6); image-rendering: pixelated; filter: contrast(1.8); }
}

@keyframes sway {
    0%, 100% { transform: skew(0deg, 0deg) translateX(0); }
    25% { transform: skew(10deg, 5deg) translateX(-10px); }
    75% { transform: skew(-10deg, -5deg) translateX(10px); }
}

@keyframes ripple {
    0%, 100% { transform: scale(1); filter: blur(0px); }
    50% { transform: scale(1.2); filter: blur(2px); }
    75% { transform: scale(0.9); filter: blur(1px); }
}

@keyframes splitShift {
    0%, 100% { clip-path: inset(0 0 0 0); }
    25% { clip-path: inset(0 50% 0 0); transform: translateX(-5px); }
    30% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    45% { clip-path: inset(50% 0 0 0); transform: translateY(-5px); }
    50% { clip-path: inset(0 0 0 0); transform: translateY(0); }
    65% { clip-path: inset(0 0 0 50%); transform: translateX(5px); }
    70% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    85% { clip-path: inset(0 0 50% 0); transform: translateY(5px); }
    90% { clip-path: inset(0 0 0 0); transform: translateY(0); }
}

@keyframes confetti {
    0% { background: red; transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { background: blue; transform: translate(-5px, 5px) rotate(90deg) scale(0.8); }
    50% { background: green; transform: translate(5px, -5px) rotate(180deg) scale(1.2); }
    75% { background: yellow; transform: translate(5px, 5px) rotate(270deg) scale(0.9); }
    100% { background: red; transform: translate(0, 0) rotate(360deg) scale(1); }
}

@keyframes wave {
    0%, 100% { transform: translateY(0) scaleY(1); }
    25% { transform: translateY(-10px) scaleY(1.2) skewX(15deg); }
    50% { transform: translateY(0) scaleY(1) skewX(0deg); }
    75% { transform: translateY(10px) scaleY(0.8) skewX(-15deg); }
}

@keyframes jumpRope {
    0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); }
    25% { transform: translateY(-15px) scaleY(0.7) rotate(-15deg); }
    50% { transform: translateY(0) scaleY(1.3) rotate(0deg); }
    75% { transform: translateY(-15px) scaleY(0.7) rotate(15deg); }
}

@keyframes typewriter {
    0%, 100% { clip-path: inset(0 0 0 0); }
    25% { clip-path: inset(0 75% 0 0); }
    50% { clip-path: inset(0 50% 0 0); }
    75% { clip-path: inset(0 25% 0 0); }
}

@keyframes bounceFlip {
    0%, 100% { transform: translateY(0) rotateY(0deg); }
    25% { transform: translateY(-10px) rotateY(90deg); }
    50% { transform: translateY(0) rotateY(180deg); }
    75% { transform: translateY(10px) rotateY(270deg); }
}

@keyframes dizzy {
    0% { transform: rotate(0deg) scale(1); }
    33% { transform: rotate(120deg) scale(0.8); }
    66% { transform: rotate(240deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }
}

@keyframes dance {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    25% { transform: rotate(10deg) translateY(-10px) skewX(10deg); }
    50% { transform: rotate(-10deg) translateY(0) skewX(-10deg); }
    75% { transform: rotate(5deg) translateY(10px) skewX(5deg); }
}

@keyframes elastic {
    0%, 100% { transform: scale(1, 1); }
    25% { transform: scale(1.5, 0.5); }
    50% { transform: scale(0.8, 1.2); }
    75% { transform: scale(1.2, 0.8); }
}

@keyframes shadowPlay {
    0%, 100% { transform: translateX(0) rotate(0deg); box-shadow: 0 0 0 rgba(0, 0, 0, 0); }
    25% { transform: translateX(-10px) rotate(-5deg); box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3); }
    75% { transform: translateX(10px) rotate(5deg); box-shadow: -10px 10px 5px rgba(0, 0, 0, 0.3); }
}

@keyframes bounceRotate {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(90deg); }
    50% { transform: translateY(5px) rotate(180deg); }
    75% { transform: translateY(-10px) rotate(270deg); }
}

@keyframes partyMode {
    0%, 100% { transform: scale(1) rotate(0deg); background: red; }
    20% { transform: scale(1.1) rotate(10deg); background: orange; }
    40% { transform: scale(0.9) translate(5px, -5px) rotate(-5deg); background: yellow; }
    60% { transform: scale(1.2) translate(-5px, 5px) rotate(15deg); background: green; }
    80% { transform: scale(0.8) rotate(-15deg); background: blue; }
}

@keyframes rolling {
    0% { transform: translateX(-15px) rotate(0deg); }
    50% { transform: translateX(15px) rotate(360deg); }
    100% { transform: translateX(-15px) rotate(720deg); }
}

@keyframes kaleidoscope {
    0% { transform: rotate(0deg) scale(1); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
    33% { transform: rotate(120deg) scale(0.8); clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%); }
    66% { transform: rotate(240deg) scale(1.2); clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%); }
    100% { transform: rotate(360deg) scale(1); clip-path: polygon(50% 0%, 61% 35%, 98```javascript
// Animation-related code
function generateAnimationCSS(animationType, duration, intensity) {
    const intensityFactor = intensity / 5;
    
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
            return `miniOrbit ${duration}s ease-in-out infinite`;
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

// Animation keyframes
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

@keyframes fade {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

@keyframes flip {
    0%, 100% { transform: perspective(400px) rotateY(0); }
    50% { transform: perspective(400px) rotateY(180deg); }
}

@keyframes swing {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(15deg); }
    75% { transform: rotate(-15deg); }
}

@keyframes zoom {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.5); }
}

@keyframes spin {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(0.8); }
    100% { transform: rotate(360deg) scale(1); }
}

@keyframes wiggle {
    0%, 100% { transform: skewX(0deg); }
    25% { transform: skewX(10deg); }
    75% { transform: skewX(-10deg); }
}

@keyframes squeeze {
    0%, 100% { transform: scaleX(1) scaleY(1); }
    50% { transform: scaleX(1.2) scaleY(0.8); }
}

@keyframes slide {
    0% { transform: translateX(-15px); }
    50% { transform: translateX(15px); }
    100% { transform: translateX(-15px); }
}

@keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-5px, 5px); }
    40% { transform: translate(5px, -5px); }
    60% { transform: translate(-3px, -3px); }
    80% { transform: translate(3px, 3px); }
}

@keyframes bounceAround {
    0% { transform: translate(-15px, -15px); }
    25% { transform: translate(15px, -15px); }
    50% { transform: translate(15px, 15px); }
    75% { transform: translate(-15px, 15px); }
    100% { transform: translate(-15px, -15px); }
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(2deg); }
    75% { transform: translateY(10px) rotate(-2deg); }
}

@keyframes spiral {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(0.5); }
    100% { transform: rotate(360deg) scale(1); }
}

@keyframes throb {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.3); opacity: 1; }
}

@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    10%, 30% { transform: scale(1.2); }
    20%, 40% { transform: scale(1.1); }
    50%, 70% { transform: scale(1.25); }
    60%, 80% { transform: scale(1.15); }
}

@keyframes jello {
    0%, 100% { transform: skewX(0deg) skewY(0deg); }
    25% { transform: skewX(15deg) skewY(5deg); }
    50% { transform: skewX(-10deg) skewY(-3deg); }
    75% { transform: skewX(5deg) skewY(1deg); }
}

@keyframes pendulum {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(-20deg); }
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

@keyframes tornado {
    0% { transform: rotate(0deg) scale(1) translateX(0); }
    25% { transform: rotate(90deg) scale(0.8) translateX(10px); }
    50% { transform: rotate(180deg) scale(0.6) translateX(-10px); }
    75% { transform: rotate(270deg) scale(0.8) translateX(10px); }
    100% { transform: rotate(360deg) scale(1) translateX(0); }
}

@keyframes orbit {
    0% { transform: rotate(0deg) translateX(15px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); }
}

@keyframes diagonalBounce {
    0% { transform: translate(-15px, -15px) rotate(-5deg); }
    25% { transform: translate(0px, 0px) rotate(5deg); }
    50% { transform: translate(15px, 15px) rotate(-5deg); }
    75% { transform: translate(0px, 0px) rotate(5deg); }
    100% { transform: translate(-15px, -15px) rotate(-5deg); }
}

@keyframes pixelate {
    0%, 100% { transform: scale(1); image-rendering: auto; }
    25%, 75% { transform: scale(0.8); image-rendering: pixelated; filter: contrast(1.4); }
    50% { transform: scale(0.6); image-rendering: pixelated; filter: contrast(1.8); }
}

@keyframes sway {
    0%, 100% { transform: skew(0deg, 0deg) translateX(0); }
    25% { transform: skew(10deg, 5deg) translateX(-10px); }
    75% { transform: skew(-10deg, -5deg) translateX(10px); }
}

@keyframes ripple {
    0%, 100% { transform: scale(1); filter: blur(0px); }
    50% { transform: scale(1.2); filter: blur(2px); }
    75% { transform: scale(0.9); filter: blur(1px); }
}

@keyframes splitShift {
    0%, 100% { clip-path: inset(0 0 0 0); }
    25% { clip-path: inset(0 50% 0 0); transform: translateX(-5px); }
    30% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    45% { clip-path: inset(50% 0 0 0); transform: translateY(-5px); }
    50% { clip-path: inset(0 0 0 0); transform: translateY(0); }
    65% { clip-path: inset(0 0 0 50%); transform: translateX(5px); }
    70% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    85% { clip-path: inset(0 0 50% 0); transform: translateY(5px); }
    90% { clip-path: inset(0 0 0 0); transform: translateY(0); }
}

@keyframes confetti {
    0% { background: red; transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { background: blue; transform: translate(-5px, 5px) rotate(90deg) scale(0.8); }
    50% { background: green; transform: translate(5px, -5px) rotate(180deg) scale(1.2); }
    75% { background: yellow; transform: translate(5px, 5px) rotate(270deg) scale(0.9); }
    100% { background: red; transform: translate(0, 0) rotate(360deg) scale(1); }
}

@keyframes wave {
    0%, 100% { transform: translateY(0) scaleY(1); }
    25% { transform: translateY(-10px) scaleY(1.2) skewX(15deg); }
    50% { transform: translateY(0) scaleY(1) skewX(0deg); }
    75% { transform: translateY(10px) scaleY(0.8) skewX(-15deg); }
}

@keyframes jumpRope {
    0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); }
    25% { transform: translateY(-15px) scaleY(0.7) rotate(-15deg); }
    50% { transform: translateY(0) scaleY(1.3) rotate(0deg); }
    75% { transform: translateY(-15px) scaleY(0.7) rotate(15deg); }
}

@keyframes typewriter {
    0%, 100% { clip-path: inset(0 0 0 0); }
    25% { clip-path: inset(0 75% 0 0); }
    50% { clip-path: inset(0 50% 0 0); }
    75% { clip-path: inset(0 25% 0 0); }
}

@keyframes bounceFlip {
    0%, 100% { transform: translateY(0) rotateY(0deg); }
    25% { transform: translateY(-10px) rotateY(90deg); }
    50% { transform: translateY(0) rotateY(180deg); }
    75% { transform: translateY(10px) rotateY(270deg); }
}

@keyframes dizzy {
    0% { transform: rotate(0deg) scale(1) translateX(0); }
    33% { transform: rotate(120deg) scale(0.8) translateX(10px); }
    66% { transform: rotate(240deg) scale(1.2) translateX(-10px); }
    100% { transform: rotate(360deg) scale(1) translateX(0); }
}

@keyframes dance {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    25% { transform: rotate(10deg) translateY(-10px) skewX(10deg); }
    50% { transform: rotate(-10deg) translateY(0) skewX(-10deg); }
    75% { transform: rotate(5deg) translateY(10px) skewX(5deg); }
}

@keyframes elastic {
    0%, 100% { transform: scale(1, 1); }
    25% { transform: scale(1.5, 0.5); }
    50% { transform: scale(0.8, 1.2); }
    75% { transform: scale(1.2, 0.8); }
}

@keyframes shadowPlay {
    0%, 100% { transform: translateX(0) rotate(0deg); box-shadow: 0 0 0 rgba(0, 0, 0, 0); }
    25% { transform: translateX(-10px) rotate(-5deg); box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3); }
    75% { transform: translateX(10px) rotate(5deg); box-shadow: -10px 10px 5px rgba(0, 0, 0, 0.3); }
}

@keyframes bounceRotate {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(90deg); }
    50% { transform: translateY(5px) rotate(180deg); }
    75% { transform: translateY(-10px) rotate(270deg); }
}

@keyframes partyMode {
    0%, 100% { transform: scale(1) rotate(0deg); background: red; }
    20% { transform: scale(1.1) rotate(10deg); background: orange; }
    40% { transform: scale(0.9) translate(5px, -5px) rotate(-5deg); background: yellow; }
    60% { transform: scale(1.2) translate(-5px, 5px) rotate(15deg); background: green; }
    80% { transform: scale(0.8) rotate(-15deg); background: blue; }
}

@keyframes rolling {
    0% { transform: translateX(-15px) rotate(0deg); }
    50% { transform: translateX(15px) rotate(360deg); }
    100% { transform: translateX(-15px) rotate(720deg); }
}

@keyframes kaleidoscope {
    0% { transform: rotate(0deg) scale(1); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
    33% { transform: rotate(120deg) scale(0.8); clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%); }
    66% { transform: rotate(240deg) scale(1.2); clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%); }
    100% { transform: rotate(360deg) scale(1); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
}

@keyframes wobble {
    0%, 100% { transform: skewX(0deg) skewY(0deg) scale(1, 1); }
    25% { transform: skewX(15deg) skewY(5deg) scale(0.9, 1.1); }
    50% { transform: skewX(-10deg) skewY(-3deg) scale(1.1, 0.9); }
    75% { transform: skewX(5deg) skewY(1deg) scale(0.95, 1.05); }
}

@keyframes teleport {
    0%, 15%, 85%, 100% { transform: scale(1); opacity: 1; }
    30% { transform: scale(0.1); opacity: 0.5; }
    50% { transform: scale(0.1) translateX(30px); opacity: 0; }
    70% { transform: scale(0.1) translateX(-30px); opacity: 0.5; }
}

@keyframes pinwheel {
    from { transform: rotate(0deg) scale(1); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
    to { transform: rotate(360deg) scale(1); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
}

@keyframes bounceOrbit {
    0% { transform: translate(-15px, -15px); }
    25% { transform: translate(0, -20px); }
    50% { transform: translate(15px, -15px); }
    75% { transform: translate(0, 15px); }
    100% { transform: translate(-15px, -15px); }
}

@keyframes vvcool {
    0%, 100% { transform: scale(1) rotate(0deg) translate(0, 0); }
    10% { transform: scale(1.1) rotate(1deg) translate(1px, -1px); }
    20% { transform: scale(1.05) rotate(-1deg) translate(-1px, 1px); }
    30% { transform: scale(1.1) rotate(1deg) translate(1px, 1px); }
    40% { transform: scale(1.05) rotate(-1deg) translate(-1px, -1px); }
    50% { transform: scale(1.1) rotate(1deg) translate(-1px, 1px); }
    60% { transform: scale(1.05) rotate(-1deg) translate(1px, -1px); }
    70% { transform: scale(1.1) rotate(1deg) translate(-1px, -1px); }
    80% { transform: scale(1.05) rotate(-1deg) translate(1px, 1px); }
    90% { transform: scale(1.1) rotate(1deg) translate(0, 0); }
}

@keyframes neonFlash {
    0%, 100% { opacity: 1; filter: brightness(1) drop-shadow(0 0 5px rgba(0, 255, 255, 0.8)); }
    50% { opacity: 0.7; filter: brightness(1.3) drop-shadow(0 0 8px rgba(0, 255, 255, 1)); }
}

@keyframes spinZoom {
    0% { transform: rotate(0deg) scale(0.8); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(0.8); }
}

@keyframes bounceWave {
    0% { transform: translateY(0) scaleY(1) skewX(0deg); }
    25% { transform: translateY(-10px) scaleY(1.15) skewX(8deg); }
    50% { transform: translateY(0) scaleY(1) skewX(-8deg); }
    75% { transform: translateY(10px) scaleY(0.85) skewX(8deg); }
    100% { transform: translateY(0) scaleY(1) skewX(0deg); }
}

@keyframes hyperspeed {
    0%, 100% { transform: scale(1) rotate(0deg) translateX(0); }
    10% { transform: scale(1.1) rotate(1deg) translateX(1px); }
    20% { transform: scale(1.05) rotate(-1deg) translateX(-1px); }
    30% { transform: scale(1.1) rotate(1deg) translateX(1px); }
    40% { transform: scale(1.05) rotate(-1deg) translateX(-1px); }
    50% { transform: scale(1.1) rotate(1deg) translateX(-1px); }
    60% { transform: scale(1.05) rotate(-1deg) translateX(1px); }
    70% { transform: scale(1.1) rotate(1deg) translateX(-1px); }
    80% { transform: scale(1.05) rotate(-1deg) translateX(1px); }
    90% { transform: scale(1.1) rotate(1deg) translateX(0); }
}

@keyframes colorPulse {
    0% { background: #ff0000; }
    17% { background: #ff8000; }
    33% { background: #ffff00; }
    50% { background: #00ff00; }
    67% { background: #0000ff; }
    83% { background: #8000ff; }
    100% { background: #ff0000; }
}

@keyframes pixelShuffle {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(2px, -2px); }
    20% { transform: translate(-1px, 3px); }
    30% { transform: translate(3px, 1px); }
    40% { transform: translate(-2px, -3px); }
    50% { transform: translate(1px, 2px); }
    60% { transform: translate(-3px, -1px); }
    70% { transform: translate(2px, 3px); }
    80% { transform: translate(-1px, -2px); }
    90% { transform: translate(3px, -3px); }
}

@keyframes glitchOut {
    0%, 100% { transform: translate(0, 0); filter: hue-rotate(0deg); }
    20% { transform: translate(-5px, 0); filter: hue-rotate(90deg); clip-path: inset(10% 0 20% 0); }
    40% { transform: translate(5px, 0); filter: hue-rotate(180deg); clip-path: inset(30% 0 10% 0); }
    60% { transform: translate(0, 5px); filter: hue-rotate(270deg); clip-path: inset(0 10% 0 30%); }
    80% { transform: translate(0, -5px); filter: hue-rotate(360deg); clip-path: inset(0 30% 0 10%); }
}

@keyframes liquid {
    0%, 100% { border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%; }
    25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50% { border-radius: 20% 40% 50% 60% / 30% 60% 70% 40%; }
    75% { border-radius: 40% 60% 50% 40% / 60% 30% 60% 30%; }
}

@keyframes warpDrive {
    0% { transform: scale(1) rotate(0deg); filter: brightness(1); }
    50% { transform: scale(0.5) rotate(180deg); filter: brightness(1.5) blur(2px); }
    100% { transform: scale(1) rotate(360deg); filter: brightness(1); }
}

@keyframes microBounce {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(-5px); }
    50% { transform: translateY(0); }
    75% { transform: translateY(-3px); }
}

@keyframes shatter {
    0%, 100% { transform: scale(1); }
    10% { transform: scale(1.1); }
    20% { clip-path: polygon(50% 0%, 0% 50%, 50% 100%, 100% 50%); }
    30% { clip-path: polygon(0 0, 33% 33%, 33% 66%, 0 100%, 66% 100%, 100% 66%, 100% 33%, 66% 0); }
    40% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    60% { transform: translateY(-10px); }
    70% { transform: translateY(10px); }
    80% { transform: scale(0.5); }
    90% { transform: scale(0.8); }
}

@keyframes clock {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(90deg); }
    50% { transform: rotate(180deg); }
    75% { transform: rotate(270deg); }
    100% { transform: rotate(360deg); }
}

@keyframes slime {
    0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: scale(1); }
    25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; transform: scale(0.9); }
    50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; transform: scale(1.1); }
    75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; transform: scale(0.9); }
}

@keyframes paperPlane {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(15px, -15px) rotate(15deg); }
    50% { transform: translate(30px, 0) rotate(0deg); }
    75% { transform: translate(15px, 15px) rotate(-15deg); }
}

@keyframes bubblePop {
    0%, 70% { transform: scale(1); opacity: 1; }
    90% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(0.1); opacity: 0; }
}

@keyframes vibrate {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(2px, -2px); }
    60% { transform: translate(-2px, -2px); }
    80% { transform: translate(2px, 2px); }
}

@keyframes firework {
    0% { transform: scale(0.1); opacity: 0; }
    10% { transform: scale(0.2); opacity: 1; }
    70% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.2); opacity: 0; }
}

@keyframes magnet {
    0%, 100% { transform: translateX(0) scale(1); }
    40% { transform: translateX(-20px) scale(0.7); }
    60% { transform: translateX(20px) scale(0.7); }
}

@keyframes pulseRings {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); transform: scale(1); }
    50% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); transform: scale(1.1); }
}

@keyframes drip {
    0%, 100% { transform: scale(1, 1); }
    20% { transform: scale(1, 1.5); }
    40% { transform: scale(1, 0.8); }
    50% { transform: translate(0, 10px) scale(1, 0.8); }
    70% { transform: translate(0, 20px) scale(0.8, 0.8); }
    90% { transform: translate(0, 30px) scale(0.7, 0.7); opacity: 0.5; }
}

@keyframes ricochet {
    0% { transform: translate(0, 0); }
    25% { transform: translate(15px, 15px); }
    30% { transform: translate(15px, 15px) scale(0.9); }
    35% { transform: translate(15px, 15px) scale(1); }
    50% { transform: translate(0, 30px); }
    55% { transform: translate(0, 30px) scale(0.9); }
    60% { transform: translate(0, 30px) scale(1); }
    75% { transform: translate(-15px, 15px); }
    80% { transform: translate(-15px, 15px) scale(0.9); }
    85% { transform: translate(-15px, 15px) scale(1); }
    100% { transform: translate(0, 0); }
}

@keyframes flip3D {
    0% { transform: perspective(400px) rotateY(0); }
    50% { transform: perspective(400px) rotateY(180deg); }
    100% { transform: perspective(400px) rotateY(360deg); }
}

@keyframes thunder {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    5%, 15% { transform: scale(1.1); filter: brightness(2); }
    10%, 20% { transform: scale(1); filter: brightness(1); }
    40%, 45% { transform: scale(1.1); filter: brightness(2); }
    50%, 55% { transform: scale(1); filter: brightness(1); }
}

@keyframes tvStatic {
    0%, 100% { background: black; }
    10% { background: white; }
    20% { background: grey; }
    30% { background: black; }
    40% { background: white; }
    50% { background: grey; }
    60% { background: white; }
    70% { background: black; }
    80% { background: grey; }
    90% { background: white; }
}

@keyframes flipCoin {
    0% { transform: rotateY(0); }
    25% { transform: rotateY(90deg); }
    50% { transform: rotateY(180deg); }
    75% { transform: rotateY(270deg); }
    100% { transform: rotateY(360deg); }
}

@keyframes matrix {
    0%, 100% { transform: translateY(0); opacity: 1; }
    40% { transform: translateY(10px); opacity: 0.8; }
    60% { transform: translateY(20px); opacity: 0.6; }
    80% { transform: translateY(30px); opacity: 0; }
}

@keyframes meteor {
    0% { transform: translate(-20px, -20px) rotate(45deg) scale(0.5); opacity: 0; }
    20% { transform: translate(0, 0) rotate(45deg) scale(1); opacity: 1; }
    80% { transform: translate(20px, 20px) rotate(45deg) scale(1); opacity: 1; }
    100% { transform: translate(40px, 40px) rotate(45deg) scale(0.5); opacity: 0; }
}

@keyframes pendulumWave {
    0%, 100% { transform: rotate(15deg); }
    25% { transform: rotate(-15deg); }
    50% { transform: rotate(10deg); }
    75% { transform: rotate(-10deg); }
}

@keyframes tumbleweed {
    0% { transform: translateX(-20px) rotate(0deg); }
    100% { transform: translateX(20px) rotate(360deg); }
}

@keyframes diagonalShake {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-4px, -4px); }
    75% { transform: translate(4px, 4px); }
}

@keyframes diagonalJitter {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(3px, -3px); }
    66% { transform: translate(-3px, 3px); }
}

@keyframes diagonalPulseShake {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-4px, -4px) scale(1.05); }
    75% { transform: translate(4px, 4px) scale(0.95); }
}

@keyframes diagonalZigzag {
    0%, 100% { transform: translate(0, 0); }
    20% { transform: translate(-3px, -3px); }
    40% { transform: translate(3px, -3px); }
    60% { transform: translate(-3px, 3px); }
    80% { transform: translate(3px, 3px); }
}

@keyframes diagonalWaveShake {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(-4px, -4px) rotate(-2deg); }
    50% { transform: translate(0, 0) rotate(0deg); }
    75% { transform: translate(4px, 4px) rotate(2deg); }
}
