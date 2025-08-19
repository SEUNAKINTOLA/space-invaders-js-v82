/**
 * @file Entity.ts
 * @description Base entity class for all game objects in Space Invaders
 */

/**
 * Represents a position in 2D space
 */
export interface Vector2D {
    x: number;
    y: number;
}

/**
 * Represents the dimensions of an entity
 */
export interface Dimensions {
    width: number;
    height: number;
}

/**
 * Base entity class that all game objects inherit from
 */
export abstract class Entity {
    private _position: Vector2D;
    private _velocity: Vector2D;
    private _dimensions: Dimensions;
    private _active: boolean;
    private _id: string;

    /**
     * Creates a new Entity instance
     * @param position Initial position of the entity
     * @param dimensions Width and height of the entity
     * @param velocity Initial velocity of the entity
     */
    constructor(
        position: Vector2D = { x: 0, y: 0 },
        dimensions: Dimensions = { width: 0, height: 0 },
        velocity: Vector2D = { x: 0, y: 0 }
    ) {
        this._position = { ...position };
        this._dimensions = { ...dimensions };
        this._velocity = { ...velocity };
        this._active = true;
        this._id = this.generateId();
    }

    /**
     * Generates a unique identifier for the entity
     * @returns A unique string ID
     */
    private generateId(): string {
        return `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Updates the entity's position based on its velocity
     * @param deltaTime Time elapsed since last update in seconds
     */
    public update(deltaTime: number): void {
        this._position.x += this._velocity.x * deltaTime;
        this._position.y += this._velocity.y * deltaTime;
    }

    /**
     * Checks if this entity collides with another entity
     * @param other The other entity to check collision with
     * @returns True if the entities collide, false otherwise
     */
    public collidesWith(other: Entity): boolean {
        return (
            this._position.x < other._position.x + other._dimensions.width &&
            this._position.x + this._dimensions.width > other._position.x &&
            this._position.y < other._position.y + other._dimensions.height &&
            this._position.y + this._dimensions.height > other._position.y
        );
    }

    // Getters and setters
    get position(): Vector2D {
        return { ...this._position };
    }

    set position(newPosition: Vector2D) {
        this._position = { ...newPosition };
    }

    get velocity(): Vector2D {
        return { ...this._velocity };
    }

    set velocity(newVelocity: Vector2D) {
        this._velocity = { ...newVelocity };
    }

    get dimensions(): Dimensions {
        return { ...this._dimensions };
    }

    set dimensions(newDimensions: Dimensions) {
        this._dimensions = { ...newDimensions };
    }

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }

    get id(): string {
        return this._id;
    }

    /**
     * Gets the bounding box of the entity
     * @returns Object containing the bounds of the entity
     */
    public getBounds(): {
        left: number;
        right: number;
        top: number;
        bottom: number;
    } {
        return {
            left: this._position.x,
            right: this._position.x + this._dimensions.width,
            top: this._position.y,
            bottom: this._position.y + this._dimensions.height,
        };
    }

    /**
     * Abstract method that must be implemented by derived classes
     * to handle entity-specific rendering logic
     */
    public abstract render(context: CanvasRenderingContext2D): void;
}