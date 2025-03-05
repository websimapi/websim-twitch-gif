import { drawPreview, getFrames, setFrames } from './image.js';
import { updateLivePreview } from './animation.js';

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

export function setupEditorControls() {
    // No initialization needed here, as editor is activated on demand
}

export function startImageEditor(image) {
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
    setFrames([newFrame]);
    
    // Update preview
    drawPreview(newFrame);
    updateLivePreview();
    
    // Hide editor panel
    isEditing = false;
    document.getElementById('imageEditorPanel').style.display = 'none';
    undoStack = [];
    redoStack = [];
}