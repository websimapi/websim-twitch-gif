// Image editor functionality
import { undoStack, redoStack, brushSize, brushColor, currentTool, selectedArea } from './app.js';
import { drawPreview } from './app.js';
import { updateLivePreview } from './animationUtils.js';

function startImageEditor(image) {
    window.isEditing = true;
    
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
            window.currentTool = option.dataset.tool;
            
            // Hide selection controls if not in selection mode
            if (window.currentTool !== 'select' && window.currentTool !== 'magic-wand') {
                document.getElementById('selectionControls').classList.remove('active');
                window.selectedArea = null;
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
            window.brushColor = option.dataset.color;
            document.getElementById('brushColor').value = window.brushColor;
        });
    });
    
    // Brush color from color picker
    document.getElementById('brushColor').addEventListener('input', function() {
        window.brushColor = this.value;
        // Update selected color in presets
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    });
    
    // Brush size
    document.getElementById('brushSize').addEventListener('input', function() {
        window.brushSize = parseInt(this.value);
        document.getElementById('brushSizeValue').textContent = `${window.brushSize}px`;
    });
    
    // Mouse events for drawing
    overlayCanvas.addEventListener('mousedown', function(e) {
        const rect = overlayCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch(window.currentTool) {
            case 'brush':
            case 'eraser':
                isDrawing = true;
                lastX = x;
                lastY = y;
                break;
                
            case 'select':
                window.isSelecting = true;
                window.selectionStart = { x, y };
                break;
                
            case 'magic-wand':
                magicWandSelect(editorCanvas, overlayCanvas, x, y);
                break;
                
            case 'fill':
                fillArea(editorCanvas, x, y, window.brushColor);
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
            if (window.currentTool === 'brush') {
                draw(editorCtx, lastX, lastY, x, y);
            } else if (window.currentTool === 'eraser') {
                erase(editorCtx, lastX, lastY, x, y);
            }
            
            lastX = x;
            lastY = y;
        } else if (window.isSelecting) {
            // Draw selection rectangle
            overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            window.selectionEnd = { x, y };
            
            overlayCtx.strokeStyle = '#9147ff';
            overlayCtx.lineWidth = 2;
            overlayCtx.setLineDash([5, 5]);
            
            const width = window.selectionEnd.x - window.selectionStart.x;
            const height = window.selectionEnd.y - window.selectionStart.y;
            
            overlayCtx.strokeRect(window.selectionStart.x, window.selectionStart.y, width, height);
        }
    });
    
    overlayCanvas.addEventListener('mouseup', function() {
        if (isDrawing) {
            isDrawing = false;
            saveToUndoStack(editorCanvas);
        } else if (window.isSelecting) {
            window.isSelecting = false;
            
            // Create selection area
            const left = Math.min(window.selectionStart.x, window.selectionEnd.x);
            const top = Math.min(window.selectionStart.y, window.selectionEnd.y);
            const width = Math.abs(window.selectionEnd.x - window.selectionStart.x);
            const height = Math.abs(window.selectionEnd.y - window.selectionStart.y);
            
            // Only create selection if it has size
            if (width > 5 && height > 5) {
                window.selectedArea = { left, top, width, height };
                document.getElementById('selectionControls').classList.add('active');
            } else {
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            }
        }
    });
    
    // Selection controls
    document.getElementById('cropSelection').addEventListener('click', function() {
        if (window.selectedArea) {
            cropSelection(editorCanvas, window.selectedArea);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('fillSelection').addEventListener('click', function() {
        if (window.selectedArea) {
            fillSelection(editorCanvas, window.selectedArea, window.brushColor);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('deleteSelection').addEventListener('click', function() {
        if (window.selectedArea) {
            deleteSelection(editorCanvas, window.selectedArea);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('makeTransparent').addEventListener('click', function() {
        if (window.selectedArea) {
            makeSelectionTransparent(editorCanvas, window.selectedArea);
            clearSelection(overlayCanvas);
            saveToUndoStack(editorCanvas);
        }
    });
    
    document.getElementById('cancelSelection').addEventListener('click', function() {
        clearSelection(overlayCanvas);
    });
    
    // Editor control buttons
    document.getElementById('undoEdit').addEventListener('click', function() {
        if (window.undoStack.length > 1) {
            window.redoStack.push(window.undoStack.pop());
            const prevState = window.undoStack[window.undoStack.length - 1];
            restoreCanvasState(editorCanvas, prevState);
        }
    });
    
    document.getElementById('redoEdit').addEventListener('click', function() {
        if (window.redoStack.length > 0) {
            const nextState = window.redoStack.pop();
            restoreCanvasState(editorCanvas, nextState);
            window.undoStack.push(nextState);
        }
    });
    
    document.getElementById('saveEdit').addEventListener('click', function() {
        finishEditing(editorCanvas);
    });
    
    document.getElementById('cancelEdit').addEventListener('click', function() {
        window.isEditing = false;
        document.getElementById('imageEditorPanel').style.display = 'none';
        window.undoStack = [];
        window.redoStack = [];
    });
}

function draw(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = window.brushColor;
    ctx.lineWidth = window.brushSize;
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
    ctx.lineWidth = window.brushSize;
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
    window.selectedArea = null;
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
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    
    // Get the color at the selected point
    const targetIndex = (y * width + x) * 4;
    const targetColor = {
        r: data[targetIndex],
        g: data[targetIndex + 1],
        b: data[targetIndex + 2],
        a: data[targetIndex + 3]
    };
    
    // Tolerance for color matching
    const tolerance = 30;
    
    // Create a selection mask
    const mask = new Uint8Array(width * height);
    
    // Flood fill algorithm with optimized point stack
    const stack = [{x, y}];
    const visited = new Set(); // Use a Set for faster lookups
    const key = (x, y) => `${x},${y}`;
    
    while (stack.length > 0) {
        const point = stack.pop();
        const px = point.x;
        const py = point.y;
        
        if (px < 0 || py < 0 || px >= width || py >= height) {
            continue;
        }
        
        const pointKey = key(px, py);
        if (visited.has(pointKey)) {
            continue;
        }
        
        visited.add(pointKey);
        
        const index = (py * width + px) * 4;
        const pixelColor = {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
        
        // Check if colors are similar
        if (
            Math.abs(pixelColor.r - targetColor.r) <= tolerance &&
            Math.abs(pixelColor.g - targetColor.g) <= tolerance &&
            Math.abs(pixelColor.b - targetColor.b) <= tolerance &&
            Math.abs(pixelColor.a - targetColor.a) <= tolerance
        ) {
            mask[(py * width + px)] = 1;
            
            // Add neighbors to stack
            stack.push({x: px + 1, y: py});
            stack.push({x: px - 1, y: py});
            stack.push({x: px, y: py + 1});
            stack.push({x: px, y: py - 1});
        }
    }
    
    // Find selection bounds
    const selection = createSelectionPath(mask, width, height);
    
    // Clear overlay and draw selection
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    if (selection) {
        overlayCtx.strokeStyle = '#9147ff';
        overlayCtx.lineWidth = 2;
        overlayCtx.setLineDash([5, 5]);
        overlayCtx.strokeRect(
            selection.left,
            selection.top,
            selection.width,
            selection.height
        );
        
        window.selectedArea = selection;
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
    
    return {
        left: minX,
        top: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    };
}

function fillArea(canvas, x, y, fillColor) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Get the color at the selected point
    const targetIndex = (y * width + x) * 4;
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
    
    // Flood fill algorithm with optimized approach
    const stack = [{x, y}];
    const visited = new Set(); // Use a Set for faster lookups
    const key = (x, y) => `${x},${y}`;
    
    while (stack.length > 0) {
        const point = stack.pop();
        const px = point.x;
        const py = point.y;
        
        if (px < 0 || py < 0 || px >= width || py >= height) {
            continue;
        }
        
        const pointKey = key(px, py);
        if (visited.has(pointKey)) {
            continue;
        }
        
        visited.add(pointKey);
        
        const index = (py * width + px) * 4;
        const pixelColor = {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
        
        // Check if colors are similar
        if (
            Math.abs(pixelColor.r - targetColor.r) <= tolerance &&
            Math.abs(pixelColor.g - targetColor.g) <= tolerance &&
            Math.abs(pixelColor.b - targetColor.b) <= tolerance &&
            Math.abs(pixelColor.a - targetColor.a) <= tolerance
        ) {
            // Set new color
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            
            // Add neighbors to stack
            stack.push({x: px + 1, y: py});
            stack.push({x: px - 1, y: py});
            stack.push({x: px, y: py + 1});
            stack.push({x: px, y: py - 1});
        }
    }
    
    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);
}

function addText(canvas, x, y) {
    const ctx = canvas.getContext('2d');
    const text = prompt('Enter text:', '');
    
    if (!text) return;
    
    ctx.font = `${window.brushSize * 2}px sans-serif`;
    ctx.fillStyle = window.brushColor;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

function saveToUndoStack(canvas) {
    // Save current state to undo stack
    const imageData = canvas.toDataURL();
    window.undoStack.push(imageData);
    // Clear redo stack after a new action
    window.redoStack = [];
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
    window.frames[0] = newFrame;
    
    // Update preview
    drawPreview(newFrame);
    updateLivePreview();
    
    // Hide editor panel
    window.isEditing = false;
    document.getElementById('imageEditorPanel').style.display = 'none';
    window.undoStack = [];
    window.redoStack = [];
}

export { 
    startImageEditor, 
    magicWandSelect, 
    draw, 
    erase, 
    fillArea, 
    addText, 
    saveToUndoStack 
};