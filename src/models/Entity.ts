/**
 * Represents a position vector in 2D space
 */
interface Vector2D {
    x: number;
    y: number;
}

/**
 * Represents the dimensions of an entity
 */
interface Dimensions {
    width: number;
    height: number;
}

/**
 * Base entity class for all game objects
 * Provides core functionality for position, movement, and basic game object properties
 */
export abstract class Entity {
    private _position: Vector2D;
    private _velocity: Vector2D;
    private _dimensions: Dimensions;
    private _active: boolean;
    private _id: string;

    /**
     * Creates a new Entity instance
     * @param x - Initial x position
     * @param y - Initial y position
     * @param width - Entity width
     * @param height - Entity height
     */
    constructor(x: number, y: number, width: number, height: number) {
        this._position = { x, y };
        this._velocity = { x: 0, y: 0 };
        this._dimensions = { width, height };
        this._active = true;
        this._id = this.generateId();
    }

    /**
     * Generates a unique identifier for the entity
     * @returns Unique string identifier
     */
    private generateId(): string {
        return `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Updates the entity's position based on its velocity
     * @param deltaTime - Time elapsed since last update in seconds
     */
    public update(deltaTime: number): void {
        this._position.x += this._velocity.x * deltaTime;
        this._position.y += this._velocity.y * deltaTime;
    }

    /**
     * Gets the entity's current position
     */
    public get position(): Vector2D {
        return { ...this._position };
    }

    /**
     * Sets the entity's position
     */
    public set position(newPosition: Vector2D) {
        this._position = { ...newPosition };
    }

    /**
     * Gets the entity's current velocity
     */
    public get velocity(): Vector2D {
        return { ...this._velocity };
    }

    /**
     * Sets the entity's velocity
     */
    public set velocity(newVelocity: Vector2D) {
        this._velocity = { ...newVelocity };
    }

    /**
     * Gets the entity's dimensions
     */
    public get dimensions(): Dimensions {
        return { ...this._dimensions };
    }

    /**
     * Gets the entity's unique identifier
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Gets whether the entity is active
     */
    public get active(): boolean {
        return this._active;
    }

    /**
     * Sets whether the entity is active
     */
    public set active(value: boolean) {
        this._active = value;
    }

    /**
     * Gets the entity's bounding box for collision detection
     * @returns Object containing position and dimensions for collision checking
     */
    public getBoundingBox(): { position: Vector2D; dimensions: Dimensions } {
        return {
            position: this.position,
            dimensions: this.dimensions
        };
    }

    /**
     * Checks if this entity collides with another entity
     * @param other - The other entity to check collision with
     * @returns True if entities collide, false otherwise
     */
    public collidesWith(other: Entity): boolean {
        const thisBox = this.getBoundingBox();
        const otherBox = other.getBoundingBox();

        return (
            thisBox.position.x < otherBox.position.x + otherBox.dimensions.width &&
            thisBox.position.x + thisBox.dimensions.width > otherBox.position.x &&
            thisBox.position.y < otherBox.position.y + otherBox.dimensions.height &&
            thisBox.position.y + thisBox.dimensions.height > otherBox.position.y
        );
    }

    /**
     * Abstract method to be implemented by derived classes
     * Handles specific behavior when entity is destroyed
     */
    public abstract onDestroy(): void;
}

/**
 * Export interfaces for use in other files
 */
export type { Vector2D, Dimensions };