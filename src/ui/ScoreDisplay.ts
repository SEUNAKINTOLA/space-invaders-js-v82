/**
 * @file ScoreDisplay.ts
 * @description UI component for rendering and managing the score display in the game
 */

export interface ScoreDisplayConfig {
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    prefix?: string;
}

/**
 * Class responsible for rendering and managing the score display in the game
 */
export class ScoreDisplay {
    private readonly config: ScoreDisplayConfig;
    private currentScore: number;
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private animationFrame: number;
    private readonly defaultConfig: ScoreDisplayConfig = {
        x: 10,
        y: 30,
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#ffffff',
        prefix: 'Score: '
    };

    /**
     * Creates a new ScoreDisplay instance
     * @param canvas - The canvas element to render on
     * @param config - Configuration options for the score display
     */
    constructor(canvas: HTMLCanvasElement, config: Partial<ScoreDisplayConfig> = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = { ...this.defaultConfig, ...config };
        this.currentScore = 0;
        this.animationFrame = 0;

        if (!this.ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
    }

    /**
     * Updates the current score value
     * @param newScore - The new score value to display
     */
    public updateScore(newScore: number): void {
        if (newScore < 0) {
            console.warn('Negative score value detected');
            return;
        }
        
        this.currentScore = newScore;
        this.render();
    }

    /**
     * Renders the score display on the canvas
     */
    private render(): void {
        if (!this.ctx || !this.canvas) {
            return;
        }

        // Clear the previous score area
        const metrics = this.ctx.measureText(this.getScoreText());
        this.ctx.clearRect(
            this.config.x - 2,
            this.config.y - this.config.fontSize,
            metrics.width + 4,
            this.config.fontSize + 4
        );

        // Set up text styling
        this.ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;
        this.ctx.fillStyle = this.config.color;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // Draw the score
        this.ctx.fillText(
            this.getScoreText(),
            this.config.x,
            this.config.y
        );
    }

    /**
     * Gets the formatted score text
     * @returns Formatted score string
     */
    private getScoreText(): string {
        return `${this.config.prefix || ''}${this.currentScore.toString().padStart(6, '0')}`;
    }

    /**
     * Starts the score display animation
     */
    public start(): void {
        this.animate();
    }

    /**
     * Stops the score display animation
     */
    public stop(): void {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    /**
     * Animation loop for the score display
     */
    private animate(): void {
        this.render();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    /**
     * Cleans up resources used by the score display
     */
    public destroy(): void {
        this.stop();
        this.canvas = null;
        this.ctx = null;
    }

    /**
     * Gets the current score value
     * @returns Current score
     */
    public getCurrentScore(): number {
        return this.currentScore;
    }

    /**
     * Updates the display configuration
     * @param newConfig - New configuration options
     */
    public updateConfig(newConfig: Partial<ScoreDisplayConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.render();
    }
}