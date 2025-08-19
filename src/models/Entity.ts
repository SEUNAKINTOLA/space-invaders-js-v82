/**
 * @file Entity.ts
 * @description Base class for all game entities in Space Invaders
 */

/**
 * Represents the position of an entity in 2D space
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
 * Represents the boundaries of an entity for collision detection
 */
export interface Bounds {
    top: number;
    right: number;
    bottom: number;
    left: number;
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
     * Calculates the current bounds of the entity for collision detection
     */
    public getBounds(): Bounds {
        return {
            top: this._position.y,
            right: this._position.x + this._dimensions.width,
            bottom: this._position.y + this._dimensions.height,
            left: this._position.x
        };
    }

    /**
     * Checks if this entity collides with another entity
     * @param other - The other entity to check collision with
     */
    public collidesWith(other: Entity): boolean {
        const bounds = this.getBounds();
        const otherBounds = other.getBounds();

        return !(bounds.left >= otherBounds.right ||
                bounds.right <= otherBounds.left ||
                bounds.top >= otherBounds.bottom ||
                bounds.bottom <= otherBounds.top);
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

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }

    get id(): string {
        return this._id;
    }
}

/**
 * Types of entities in the game
 */
export enum EntityType {
    PLAYER = 'PLAYER',
    ENEMY = 'ENEMY',
    PROJECTILE = 'PROJECTILE',
    POWERUP = 'POWERUP'
}