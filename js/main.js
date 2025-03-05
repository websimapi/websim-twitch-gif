import { setupAnimationControls } from './animation.js';
import { setupImageControls } from './image.js';
import { setupEditorControls } from './editor.js';
import { setupGifGeneration } from './gif.js';
import { setupAIGeneration } from './ai.js';

// Initialize modules
document.addEventListener('DOMContentLoaded', () => {
    setupAnimationControls();
    setupImageControls();
    setupEditorControls();
    setupGifGeneration();
    setupAIGeneration();
});