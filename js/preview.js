// Preview and animation preview functions
function updateLivePreview() {
    const previewCanvas = document.getElementById('previewAnimation');
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    if (frames.length === 0) return;

    const settings = getImageSettings();
    
    generateAccuratePreview(previewCanvas, settings);
}