// Animation generation code
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