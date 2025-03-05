import { setupEventListeners } from './eventListeners.js';
import { initializeApp } from './app.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});