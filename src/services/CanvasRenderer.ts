/**
 * @file CanvasRenderer.ts
 * @description Service responsible for handling canvas rendering operations and managing the game's visual output
 */

export interface RenderableEntity {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    sprite?: HTMLImageElement;
}

export interface CanvasConfig {
    width: number;
    height: number;
    backgroundColor: string;
}

/**
 * Service responsible for rendering game entities on an HTML5 Canvas
 */
export class CanvasRenderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private config: CanvasConfig;
    private isInitialized: boolean = false;

    /**
     * Creates a new instance of CanvasRenderer
     * @param config - Configuration options for the canvas
     */
    constructor(config: CanvasConfig) {
        this.config = config;
    }

    /**
     * Initializes the canvas renderer
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
     * Renders a single entity on the canvas
     * @param entity - The entity to render
     */
    public renderEntity(entity: RenderableEntity): void {
        this.validateInitialization();

        if (entity.sprite) {
            this.renderSprite(entity);
        } else {
            this.renderShape(entity);
        }
    }

    /**
     * Renders multiple entities in a batch
     * @param entities - Array of entities to render
     */
    public renderEntities(entities: RenderableEntity[]): void {
        this.validateInitialization();
        entities.forEach(entity => this.renderEntity(entity));
    }

    /**
     * Renders text on the canvas
     * @param text - The text to render
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param options - Optional text rendering configuration
     */
    public renderText(
        text: string,
        x: number,
        y: number,
        options: {
            font?: string;
            color?: string;
            align?: CanvasTextAlign;
        } = {}
    ): void {
        this.validateInitialization();
        
        this.context.font = options.font || '16px Arial';
        this.context.fillStyle = options.color || '#ffffff';
        this.context.textAlign = options.align || 'left';
        this.context.fillText(text, x, y);
    }

    /**
     * Gets the current canvas dimensions
     * @returns Object containing canvas width and height
     */
    public getDimensions(): { width: number; height: number } {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * Updates the canvas dimensions
     * @param width - New canvas width
     * @param height - New canvas height
     */
    public setDimensions(width: number, height: number): void {
        this.validateInitialization();
        this.canvas.width = width;
        this.canvas.height = height;
        this.config.width = width;
        this.config.height = height;
    }

    private renderSprite(entity: RenderableEntity): void {
        if (entity.sprite) {
            this.context.drawImage(
                entity.sprite,
                entity.x,
                entity.y,
                entity.width,
                entity.height
            );
        }
    }

    private renderShape(entity: RenderableEntity): void {
        this.context.fillStyle = entity.color || '#ffffff';
        this.context.fillRect(
            entity.x,
            entity.y,
            entity.width,
            entity.height
        );
    }

    private validateInitialization(): void {
        if (!this.isInitialized) {
            throw new Error('CanvasRenderer must be initialized before use');
        }
    }
}

/**
 * Factory function to create a new CanvasRenderer instance
 * @param config - Configuration options for the canvas
 * @returns A new CanvasRenderer instance
 */
export function createCanvasRenderer(config: CanvasConfig): CanvasRenderer {
    return new CanvasRenderer(config);
}