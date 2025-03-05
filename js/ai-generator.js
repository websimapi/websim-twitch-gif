// AI image generation functionality
document.getElementById('generateImage').addEventListener('click', async () => {
    const prompt = document.getElementById('imagePrompt').value.trim();
    const aspectRatio = document.getElementById('aspectRatio').value;
    const advancedMode = document.getElementById('advancedMode').checked;
    const statusElement = document.getElementById('generationStatus');
    
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
        
        // Generate the image
        const result = await websim.imageGen({
            prompt: finalPrompt,
            aspect_ratio: aspectRatio
        });
        
        // Create a new image from the generated URL
        const img = new Image();
        img.onload = async function() {
            const frame = await createImageBitmap(img);
            frames = [frame]; // Replace existing frames with this new one
            drawPreview(frame);
            updateLivePreview();
            statusElement.textContent = 'Image generated successfully!';
        };
        img.onerror = function() {
            statusElement.textContent = 'Error loading the generated image.';
        };
        img.src = result.url;
        
    } catch (error) {
        console.error('Error generating image:', error);
        statusElement.textContent = `Error: ${error.message || 'Failed to generate image'}`;
    }
});