/**
 * @file RendererService.ts
 * @description Service responsible for handling all canvas rendering operations in the Space Invaders game.
 */

/**
 * Configuration interface for the renderer
 */
interface RendererConfig {
    width: number;
    height: number;
    backgroundColor: string;
}

/**
 * Represents a drawable object with position and dimensions
 */
interface Drawable {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    sprite?: HTMLImageElement;
}

/**
 * Service responsible for handling canvas rendering operations
 */
export class RendererService {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private config: RendererConfig;
    private isInitialized: boolean = false;

    /**
     * Creates an instance of RendererService
     * @param config - Configuration options for the renderer
     */
    constructor(config: RendererConfig = { width: 800, height: 600, backgroundColor: '#000000' }) {
        this.config = config;
    }

    /**
     * Initializes the renderer with a canvas element
     * @param canvasElement - The canvas element to render to
     * @throws Error if canvas context cannot be obtained
     */
    public initialize(canvasElement: HTMLCanvasElement): void {
        this.canvas = canvasElement;
        const context = this.canvas.getContext('2d');
        
        if (!context) {
            throw new Error('Failed to get 2D context from canvas element');
        }

        this.context = context;
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.isInitialized = true;
    }

    /**
     * Clears the entire canvas
     */
    public clear(): void {
        this.validateInitialization();
        this.context.fillStyle = this.config.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws a rectangle on the canvas
     * @param drawable - The object to be drawn
     */
    public drawRect(drawable: Drawable): void {
        this.validateInitialization();
        this.context.fillStyle = drawable.color || '#ffffff';
        this.context.fillRect(
            Math.floor(drawable.x),
            Math.floor(drawable.y),
            drawable.width,
            drawable.height
        );
    }

    /**
     * Draws a sprite on the canvas
     * @param drawable - The sprite object to be drawn
     */
    public drawSprite(drawable: Drawable): void {
        this.validateInitialization();
        if (!drawable.sprite) {
            throw new Error('Sprite property is required for drawSprite');
        }

        this.context.drawImage(
            drawable.sprite,
            Math.floor(drawable.x),
            Math.floor(drawable.y),
            drawable.width,
            drawable.height
        );
    }

    /**
     * Draws text on the canvas
     * @param text - The text to draw
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param options - Text rendering options
     */
    public drawText(
        text: string,
        x: number,
        y: number,
        options: {
            color?: string;
            fontSize?: number;
            fontFamily?: string;
            textAlign?: CanvasTextAlign;
        } = {}
    ): void {
        this.validateInitialization();
        
        const {
            color = '#ffffff',
            fontSize = 16,
            fontFamily = 'Arial',
            textAlign = 'left'
        } = options;

        this.context.fillStyle = color;
        this.context.font = `${fontSize}px ${fontFamily}`;
        this.context.textAlign = textAlign;
        this.context.fillText(text, Math.floor(x), Math.floor(y));
    }

    /**
     * Gets the current canvas dimensions
     * @returns Object containing width and height
     */
    public getDimensions(): { width: number; height: number } {
        return {
            width: this.config.width,
            height: this.config.height
        };
    }

    /**
     * Updates the renderer configuration
     * @param newConfig - New configuration options
     */
    public updateConfig(newConfig: Partial<RendererConfig>): void {
        this.config = { ...this.config, ...newConfig };
        if (this.isInitialized) {
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
        }
    }

    /**
     * Validates that the renderer has been initialized
     * @throws Error if renderer is not initialized
     */
    private validateInitialization(): void {
        if (!this.isInitialized) {
            throw new Error('RendererService must be initialized before use');
        }
    }
}