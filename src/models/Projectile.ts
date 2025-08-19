/**
 * Represents a projectile entity in the game.
 * Handles projectile behavior, movement, and properties.
 */
export class Projectile {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _velocityY: number;
    private _damage: number;
    private _active: boolean;
    private _owner: string;

    /**
     * Creates a new Projectile instance
     * @param x - Initial X coordinate
     * @param y - Initial Y coordinate
     * @param width - Width of the projectile
     * @param height - Height of the projectile
     * @param velocityY - Vertical velocity (positive moves down, negative moves up)
     * @param damage - Amount of damage the projectile deals
     * @param owner - Entity type that fired the projectile ('player' or 'enemy')
     */
    constructor(
        x: number,
        y: number,
        width: number = 4,
        height: number = 10,
        velocityY: number = -5,
        damage: number = 1,
        owner: string = 'player'
    ) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._velocityY = velocityY;
        this._damage = damage;
        this._active = true;
        this._owner = owner;

        this.validateConstructorParams();
    }

    /**
     * Validates constructor parameters
     * @throws Error if parameters are invalid
     */
    private validateConstructorParams(): void {
        if (typeof this._x !== 'number' || isNaN(this._x)) {
            throw new Error('Invalid x coordinate');
        }
        if (typeof this._y !== 'number' || isNaN(this._y)) {
            throw new Error('Invalid y coordinate');
        }
        if (this._width <= 0) {
            throw new Error('Width must be greater than 0');
        }
        if (this._height <= 0) {
            throw new Error('Height must be greater than 0');
        }
        if (this._owner !== 'player' && this._owner !== 'enemy') {
            throw new Error('Owner must be either "player" or "enemy"');
        }
    }

    /**
     * Updates the projectile's position based on its velocity
     * @param deltaTime - Time elapsed since last update in milliseconds
     */
    public update(deltaTime: number): void {
        if (!this._active) return;
        
        // Move the projectile based on velocity and delta time
        this._y += this._velocityY * (deltaTime / 16.67); // Normalized for 60 FPS
    }

    /**
     * Deactivates the projectile (e.g., when it hits something or goes off-screen)
     */
    public deactivate(): void {
        this._active = false;
    }

    /**
     * Gets the bounding box for collision detection
     * @returns Object containing position and dimensions
     */
    public getBoundingBox(): { x: number; y: number; width: number; height: number } {
        return {
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height
        };
    }

    // Getters and setters
    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get damage(): number {
        return this._damage;
    }

    public get active(): boolean {
        return this._active;
    }

    public get owner(): string {
        return this._owner;
    }

    public get velocityY(): number {
        return this._velocityY;
    }

    /**
     * Checks if the projectile is off screen
     * @param canvasHeight - Height of the game canvas
     * @returns boolean indicating if projectile is off screen
     */
    public isOffScreen(canvasHeight: number): boolean {
        return this._y < 0 || this._y > canvasHeight;
    }

    /**
     * Creates a clone of the projectile
     * @returns A new Projectile instance with the same properties
     */
    public clone(): Projectile {
        return new Projectile(
            this._x,
            this._y,
            this._width,
            this._height,
            this._velocityY,
            this._damage,
            this._owner
        );
    }

    /**
     * Returns a string representation of the projectile
     * @returns String describing the projectile
     */
    public toString(): string {
        return `Projectile(x: ${this._x}, y: ${this._y}, owner: ${this._owner}, active: ${this._active})`;
    }
}