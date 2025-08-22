import Utils from './utils.js';

export class ImageEditor {
    constructor(constants) {
        this.constants = constants;
        this.isEditing = false;
        this.currentTool = 'brush';
        this.selectionStart = { x: 0, y: 0 };
        this.selectionEnd = { x: 0, y: 0 };
        this.isSelecting = false;
        this.selectedArea = null;
        this.brushSize = constants.defaultSettings.brushSize;
        this.brushColor = constants.defaultSettings.brushColor;
        this.undoStack = [];
        this.redoStack = [];
    }

    startEditor(image) {
        this.isEditing = true;
        
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
        this.saveToUndoStack(editorCanvas);
        
        // Set up tool functionality
        this.setupEditorTools(editorCanvas, overlayCanvas);
    }

    setupEditorTools(editorCanvas, overlayCanvas) {
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
                this.currentTool = option.dataset.tool;
                
                // Hide selection controls if not in selection mode
                if (this.currentTool !== 'select' && this.currentTool !== 'magic-wand') {
                    document.getElementById('selectionControls').classList.remove('active');
                    this.selectedArea = null;
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
                this.brushColor = option.dataset.color;
                document.getElementById('brushColor').value = this.brushColor;
            });
        });
        
        // Brush color from color picker
        document.getElementById('brushColor').addEventListener('input', function() {
            this.brushColor = this.value;
            // Update selected color in presets
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        }.bind(this));
        
        // Brush size
        document.getElementById('brushSize').addEventListener('input', function() {
            this.brushSize = parseInt(this.value);
            document.getElementById('brushSizeValue').textContent = `${this.brushSize}px`;
        }.bind(this));
        
        // Mouse events for drawing
        overlayCanvas.addEventListener('mousedown', function(e) {
            const rect = overlayCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            switch(this.currentTool) {
                case 'brush':
                case 'eraser':
                    isDrawing = true;
                    lastX = x;
                    lastY = y;
                    break;
                    
                case 'select':
                    isSelecting = true;
                    this.selectionStart = { x, y };
                    break;
                    
                case 'magic-wand':
                    this.magicWandSelect(editorCanvas, overlayCanvas, x, y);
                    break;
                    
                case 'fill':
                    this.fillArea(editorCanvas, x, y, this.brushColor);
                    this.saveToUndoStack(editorCanvas);
                    break;
                    
                case 'text':
                    this.addText(editorCanvas, x, y);
                    this.saveToUndoStack(editorCanvas);
                    break
            }
        }.bind(this));
        
        overlayCanvas.addEventListener('mousemove', function(e) {
            const rect = overlayCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (isDrawing) {
                if (this.currentTool === 'brush') {
                    this.draw(editorCtx, lastX, lastY, x, y);
                } else if (this.currentTool === 'eraser') {
                    this.erase(editorCtx, lastX, lastY, x, y);
                }
                
                lastX = x;
                lastY = y;
            } else if (isSelecting) {
                // Draw selection rectangle
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                this.selectionEnd = { x, y };
                
                overlayCtx.strokeStyle = '#9147ff';
                overlayCtx.lineWidth = 2;
                overlayCtx.setLineDash([5, 5]);
                
                const width = this.selectionEnd.x - this.selectionStart.x;
                const height = this.selectionEnd.y - this.selectionStart.y;
                
                overlayCtx.strokeRect(this.selectionStart.x, this.selectionStart.y, width, height);
            }
        }.bind(this));
        
        overlayCanvas.addEventListener('mouseup', function() {
            if (isDrawing) {
                isDrawing = false;
                this.saveToUndoStack(editorCanvas);
            } else if (isSelecting) {
                isSelecting = false;
                
                // Create selection area
                const left = Math.min(this.selectionStart.x, this.selectionEnd.x);
                const top = Math.min(this.selectionStart.y, this.selectionEnd.y);
                const width = Math.abs(this.selectionEnd.x - this.selectionStart.x);
                const height = Math.abs(this.selectionEnd.y - this.selectionStart.y);
                
                // Only create selection if it has size
                if (width > 5 && height > 5) {
                    this.selectedArea = { left, top, width, height };
                    document.getElementById('selectionControls').classList.add('active');
                } else {
                    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                }
            }
        }.bind(this));
        
        // Selection controls
        document.getElementById('cropSelection').addEventListener('click', function() {
            if (this.selectedArea) {
                this.cropSelection(editorCanvas, this.selectedArea);
                this.clearSelection(overlayCanvas);
                this.saveToUndoStack(editorCanvas);
            }
        }.bind(this));
        
        document.getElementById('fillSelection').addEventListener('click', function() {
            if (this.selectedArea) {
                this.fillSelection(editorCanvas, this.selectedArea, this.brushColor);
                this.clearSelection(overlayCanvas);
                this.saveToUndoStack(editorCanvas);
            }
        }.bind(this));
        
        document.getElementById('deleteSelection').addEventListener('click', function() {
            if (this.selectedArea) {
                this.deleteSelection(editorCanvas, this.selectedArea);
                this.clearSelection(overlayCanvas);
                this.saveToUndoStack(editorCanvas);
            }
        }.bind(this));
        
        document.getElementById('makeTransparent').addEventListener('click', function() {
            if (this.selectedArea) {
                this.makeSelectionTransparent(editorCanvas, this.selectedArea);
                this.clearSelection(overlayCanvas);
                this.saveToUndoStack(editorCanvas);
            }
        }.bind(this));
        
        document.getElementById('cancelSelection').addEventListener('click', function() {
            this.clearSelection(overlayCanvas);
        }.bind(this));
        
        // Editor control buttons
        document.getElementById('undoEdit').addEventListener('click', function() {
            if (this.undoStack.length > 1) {
                this.redoStack.push(this.undoStack.pop());
                const prevState = this.undoStack[this.undoStack.length - 1];
                this.restoreCanvasState(editorCanvas, prevState);
            }
        }.bind(this));
        
        document.getElementById('redoEdit').addEventListener('click', function() {
            if (this.redoStack.length > 0) {
                const nextState = this.redoStack.pop();
                this.restoreCanvasState(editorCanvas, nextState);
                this.undoStack.push(nextState);
            }
        }.bind(this));
        
        document.getElementById('saveEdit').addEventListener('click', function() {
            this.finishEditing(editorCanvas);
        }.bind(this));
        
        document.getElementById('cancelEdit').addEventListener('click', function() {
            this.isEditing = false;
            document.getElementById('imageEditorPanel').style.display = 'none';
            this.undoStack = [];
            this.redoStack = [];
        }.bind(this));
    }

    draw(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.strokeStyle = this.brushColor;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    erase(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    fillArea(canvas, x, y, fillColor) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Get the color at the selected point
        const targetIndex = (y * canvas.width + x) * 4;
        const targetColor = {
            r: imageData.data[targetIndex],
            g: imageData.data[targetIndex + 1],
            b: imageData.data[targetIndex + 2],
            a: imageData.data[targetIndex + 3]
        };
        
        // Apply flood fill
        Utils.floodFill(imageData, x, y, targetColor, fillColor);
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
    }

    saveToUndoStack(canvas) {
        const imageData = Utils.canvasToDataURL(canvas);
        this.undoStack.push(imageData);
        this.redoStack = [];
    }

    async finishEditing(canvas) {
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const newFrame = await createImageBitmap(blob);
        
        this.isEditing = false;
        document.getElementById('imageEditorPanel').style.display = 'none';
        this.undoStack = [];
        this.redoStack = [];
        
        return newFrame;
    }

    clearSelection(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.selectedArea = null;
        document.getElementById('selectionControls').classList.remove('active');
    }

    cropSelection(canvas, area) {
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

    fillSelection(canvas, area, color) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(area.left, area.top, area.width, area.height);
    }

    deleteSelection(canvas, area) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(area.left, area.top, area.width, area.height);
    }

    makeSelectionTransparent(canvas, area) {
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

    magicWandSelect(sourceCanvas, overlayCanvas, x, y) {
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
        const selection = this.createSelectionPath(mask, sourceCanvas.width, sourceCanvas.height);
        
        // Draw selection outline
        overlayCtx.strokeStyle = '#9147ff';
        overlayCtx.lineWidth = 2;
        overlayCtx.setLineDash([5, 5]);
        
        if (selection) {
            overlayCtx.stroke(selection.path);
            this.selectedArea = selection.bounds;
            document.getElementById('selectionControls').classList.add('active');
        }
    }

    createSelectionPath(mask, width, height) {
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

    addText(canvas, x, y) {
        const ctx = canvas.getContext('2d');
        const text = prompt('Enter text:', '');
        
        if (!text) return;
        
        ctx.font = `${this.brushSize * 2}px sans-serif`;
        ctx.fillStyle = this.brushColor;
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
    }

    restoreCanvasState(canvas, imageData) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageData;
    }

    // ... other existing methods remain the same ...
}

export default ImageEditor;