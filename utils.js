// Generic utility functions for the Twitch GIF Maker

export class Utils {
    // Convert RGB to HSL
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [h, s, l];
    }

    // Convert HSL to RGB
    static hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // Apply hue rotation to image data
    static applyHueRotation(imageData, hueRotation) {
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) { // Only process non-transparent pixels
                const [h, s, l] = this.rgbToHsl(data[i], data[i + 1], data[i + 2]);
                
                // Rotate hue
                const newH = (h + hueRotation / 360) % 1;
                
                // Convert back to RGB
                const [r, g, b] = this.hslToRgb(newH, s, l);
                
                // Put back into data array
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
            }
        }

        return imageData;
    }

    // Create a canvas from image data
    static createCanvasFromImageData(imageData) {
        const canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    // Get canvas as image data URL
    static canvasToDataURL(canvas) {
        return canvas.toDataURL();
    }

    // Create loading element
    static createLoadingElement() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'preview-loading';
        loadingEl.innerHTML = '<div class="loading-spinner"></div>';
        return loadingEl;
    }

    // Wait for condition with timeout
    static async waitFor(condition, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const check = () => {
                if (condition()) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Timeout waiting for condition'));
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        });
    }

    // Debounce function calls
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Check if colors are similar within tolerance
    static colorsAreSimilar(color1, color2, tolerance = 30) {
        return Math.abs(color1.r - color2.r) <= tolerance &&
               Math.abs(color1.g - color2.g) <= tolerance &&
               Math.abs(color1.b - color2.b) <= tolerance &&
               Math.abs(color1.a - color2.a) <= tolerance;
    }

    // Convert hex color to RGB
    static hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    // Flood fill algorithm
    static floodFill(imageData, startX, startY, targetColor, fillColor, tolerance = 30) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        const stack = [{x: startX, y: startY}];
        const visited = new Uint8Array(width * height);
        
        const fillRgb = this.hexToRgb(fillColor);

        while (stack.length > 0) {
            const {x, y} = stack.pop();

            if (x < 0 || y < 0 || x >= width || y >= height)
                continue;

            const index = y * width + x;

            if (visited[index] === 1)
                continue;

            const pixelIndex = index * 4;
            const pixelColor = {
                r: data[pixelIndex],
                g: data[pixelIndex + 1],
                b: data[pixelIndex + 2],
                a: data[pixelIndex + 3]
            };

            if (this.colorsAreSimilar(pixelColor, targetColor, tolerance)) {
                visited[index] = 1;

                // Set new color
                data[pixelIndex] = fillRgb.r;
                data[pixelIndex + 1] = fillRgb.g;
                data[pixelIndex + 2] = fillRgb.b;

                stack.push({x: x + 1, y});
                stack.push({x: x - 1, y});
                stack.push({x, y: y + 1});
                stack.push({x, y: y - 1});
            }
        }

        return imageData;
    }
}

export default Utils;