import Utils from './utils.js';
import AnimationEngine from './animationEngine.js';

export class GifGenerator {
    constructor(constants, animationEngine) {
        this.constants = constants;
        this.animationEngine = animationEngine;
        this.gifWorkerBlob = null;
        this.previewGif = null;
        this.initGifWorker();
    }

    async initGifWorker() {
        try {
            const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js');
            this.gifWorkerBlob = await response.blob();
        } catch (error) {
            console.error('Failed to load GIF worker:', error);
        }
    }

    async generatePreview(frames, settings, selectedAnimation, animationSpeed, animationIntensity, rainbowEffect) {
        if (!this.gifWorkerBlob) {
            await Utils.waitFor(() => this.gifWorkerBlob);
        }

        // Clean up any previous preview
        if (this.previewGif) {
            URL.revokeObjectURL(this.previewGif);
            this.previewGif = null;
        }

        // Set up temporary canvas for rendering frames
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 112;
        tempCanvas.height = 112;
        const tempCtx = tempCanvas.getContext('2d');

        // Create a GIF instance for preview
        const gif = new GIF({
            workers: 1,
            quality: 5, // Lower quality for preview
            width: 112,
            height: 112,
            workerScript: URL.createObjectURL(this.gifWorkerBlob),
            transparent: settings.backgroundColor ? null : 0x00000000
        });

        // Generate a few frames for preview
        const fps = 10; // Lower fps for preview
        const previewDuration = 1; // 1 second preview
        const totalFrames = fps * previewDuration;

        for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
            const progress = frameNum / totalFrames;
            
            frames.forEach((frame) => {
                this.renderFrame(tempCtx, frame, settings, selectedAnimation, progress, animationIntensity, rainbowEffect);
                
                gif.addFrame(tempCanvas, {
                    delay: 1000 / (fps * animationSpeed),
                    copy: true
                });
            });
        }

        return new Promise((resolve) => {
            gif.on('finished', blob => {
                this.previewGif = URL.createObjectURL(blob);
                resolve(this.previewGif);
            });

            gif.render();
        });
    }

    async generateFinalGif(frames, settings, selectedAnimation, animationSpeed, animationIntensity, rainbowEffect, fps, quality, duration) {
        const totalFrames = fps * duration;
        
        const gif = new GIF({
            workers: 2,
            quality,
            width: 112,
            height: 112,
            workerScript: URL.createObjectURL(this.gifWorkerBlob),
            transparent: settings.backgroundColor ? null : 0x00000000
        });

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 112;
        tempCanvas.height = 112;
        const tempCtx = tempCanvas.getContext('2d');

        for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
            const progress = frameNum / totalFrames;
            
            frames.forEach((frame) => {
                this.renderFrame(tempCtx, frame, settings, selectedAnimation, progress, animationIntensity, rainbowEffect);
                
                gif.addFrame(tempCanvas, {
                    delay: 1000 / (fps * animationSpeed),
                    copy: true
                });
            });
        }

        return new Promise((resolve) => {
            gif.on('finished', blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'twitch-emote.gif';
                link.click();
                
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
                
                resolve();
            });

            gif.render();
        });
    }

    renderFrame(ctx, frame, settings, selectedAnimation, progress, animationIntensity, rainbowEffect) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        if (settings.backgroundColor) {
            ctx.fillStyle = settings.backgroundColor;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        
        const scale = settings.scale / 100;
        const scaledWidth = ctx.canvas.width * scale;
        const scaledHeight = ctx.canvas.height * scale;
        const x = (ctx.canvas.width - scaledWidth) / 2;
        const y = (ctx.canvas.height - scaledHeight) / 2;
        
        const effectiveWidth = scaledWidth;
        const effectiveHeight = scaledHeight;
        
        ctx.save();
        
        // Apply animation transforms
        this.animationEngine.applyAnimationTransform(
            ctx, selectedAnimation, progress, animationIntensity,
            ctx.canvas.width, ctx.canvas.height, effectiveWidth, effectiveHeight, x, y
        );
        
        ctx.globalAlpha = settings.opacity / 100;
        
        // Apply rainbow effect if enabled
        if (rainbowEffect) {
            const rainbowFrame = this.animationEngine.applyRainbowEffect(frame, progress, effectiveWidth, effectiveHeight);
            ctx.drawImage(rainbowFrame, x, y, effectiveWidth, effectiveHeight);
        } else {
            ctx.drawImage(frame, x, y, effectiveWidth, effectiveHeight);
        }
        
        ctx.restore();
    }
}

export default GifGenerator;