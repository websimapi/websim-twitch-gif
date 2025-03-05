// UI utility functions for accordion behavior
function setupAccordion() {
    const accordionPanels = document.querySelectorAll('.accordion-panel');
    
    // Set the first accordion panel as active by default
    if (accordionPanels.length > 0) {
        accordionPanels[0].classList.add('active');
    }
    
    accordionPanels.forEach(panel => {
        const header = panel.querySelector('.accordion-header');
        
        if (header) {
            header.addEventListener('click', () => {
                panel.classList.toggle('active');
                
                const content = panel.querySelector('.accordion-content');
                if (content) {
                    if (panel.classList.contains('active')) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                }
            });
        }
    });
}

export { setupAccordion };

