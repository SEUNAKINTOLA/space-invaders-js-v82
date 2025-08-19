/**
 * @file ScreenEffects.ts
 * @description Manages visual screen effects like screen shake and transitions for the game
 */

export interface ScreenEffectOptions {
    duration: number;
    intensity?: number;
    fadeColor?: string;
    easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * Manages and applies various screen effects to enhance game visual feedback
 */
export class ScreenEffects {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isShaking: boolean = false;
    private isFading: boolean = false;
    private shakeTimeout: number | null = null;
    private fadeTimeout: number | null = null;
    private originalPosition: { x: number; y: number };
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.originalPosition = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop
        };
    }

    /**
     * Initiates a screen shake effect
     * @param options Configuration options for the shake effect
     */
    public shake(options: ScreenEffectOptions): void {
        if (this.isShaking) return;

        const {
            duration = 500,
            intensity = 5
        } = options;

        this.isShaking = true;
        let startTime = performance.now();

        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                const decreasingIntensity = intensity * (1 - progress);
                const offsetX = (Math.random() - 0.5) * decreasingIntensity * 2;
                const offsetY = (Math.random() - 0.5) * decreasingIntensity * 2;

                this.canvas.style.transform = 
                    `translate(${offsetX}px, ${offsetY}px)`;

                requestAnimationFrame(animate);
            } else {
                this.resetShake();
            }
        };

        requestAnimationFrame(animate);
        this.shakeTimeout = window.setTimeout(() => this.resetShake(), duration);
    }

    /**
     * Creates a fade transition effect
     * @param options Configuration options for the fade effect
     * @returns Promise that resolves when the fade is complete
     */
    public async fade(options: ScreenEffectOptions): Promise<void> {
        if (this.isFading) return;

        const {
            duration = 1000,
            fadeColor = '#000000',
            easing = 'linear'
        } = options;

        this.isFading = true;

        return new Promise((resolve) => {
            let startTime = performance.now();

            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const alpha = this.getEasedValue(progress, easing);

                this.ctx.fillStyle = fadeColor;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.globalAlpha = 1;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isFading = false;
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    /**
     * Applies a flash effect to the screen
     * @param options Configuration options for the flash effect
     */
    public flash(options: ScreenEffectOptions): void {
        const {
            duration = 100,
            fadeColor = '#FFFFFF'
        } = options;

        this.fade({ duration: duration / 2, fadeColor })
            .then(() => this.fade({ duration: duration / 2, fadeColor: 'transparent' }));
    }

    /**
     * Resets the screen shake effect
     */
    private resetShake(): void {
        if (this.shakeTimeout) {
            clearTimeout(this.shakeTimeout);
            this.shakeTimeout = null;
        }
        
        this.canvas.style.transform = 'translate(0, 0)';
        this.isShaking = false;
    }

    /**
     * Calculates eased value based on the specified easing function
     * @param value Input value between 0 and 1
     * @param easingType Type of easing to apply
     * @returns Eased value between 0 and 1
     */
    private getEasedValue(value: number, easingType: string): number {
        switch (easingType) {
            case 'easeIn':
                return value * value;
            case 'easeOut':
                return 1 - Math.pow(1 - value, 2);
            case 'easeInOut':
                return value < 0.5
                    ? 2 * value * value
                    : 1 - Math.pow(-2 * value + 2, 2) / 2;
            default:
                return value; // linear
        }
    }

    /**
     * Cleans up any ongoing effects
     */
    public dispose(): void {
        this.resetShake();
        if (this.fadeTimeout) {
            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;
        }
        this.isFading = false;
    }
}

/**
 * Factory function to create screen effects instance
 * @param canvas Canvas element to apply effects to
 * @returns New ScreenEffects instance
 */
export const createScreenEffects = (canvas: HTMLCanvasElement): ScreenEffects => {
    return new ScreenEffects(canvas);
};