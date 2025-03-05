let frames = [];
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
let gifWorkerBlob;
let selectedAnimation = 'none';
let animationIntensity = 5;
let animationSpeed = 1;
let rainbowEffect = false;
let transitionEffect = false;

// Image editor variables
let isEditing = false;
let currentTool = 'brush';
let selectionStart = { x: 0, y: 0 };
let selectionEnd = { x: 0, y: 0 };
let isSelecting = false;
let selectedArea = null;
let brushSize = 5;
let brushColor = '#ffffff';
let undoStack = [];
let redoStack = [];

// Special effects selection
document.querySelectorAll('.effect-option').forEach(option => {
    option.addEventListener('click', () => {
        const effect = option.dataset.effect;
        
        if (effect === 'rainbow') {
            rainbowEffect = !rainbowEffect;
            option.classList.toggle('selected');
        } else if (effect === 'transition') {
            transitionEffect = !transitionEffect;
            option.classList.toggle('selected');
            
            // Toggle multi-image mode in UI
            document.getElementById('multipleImagesSection').style.display = 
                transitionEffect ? 'block' : 'none';
            document.getElementById('multiImageAISettings').style.display = 
                transitionEffect ? 'block' : 'none';
        }
        
        updateLivePreview();
    });
});

// Animation option selection
document.querySelectorAll('.animation-option').forEach(option => {
    option.addEventListener('click', () => {
        // Remove rainbow-effect since it's now in special effects
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

// Fetch GIF Worker
fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
    .then(response => response.blob())
    .then(blob => {
        gifWorkerBlob = blob;
    });

document.getElementById('fileInput').addEventListener('change', async (e) => {
    if (transitionEffect) {
        // In transition mode, add images to frames array
        for (let file of e.target.files) {
            const frame = await createImageBitmap(file);
            frames.push(frame);
            addImageThumbnail(frame);
        }
        if (frames.length > 0) {
            drawPreview(frames[0]);
            updateLivePreview();
        }
    } else {
        // Regular mode, replace frames
        frames = [];
        for (let file of e.target.files) {
            const frame = await createImageBitmap(file);
            frames.push(frame);
        }
        if (frames.length > 0) {
            drawPreview(frames[0]);
            updateLivePreview();
        }
    }
});

document.getElementById('editImage').addEventListener('click', () => {
    if (frames.length === 0) {
        alert('Please upload an image first!');
        return;
    }
    
    startImageEditor(frames[0]);
});

function startImageEditor(image) {
    isEditing = true;
    
    // Show editor panel, hide other content
    document.getElementById('imageEditorPanel').style.display = 'block';
    
    // Set up editor canvas
    const editorCanvas = document.getElementById('editorCanvas');
    const editorCtx = editorCanvas.getContext('2d');
    
    // Set up overlay canvas (for selections, temporary drawing)
    const overlayCanvas = document.getElementById('overlayCanvas');
    const overlayCtx = overlayCanvas.getContext('2d');
    
    // Clear canvases
    editorCtx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Draw the image centered on canvas
    const scale = Math.min(
        editorCanvas.width / image.width,
        editorCanvas.height / image.height
    ) * 0.9;
    
    const x = (editorCanvas.width - image.width * scale) / 2;
    const y = (editorCanvas.height - image.height * scale) / 2;
    
    editorCtx.drawImage(
        image,
        x, y,
        image.width * scale, image.height * scale
    );
    
    // Save initial state for undo functionality
    saveToUndoStack(editorCanvas);
    
    // Set up tool functionality
    setupEditorTools(editorCanvas, overlayCanvas);
}

function setupEditorTools(editorCanvas, overlayCanvas) {
    const editorCtx = editorCanvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Tool selection
    document.querySelectorAll('.tool-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.tool-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentTool = option.dataset.tool;
            
            // Hide selection controls if not in selection mode
            if (currentTool !== 'select' && currentTool !== 'magic-wand') {
                document.getElementById('selectionControls').classList.remove('active');
                selectedArea = null;
                // Clear overlay
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            }
        });
    });
    
    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            brushColor = option.dataset.color;
            document.getElementById('brushColor').value = brushColor;
        });
    });
    
    // Brush color from color picker
    document.getElementById('brushColor').addEventListener('input', function() {
        brushColor = this.value;
        // Update selected color in presets
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    });
    
    // Brush size
    document.getElementById('brushSize').addEventListener('input', function() {
        brushSize = parseInt(this.value);
        document.getElementById('brushSizeValue').textContent = `${brushSize}px`;
    });
    
    // Mouse events for drawing
    overlayCanvas.addEventListener('mousedown', function(e) {
        const rect = overlayCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch(currentTool) {
            case 'brush':
            case 'eraser':
                isDrawing = true;
                lastX = x;
                lastY = y;
                break;
                
            case 'select':
                isSelecting = true;
                selectionStart = { x, y };
                break;
                
            case 'magic-wand':
                magicWandSelect(editorCanvas, overlayCanvas, x, y);
                break;
                
            case 'fill':
                fillArea(editorCanvas, x, y, brushColor);
                saveToUndoStack(editorCanvas);
                break;
                
            case 'text':
                addText(editorCanvas, x, y);
                saveToUndoStack(editorCanvas);
                break;
        }
    });
    
    overlayCanvas.addEventListener('mousemove', function(e) {
        const rect = overlayCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (isDrawing) {
            if (currentTool === 'brush') {
                draw(editorCtx, lastX, lastY, x, y);
            } else if (currentTool === 'eraser') {
                erase(editorCtx, lastX, lastY, x, y);
            }
            
            lastX = x;
            lastY = y;
        } else if (isSelecting) {
            // Draw selection rectangle
            overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            selectionEnd = { x, y };
            
            overlayCtx.strokeStyle = '#9147ff';
            overlayCtx.lineWidth = 2;
            overlayCtx.setLineDash([5, 5]);
            
            const width = selectionEnd.x - selectionStart.x;
            const height = selectionEnd.y - selectionStart.y;
            
            overlayCtx.strokeRect(selectionStart.x, selectionStart.y, width, height);
        }
    });
    
    overlayCanvas.addEventListener('mouseup', function() {
        if (isDrawing) {
            isDrawing = false;
            saveToUndoStack(editorCanvas);
        } else if (isSelecting) {
            isSelecting = false;
            
            // Create selection area
            const left = Math.min(selectionStart.x, selectionEnd.x);
            const top = Math.min(selectionStart.y, selectionEnd.y);
            const width = Math.abs(selectionEnd.x - selectionStart.x);
            const height = Math.abs(selectionEnd.y - selectionStart.y);
            
            // Only create selection if it has size
            if (width > 5 && height > 5) {
                selectedArea = { left, top, width, height };
                document.getElementById('selectionControls').classList.add('active');
            } else {
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            }
        }
    });
    
    // Selection controls
    document.getElementById('cropSelection').addEventListener('click', function() {
        if (selectedArea) {
            cropSelection(editorCanvas, selectedArea);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('fillSelection').addEventListener('click', function() {
        if (selectedArea) {
            fillSelection(editorCanvas, selectedArea, brushColor);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('deleteSelection').addEventListener('click', function() {
        if (selectedArea) {
            deleteSelection(editorCanvas, selectedArea);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('makeTransparent').addEventListener('click', function() {
        if (selectedArea) {
            makeSelectionTransparent(editorCanvas, selectedArea);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('cancelSelection').addEventListener('click', function() {
        clearSelection(overlayCanvas);
    });
    
    // Editor control buttons
    document.getElementById('undoEdit').addEventListener('click', function() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            const prevState = undoStack[undoStack.length - 1];
            restoreCanvasState(editorCanvas, prevState);
        }
    });
    
    document.getElementById('redoEdit').addEventListener('click', function() {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            restoreCanvasState(editorCanvas, nextState);
            undoStack.push(nextState);
        }
    });
    
    document.getElementById('saveEdit').addEventListener('click', function() {
        finishEditing(editorCanvas);
    });
    
    document.getElementById('cancelEdit').addEventListener('click', function() {
        isEditing = false;
        document.getElementById('imageEditorPanel').style.display = 'none';
        undoStack = [];
        redoStack = [];
    });
}

function draw(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function erase(ctx, x1, y1, x2, y2) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

function clearSelection(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectedArea = null;
    document.getElementById('selectionControls').classList.remove('active');
}

function cropSelection(canvas, area) {
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = area.width;
    tempCanvas.height = area.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Copy selection to temp canvas
    tempCtx.drawImage(
        canvas, 
        area.left, area.top, area.width, area.height,
        0, 0, area.width, area.height
    );
    
    // Clear original canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cropped image centered
    const x = (canvas.width - area.width) / 2;
    const y = (canvas.height - area.height) / 2;
    ctx.drawImage(tempCanvas, x, y);
}

function fillSelection(canvas, area, color) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(area.left, area.top, area.width, area.height);
}

function deleteSelection(canvas, area) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(area.left, area.top, area.width, area.height);
}

function makeSelectionTransparent(canvas, area) {
    const ctx = canvas.getContext('2d');
    
    // Get image data from selection
    const imageData = ctx.getImageData(area.left, area.top, area.width, area.height);
    const data = imageData.data;
    
    // Make all pixels transparent (set alpha to 0)
    for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = 0; // Alpha channel
    }
    
    // Put the modified image data back
    ctx.putImageData(imageData, area.left, area.top);
}

function magicWandSelect(sourceCanvas, overlayCanvas, x, y) {
    const sourceCtx = sourceCanvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    
    // Get image data
    const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const data = imageData.data;
    
    // Get the color at the selected point
    const targetIndex = (y * sourceCanvas.width + x) * 4;
    const targetColor = {
        r: data[targetIndex],
        g: data[targetIndex + 1],
        b: data[targetIndex + 2],
        a: data[targetIndex + 3]
    };
    
    // Tolerance for color matching
    const tolerance = 30;
    
    // Create a selection mask
    const mask = new Uint8Array(sourceCanvas.width * sourceCanvas.height);
    
    // Flood fill algorithm
    const stack = [{x, y}];
    
    while (stack.length > 0) {
        const {x, y} = stack.pop();
        
        if (x < 0 || y < 0 || x >= sourceCanvas.width || y >= sourceCanvas.height)
            continue;
        
        const index = y * sourceCanvas.width + x;
        
        if (mask[index] === 1)
            continue;
        
        const pixelIndex = index * 4;
        const pixelColor = {
            r: data[pixelIndex],
            g: data[pixelIndex + 1],
            b: data[pixelIndex + 2],
            a: data[pixelIndex + 3]
        };
        
        // Check if colors are similar
        if (
            Math.abs(pixelColor.r - targetColor.r) <= tolerance &&
            Math.abs(pixelColor.g - targetColor.g) <= tolerance &&
            Math.abs(pixelColor.b - targetColor.b) <= tolerance &&
            Math.abs(pixelColor.a - targetColor.a) <= tolerance
        ) {
            mask[index] = 1;
            
            stack.push({x: x + 1, y});
            stack.push({x: x - 1, y});
            stack.push({x, y: y + 1});
            stack.push({x, y: y - 1});
        }
    }
    
    // Clear overlay and draw selection
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Create a selection path
    const selection = createSelectionPath(mask, sourceCanvas.width, sourceCanvas.height);
    
    // Draw selection outline
    overlayCtx.strokeStyle = '#9147ff';
    overlayCtx.lineWidth = 2;
    overlayCtx.setLineDash([5, 5]);
    
    if (selection) {
        overlayCtx.stroke(selection.path);
        selectedArea = selection.bounds;
        document.getElementById('selectionControls').classList.add('active');
    }
}

function createSelectionPath(mask, width, height) {
    // Find bounds of selection
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let hasSelection = false;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            if (mask[index] === 1) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
                hasSelection = true;
            }
        }
    }
    
    if (!hasSelection) return null;
    
    // Create a simplified path around the selection
    const path = new Path2D();
    const bounds = {
        left: minX,
        top: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    };
    
    path.rect(minX, minY, bounds.width, bounds.height);
    
    return { path, bounds };
}

function fillArea(canvas, x, y, fillColor) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Get the color at the selected point
    const targetIndex = (y * canvas.width + x) * 4;
    const targetColor = {
        r: data[targetIndex],
        g: data[targetIndex + 1],
        b: data[targetIndex + 2],
        a: data[targetIndex + 3]
    };
    
    // Tolerance for color matching
    const tolerance = 30;
    
    // Convert fill color hex to rgba
    const r = parseInt(fillColor.slice(1, 3), 16);
    const g = parseInt(fillColor.slice(3, 5), 16);
    const b = parseInt(fillColor.slice(5, 7), 16);
    
    // Flood fill algorithm
    const stack = [{x, y}];
    const visited = new Uint8Array(canvas.width * canvas.height);
    
    while (stack.length > 0) {
        const {x, y} = stack.pop();
        
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height)
            continue;
        
        const index = y * canvas.width + x;
        
        if (visited[index] === 1)
            continue;
        
        const pixelIndex = index * 4;
        const pixelColor = {
            r: data[pixelIndex],
            g: data[pixelIndex + 1],
            b: data[pixelIndex + 2],
            a: data[pixelIndex + 3]
        };
        
        // Check if colors are similar
        if (
            Math.abs(pixelColor.r - targetColor.r) <= tolerance &&
            Math.abs(pixelColor.g - targetColor.g) <= tolerance &&
            Math.abs(pixelColor.b - targetColor.b) <= tolerance &&
            Math.abs(pixelColor.a - targetColor.a) <= tolerance
        ) {
            visited[index] = 1;
            
            // Set new color
            data[pixelIndex] = r;
            data[pixelIndex + 1] = g;
            data[pixelIndex + 2] = b;
            
            stack.push({x: x + 1, y});
            stack.push({x: x - 1, y});
            stack.push({x, y: y + 1});
            stack.push({x, y: y - 1});
        }
    }
    
    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);
}

function addText(canvas, x, y) {
    const ctx = canvas.getContext('2d');
    const text = prompt('Enter text:', '');
    
    if (!text) return;
    
    ctx.font = `${brushSize * 2}px sans-serif`;
    ctx.fillStyle = brushColor;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

function saveToUndoStack(canvas) {
    // Save current state to undo stack
    const imageData = canvas.toDataURL();
    undoStack.push(imageData);
    // Clear redo stack after a new action
    redoStack = [];
}

function restoreCanvasState(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
}

async function finishEditing(canvas) {
    // Convert canvas to image bitmap
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    const newFrame = await createImageBitmap(blob);
    
    // Replace the current frame
    frames[0] = newFrame;
    
    // Update preview
    drawPreview(newFrame);
    updateLivePreview();
    
    // Hide editor panel
    isEditing = false;
    document.getElementById('imageEditorPanel').style.display = 'none';
    undoStack = [];
    redoStack = [];
}

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

function getImageSettings() {
    return {
        backgroundColor: document.getElementById('enableBackground').checked ? document.getElementById('backgroundColor').value : null,
        opacity: parseInt(document.getElementById('opacity').value),
        scale: parseInt(document.getElementById('scale').value)
    };
}

document.getElementById('enableBackground').addEventListener('change', function() {
    document.getElementById('backgroundColor').disabled = !this.checked;
    updateLivePreview();
});

document.getElementById('backgroundColor').addEventListener('input', function() {
    document.getElementById('backgroundColorValue').textContent = this.value;
    updateLivePreview();
});

document.querySelectorAll('.image-settings input, .image-settings select').forEach(input => {
    input.addEventListener('input', updateLivePreview);
});

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

function updateLivePreview() {
    const previewCanvas = document.getElementById('previewAnimation');
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    if (frames.length === 0) return;

    const settings = getImageSettings();
    
    // Reset any previous animations
    previewCanvas.style.animation = 'none';
    previewCanvas.style.transform = 'none';
    previewCanvas.style.filter = 'none';
    
    if (settings.backgroundColor) {
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    }
    
    const scale = settings.scale / 100;
    const scaledWidth = previewCanvas.width * scale;
    const scaledHeight = previewCanvas.height * scale;
    const x = (previewCanvas.width - scaledWidth) / 2;
    const y = (previewCanvas.height - scaledHeight) / 2;
    
    const effectiveWidth = scaledWidth;
    const effectiveHeight = scaledHeight;
    
    // In transition mode with multiple frames, only show the first frame in preview
    const currentFrame = frames[0];
    ctx.save();
    
    ctx.globalAlpha = settings.opacity / 100;
    
    // Draw the image without applying transformations yet
    ctx.drawImage(
        currentFrame,
        x, y,
        effectiveWidth,
        effectiveHeight
    );

    // Restore the original context state
    ctx.restore();
    
    // Apply animation to the canvas through CSS
    if (selectedAnimation !== 'none') {
        const animationCSS = generateAnimationCSS(selectedAnimation);
        previewCanvas.style.animation = animationCSS;
        previewCanvas.style.transformOrigin = 'center center';
    }
    
    // Apply special effects if enabled
    let filters = [];
    
    // Apply rainbow effect if enabled (separate from animation)
    if (rainbowEffect) {
        if (previewCanvas.style.animation) {
            previewCanvas.style.animation = `${previewCanvas.style.animation}, rainbow ${(1 / animationSpeed).toFixed(1)}s linear infinite`;
        } else {
            previewCanvas.style.animation = `rainbow ${(1 / animationSpeed).toFixed(1)}s linear infinite`;
        }
        filters.push('hue-rotate(0deg)');
    }
    
    // Apply filters
    if (filters.length > 0) {
        previewCanvas.style.filter = filters.join(' ');
    }
}

function addImageThumbnail(frame) {
    const thumbnailsContainer = document.getElementById('uploadedImages');
    
    const thumbnail = document.createElement('div');
    thumbnail.className = 'image-thumbnail';
    
    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(frame, 0, 0, 60, 60);
    
    thumbnail.appendChild(canvas);
    
    const removeBtn = document.createElement('div');
    removeBtn.className = 'remove-image';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = Array.from(thumbnailsContainer.children).indexOf(thumbnail);
        if (index !== -1) {
            frames.splice(index, 1);
            thumbnailsContainer.removeChild(thumbnail);
            if (frames.length > 0) {
                drawPreview(frames[0]);
                updateLivePreview();
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    });
    
    thumbnail.appendChild(removeBtn);
    thumbnailsContainer.appendChild(thumbnail);
}

document.getElementById('clearCanvas').addEventListener('click', () => {
    frames = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('fileInput').value = '';
    selectedAnimation = 'none';
    document.querySelectorAll('.animation-option').forEach(opt => {
        if (opt.dataset.animation !== 'rainbow-effect') {
            opt.classList.remove('selected');
        }
    });
    document.querySelector('[data-animation="none"]').classList.add('selected');
    
    const previewCanvas = document.getElementById('previewAnimation');
    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCanvas.style.animation = 'none';
    
    // Clear thumbnails
    document.getElementById('uploadedImages').innerHTML = '';
});

// Add clear all images button functionality
document.getElementById('clearAllImages').addEventListener('click', () => {
    frames = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('uploadedImages').innerHTML = '';
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
    
    let totalFrames;
    if (transitionEffect && frames.length > 1) {
        // In transition mode, calculate frames based on each image getting equal time
        const transitionDuration = parseInt(document.getElementById('transitionDuration').value);
        const framesPerImage = Math.round((transitionDuration / 1000) * fps);
        totalFrames = framesPerImage * frames.length;
    } else {
        // Normal mode
        totalFrames = fps * duration;
    }
    
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
        
        // Determine which image to show in transition mode
        let currentFrameIndex = 0;
        let nextFrameIndex = 0;
        let transitionProgress = 0;
        
        if (transitionEffect && frames.length > 1) {
            const transitionType = document.getElementById('transitionType').value;
            const framesPerImage = totalFrames / frames.length;
            currentFrameIndex = Math.floor((frameNum / totalFrames) * frames.length);
            nextFrameIndex = (currentFrameIndex + 1) % frames.length;
            transitionProgress = (frameNum % framesPerImage) / framesPerImage;
            
            // Draw transition between current and next frame
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
            
            tempCtx.save();
            tempCtx.globalAlpha = settings.opacity / 100;
            
            // Apply transition effect
            switch(transitionType) {
                case 'fade':
                    // Draw first image fading out
                    tempCtx.globalAlpha = settings.opacity / 100 * (1 - transitionProgress);
                    tempCtx.drawImage(frames[currentFrameIndex], x, y, scaledWidth, scaledHeight);
                    
                    // Draw second image fading in
                    tempCtx.globalAlpha = settings.opacity / 100 * transitionProgress;
                    tempCtx.drawImage(frames[nextFrameIndex], x, y, scaledWidth, scaledHeight);
                    break;
                    
                case 'slide':
                    // Draw first image sliding out
                    tempCtx.drawImage(
                        frames[currentFrameIndex], 
                        x - tempCanvas.width * transitionProgress, 
                        y, 
                        scaledWidth, 
                        scaledHeight
                    );
                    
                    // Draw second image sliding in
                    tempCtx.drawImage(
                        frames[nextFrameIndex], 
                        x + tempCanvas.width * (1 - transitionProgress), 
                        y, 
                        scaledWidth, 
                        scaledHeight
                    );
                    break;
                    
                case 'zoom':
                    // Draw first image zooming out
                    const scale1 = 1 - transitionProgress * 0.5;
                    tempCtx.globalAlpha = settings.opacity / 100 * (1 - transitionProgress);
                    tempCtx.drawImage(
                        frames[currentFrameIndex], 
                        x + scaledWidth * (1 - scale1) / 2, 
                        y + scaledHeight * (1 - scale1) / 2, 
                        scaledWidth * scale1, 
                        scaledHeight * scale1
                    );
                    
                    // Draw second image zooming in
                    const scale2 = 0.5 + transitionProgress * 0.5;
                    tempCtx.globalAlpha = settings.opacity / 100 * transitionProgress;
                    tempCtx.drawImage(
                        frames[nextFrameIndex], 
                        x + scaledWidth * (1 - scale2) / 2, 
                        y + scaledHeight * (1 - scale2) / 2, 
                        scaledWidth * scale2, 
                        scaledHeight * scale2
                    );
                    break;
                    
                case 'flip':
                    // Simulate 3D flip transition
                    if (transitionProgress < 0.5) {
                        // First half of transition - first image
                        const scaleX = 1 - transitionProgress * 2;
                        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
                        tempCtx.scale(scaleX, 1);
                        tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
                        tempCtx.drawImage(frames[currentFrameIndex], x, y, scaledWidth, scaledHeight);
                    } else {
                        // Second half of transition - second image
                        const scaleX = (transitionProgress - 0.5) * 2;
                        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
                        tempCtx.scale(scaleX, 1);
                        tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
                        tempCtx.drawImage(frames[nextFrameIndex], x, y, scaledWidth, scaledHeight);
                    }
                    break;
            }
            
            tempCtx.restore();
        } else {
            // Original single-image animation code
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // ... existing animation code for single frame ...
        }

        gif.addFrame(tempCanvas, {
            delay: 1000 / (fps * animationSpeed),
            copy: true
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

document.getElementById('generateImage').addEventListener('click', async () => {
    const prompt = document.getElementById('imagePrompt').value.trim();
    const aspectRatio = document.getElementById('aspectRatio').value;
    const advancedMode = document.getElementById('advancedMode').checked;
    const statusElement = document.getElementById('generationStatus');
    const generateMultiple = transitionEffect && document.getElementById('generateMultipleAI').checked;
    const multipleCount = generateMultiple ? parseInt(document.getElementById('aiImageCount').value) : 1;
    
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
        
        // Generate the image(s)
        for (let i = 0; i < multipleCount; i++) {
            if (multipleCount > 1) {
                statusElement.innerHTML = `<div class="loading-spinner"></div> Generating image ${i+1} of ${multipleCount}...`;
            }
            
            // Generate the image
            const result = await websim.imageGen({
                prompt: finalPrompt,
                aspect_ratio: aspectRatio,
                // Add a small random seed variation for multiple images
                seed: generateMultiple ? Math.floor(Math.random() * 1000) : undefined
            });
            
            // Create a new image from the generated URL
            const img = new Image();
            img.onload = async function() {
                const frame = await createImageBitmap(img);
                
                if (transitionEffect || frames.length === 0) {
                    // In transition effect mode or first image, add to frames
                    frames.push(frame);
                    addImageThumbnail(frame);
                } else {
                    // In regular mode, replace existing frame
                    frames = [frame];
                }
                
                drawPreview(frame);
                updateLivePreview();
                
                if (i === multipleCount - 1) {
                    statusElement.textContent = multipleCount > 1 ? 
                        `Generated ${multipleCount} images successfully!` : 
                        'Image generated successfully!';
                }
            };
            img.onerror = function() {
                statusElement.textContent = 'Error loading the generated image.';
            };
            img.src = result.url;
            
            // Add slight delay between generations to avoid rate limits
            if (i < multipleCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    } catch (error) {
        console.error('Error generating image:', error);
        statusElement.textContent = `Error: ${error.message || 'Failed to generate image'}`;
    }
});

// Toggle multi-image AI settings when transition effect is enabled/disabled
document.querySelectorAll('.effect-option').forEach(option => {
    option.addEventListener('click', () => {
        const effect = option.dataset.effect;
        
        if (effect === 'rainbow') {
            rainbowEffect = !rainbowEffect;
            option.classList.toggle('selected');
        } else if (effect === 'transition') {
            transitionEffect = !transitionEffect;
            option.classList.toggle('selected');
            
            // Toggle multi-image mode in UI
            document.getElementById('multipleImagesSection').style.display = 
                transitionEffect ? 'block' : 'none';
            document.getElementById('multiImageAISettings').style.display = 
                transitionEffect ? 'block' : 'none';
        }
        
        updateLivePreview();
    });
});

// Update AI image count display
document.getElementById('aiImageCount').addEventListener('input', function() {
    document.getElementById('aiImageCountValue').textContent = this.value;
});

// Update transition duration display
document.getElementById('transitionDuration').addEventListener('input', function() {
    document.getElementById('transitionDurationValue').textContent = `${this.value}ms`;
});