// Animation categories for organization
const animationCategories = {
    'none': 'basic',
    'rotate': 'rotate',
    'bounce': 'bounce',
    'fade': 'basic',
    'shake': 'shake',
    'pulse': 'basic',
    'flip': 'rotate',
    'swing': 'rotate',
    'zoom': 'zoom',
    'spin': 'rotate',
    'wiggle': 'shake',
    'squeeze': 'basic',
    'slide': 'basic',
    'glitch': 'special',
    'bounce-around': 'bounce',
    'float': 'basic',
    'spiral': 'rotate',
    'throb': 'zoom',
    'heartbeat': 'special',
    'jello': 'special',
    'pendulum': 'rotate',
    'blink': 'basic',
    'tornado': 'special',
    'orbit': 'rotate',
    'diagonal-bounce': 'diagonal',
    'pixelate': 'special',
    'sway': 'basic',
    'ripple': 'special',
    'split-shift': 'special',
    'confetti': 'special',
    'wave': 'basic',
    'jump-rope': 'bounce',
    'typewriter': 'special',
    'bounce-flip': 'bounce',
    'dizzy': 'rotate',
    'dance': 'special',
    'elastic': 'special',
    'shadow-play': 'special',
    'bounce-rotate': 'bounce',
    'party-mode': 'special',
    'rolling': 'rotate',
    'kaleidoscope': 'special',
    'wobble': 'shake',
    'teleport': 'special',
    'pinwheel': 'rotate',
    'bounce-orbit': 'bounce',
    'hyperspeed': 'special',
    'color-pulse': 'special',
    'pixel-shuffle': 'special',
    'glitch-out': 'special',
    'liquid': 'special',
    'warp-drive': 'special',
    'neon-flash': 'special',
    'spin-zoom': 'zoom',
    'bounce-wave': 'bounce',
    'micro-bounce': 'subtle',
    'shatter': 'special',
    'clock': 'rotate',
    'slime': 'special',
    'paper-plane': 'special',
    'bubble-pop': 'special',
    'vibrate': 'shake',
    'firework': 'special',
    'magnet': 'special',
    'pulse-rings': 'special',
    'drip': 'special',
    'ricochet': 'special',
    'flip-3d': 'special',
    'thunder': 'special',
    'tv-static': 'special',
    'flip-coin': 'rotate',
    'matrix': 'special',
    'meteor': 'special',
    'pendulum-wave': 'special',
    'tumbleweed': 'special',
    'gentle-shake': 'subtle',
    'tiny-jump': 'subtle',
    'subtle-pulse': 'subtle',
    'soft-wobble': 'subtle',
    'micro-spin': 'subtle',
    'mini-orbit': 'subtle',
    'light-flicker': 'subtle',
    'smooth-slide': 'subtle',
    'tiny-twist': 'subtle',
    'quick-pulse': 'subtle',
    'mini-rotate': 'subtle',
    'soft-breathe': 'subtle',
    'nano-bounce': 'subtle',
    'subtle-wave': 'subtle',
    'gentle-rock': 'subtle',
    'tiny-bounce': 'subtle',
    'micro-waggle': 'subtle',
    'soft-vibrate': 'subtle',
    'micro-float': 'subtle',
    'subtle-throb': 'subtle',
    'diagonal-shake': 'diagonal',
    'diagonal-jitter': 'diagonal',
    'diagonal-pulse-shake': 'diagonal',
    'diagonal-zigzag': 'diagonal',
    'diagonal-wave-shake': 'diagonal'
};

// Initialize user favorites
let userFavorites = JSON.parse(localStorage.getItem('animationFavorites')) || [];

// Initialize selected animation
let selectedAnimation = 'bounce';

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and its content
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Generate animation options with categories and favorites
function populateAnimationOptions() {
    const container = document.querySelector('.animation-options');
    container.innerHTML = ''; // Clear container
    
    // Current filter state
    const searchQuery = document.getElementById('animationSearch').value.toLowerCase();
    const currentCategory = document.getElementById('animationCategory').value;
    const showingFavorites = document.getElementById('viewFavorites').classList.contains('active');
    
    // Loop through all animation categories to create options
    for (const [animationName, category] of Object.entries(animationCategories)) {
        const displayName = animationName.replace(/-/g, ' ');
        const isFavorite = userFavorites.includes(animationName);
        
        // Apply filters
        if (
            (showingFavorites && !isFavorite) ||
            (currentCategory !== 'all' && category !== currentCategory) ||
            (searchQuery && !displayName.toLowerCase().includes(searchQuery))
        ) {
            continue; // Skip this animation if it doesn't match filters
        }
        
        // Create new animation option element
        const newOption = document.createElement('div');
        newOption.className = 'animation-option';
        newOption.dataset.animation = animationName;
        
        // Create category tag
        const categoryTag = document.createElement('div');
        categoryTag.className = 'category-tag';
        categoryTag.textContent = category;
        
        // Create favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `favorite-btn${isFavorite ? ' active' : ''}`;
        favoriteBtn.innerHTML = '<i class="icon-star"></i>';
        favoriteBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
        favoriteBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent selecting the animation
            toggleFavorite(animationName);
        };
        
        // Create preview
        const preview = document.createElement('div');
        preview.className = `animation-preview ${animationName}-preview`;
        preview.innerHTML = '<div></div>';
        
        // Create name
        const nameSpan = document.createElement('div');
        nameSpan.className = 'animation-name';
        nameSpan.textContent = displayName;
        
        // Assemble option
        newOption.appendChild(categoryTag);
        newOption.appendChild(favoriteBtn);
        newOption.appendChild(preview);
        newOption.appendChild(nameSpan);
        
        // Add event listener
        newOption.addEventListener('click', () => {
            document.querySelectorAll('.animation-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            newOption.classList.add('selected');
            selectedAnimation = animationName;
            updateLivePreview();
        });
        
        container.appendChild(newOption);
    }
}

// Toggle favorite status for an animation
function toggleFavorite(animationName) {
    const index = userFavorites.indexOf(animationName);
    if (index === -1) {
        userFavorites.push(animationName);
    } else {
        userFavorites.splice(index, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('animationFavorites', JSON.stringify(userFavorites));
    
    // Update UI
    populateAnimationOptions();
}

// Define updateLivePreview globally so it can be called from anywhere
function updateLivePreview() {
    const previewCanvas = document.getElementById('preview');
    const animationCanvas = document.getElementById('previewAnimation');
    const ctx = animationCanvas.getContext('2d');
    
    // Clear animation canvas
    ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
    
    // Copy the original image
    ctx.drawImage(previewCanvas, 0, 0);
    
    // Apply the selected animation class
    const livePreview = document.getElementById('livePreview');
    
    // Remove all existing animation classes
    const animationClasses = Object.keys(animationCategories).map(name => `${name}-preview`);
    livePreview.classList.remove(...animationClasses);
    
    // Add the selected animation class
    if (selectedAnimation && selectedAnimation !== 'none') {
        livePreview.classList.add(`${selectedAnimation}-preview`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Call populateAnimationOptions to populate animation list
    populateAnimationOptions();
    
    // Set up filter and search listeners
    document.getElementById('animationSearch').addEventListener('input', populateAnimationOptions);
    document.getElementById('animationCategory').addEventListener('change', populateAnimationOptions);
    
    document.getElementById('viewFavorites').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('viewAll').classList.remove('active');
        populateAnimationOptions();
    });
    
    document.getElementById('viewAll').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('viewFavorites').classList.remove('active');
        populateAnimationOptions();
    });
    
    // Set up drag and drop for file upload
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileUpload);
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFileUpload({ target: { files: e.dataTransfer.files } });
        }
    });
    
    // Function to handle file upload
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(loadEvent) {
            const img = new Image();
            img.onload = function() {
                // Draw the image on the preview canvas
                const canvas = document.getElementById('preview');
                const ctx = canvas.getContext('2d');
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Calculate how to center and scale the image to fit in the 112x112 canvas
                let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                let x = (canvas.width - img.width * scale) / 2;
                let y = (canvas.height - img.height * scale) / 2;
                
                // Draw the image
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                
                // Update the animation preview
                updateLivePreview();
            };
            img.src = loadEvent.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // Initial preview update
    updateLivePreview();
    
    // Select the default animation
    const defaultAnimOption = document.querySelector(`.animation-option[data-animation="${selectedAnimation}"]`);
    if (defaultAnimOption) {
        defaultAnimOption.classList.add('selected');
    }
    
    // Show values for range inputs
    document.getElementById('opacity').addEventListener('input', function() {
        document.getElementById('opacityValue').textContent = `${this.value}%`;
        updateLivePreview();
    });
    
    document.getElementById('scale').addEventListener('input', function() {
        document.getElementById('scaleValue').textContent = `${this.value}%`;
        updateLivePreview();
    });
    
    // Setup AI panel toggle
    document.getElementById('showAiPanel').addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector('.tab-btn[data-tab="ai-tab"]').classList.add('active');
        document.getElementById('ai-tab').classList.add('active');
    });
    
    // Setup Font Awesome CDN
    const faScript = document.createElement('script');
    faScript.src = 'https://kit.fontawesome.com/a076d05399.js';
    faScript.crossOrigin = 'anonymous';
    document.head.appendChild(faScript);
    
    // Setup Inter font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(fontLink);
    
    // Set up tooltips
    document.addEventListener('mouseover', (e) => {
        if (e.target.hasAttribute('title')) {
            const title = e.target.getAttribute('title');
            e.target.removeAttribute('title');
            
            const tooltip = document.getElementById('tooltip');
            tooltip.textContent = title;
            tooltip.style.display = 'block';
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            
            e.target.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
                e.target.setAttribute('title', title);
            }, {once: true});
        }
    });
});