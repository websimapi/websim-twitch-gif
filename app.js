// ... existing code ...

function applyFlipCoinAnimation(frame, tempCanvas, tempCtx, x, y, effectiveWidth, effectiveHeight, progress, intensityFactor) {
    const flipCoinProgress = progress * 4 % 4;
    let flipCoinY = 0, flipCoinRotationY = 0;
    
    // Create a temporary canvas for 3D coin effect
    const coinCanvas = document.createElement('canvas');
    coinCanvas.width = tempCanvas.width;
    coinCanvas.height = tempCanvas.height;
    const coinCtx = coinCanvas.getContext('2d');
    
    // Step 1: Draw the current frame (texture) to the temp canvas
    coinCtx.drawImage(frame, 0, 0, effectiveWidth, effectiveHeight);
    
    // Step 2: Apply 3D transformations
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
    
    // Apply shadow based on position in flip
    const shadowBlur = 15 * Math.abs(Math.sin(flipCoinRotationY * Math.PI / 180));
    const shadowOffsetY = 5 * Math.abs(Math.sin(flipCoinRotationY * Math.PI / 180));
    
    tempCtx.save();
    
    // Center point for transformations
    const centerX = x + (effectiveWidth / 2);
    const centerY = y + (effectiveHeight / 2);
    
    // Draw shadow first (when coin is visible from front/back)
    if (Math.abs(Math.sin(flipCoinRotationY * Math.PI / 180)) < 0.7) {
        tempCtx.shadowColor = 'rgba(0,0,0,0.5)';
        tempCtx.shadowBlur = shadowBlur;
        tempCtx.shadowOffsetY = shadowOffsetY;
    }
    
    // Apply 3D-like transformations
    tempCtx.translate(centerX, centerY + flipCoinY);
    
    // Simulate 3D rotation by scaling
    const flipCoinScaleX = Math.abs(Math.cos(flipCoinRotationY * Math.PI / 180));
    tempCtx.scale(flipCoinScaleX, 1);
    
    // Apply circular mask for coin shape
    tempCtx.beginPath();
    tempCtx.arc(0, 0, effectiveWidth * 0.45, 0, Math.PI * 2);
    tempCtx.closePath();
    tempCtx.clip();
    
    // Apply golden gradient when edge is showing (simulating coin edge)
    if (flipCoinScaleX < 0.3) {
        // Draw edge of coin
        const gradient = tempCtx.createLinearGradient(-5, -effectiveHeight/2, 5, effectiveHeight/2);
        gradient.addColorStop(0, '#b8860b');
        gradient.addColorStop(0.5, '#ffd700');
        gradient.addColorStop(1, '#b8860b');
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(-5, -effectiveHeight/2, 10, effectiveHeight);
    } else {
        // Front or back of coin - alternate between original texture and a golden back
        if (Math.cos(flipCoinRotationY * Math.PI / 180) > 0) {
            // Front face - draw the original image
            tempCtx.drawImage(
                coinCanvas, 
                0, 0, coinCanvas.width, coinCanvas.height,
                -effectiveWidth/2, -effectiveHeight/2, effectiveWidth, effectiveHeight
            );
            
            // Add golden border/rim
            tempCtx.strokeStyle = '#b8860b';
            tempCtx.lineWidth = 3;
            tempCtx.stroke();
        } else {
            // Back face - show coin back design
            const backGradient = tempCtx.createRadialGradient(0, 0, effectiveWidth * 0.1, 0, 0, effectiveWidth * 0.45);
            backGradient.addColorStop(0, '#ffd700');
            backGradient.addColorStop(1, '#b8860b');
            tempCtx.fillStyle = backGradient;
            tempCtx.fill();
            
            // Add embossed effect on back
            tempCtx.strokeStyle = 'rgba(255,255,255,0.3)';
            tempCtx.lineWidth = 2;
            tempCtx.stroke();
            tempCtx.beginPath();
            tempCtx.arc(0, 0, effectiveWidth * 0.3, 0, Math.PI * 2);
            tempCtx.stroke();
        }
    }
    
    // Add highlight/shine effect
    const shineAngle = (flipCoinRotationY + 30) * Math.PI / 180;
    const shineX = Math.cos(shineAngle) * (effectiveWidth * 0.3);
    const shineY = Math.sin(shineAngle) * (effectiveWidth * 0.3);
    const shine = tempCtx.createRadialGradient(
        shineX, shineY, 1,
        shineX, shineY, effectiveWidth * 0.4
    );
    shine.addColorStop(0, 'rgba(255,255,255,0.8)');
    shine.addColorStop(0.5, 'rgba(255,255,255,0)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    tempCtx.fillStyle = shine;
    tempCtx.globalCompositeOperation = 'overlay';
    tempCtx.fill();
    
    tempCtx.restore();
}

switch(animationStyle) {
    // ... existing cases ...
    
    case 'flip-coin':
        applyFlipCoinAnimation(frame, tempCanvas, tempCtx, x, y, effectiveWidth, effectiveHeight, progress, intensityFactor);
        break;
        
    // ... other cases ...
}