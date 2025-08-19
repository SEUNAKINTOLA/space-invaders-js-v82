/**
 * Represents an enemy entity in the Space Invaders game.
 * @class Enemy
 */
export class Enemy {
    private _id: string;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _speed: number;
    private _health: number;
    private _isActive: boolean;
    private _points: number;
    private _direction: number; // 1 for right, -1 for left
    private _type: EnemyType;

    /**
     * Represents different types of enemies with varying characteristics
     */
    public static readonly ENEMY_TYPES = {
        BASIC: 'basic',
        ADVANCED: 'advanced',
        BOSS: 'boss'
    } as const;

    /**
     * Creates a new Enemy instance.
     * @param x - Initial X coordinate
     * @param y - Initial Y coordinate
     * @param type - Type of enemy
     * @param width - Width of enemy hitbox
     * @param height - Height of enemy hitbox
     */
    constructor(
        x: number,
        y: number,
        type: EnemyType = Enemy.ENEMY_TYPES.BASIC,
        width: number = 30,
        height: number = 30
    ) {
        this._id = crypto.randomUUID();
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._type = type;
        this._isActive = true;
        this._direction = 1;

        // Initialize enemy properties based on type
        this.initializeEnemyType(type);
    }

    /**
     * Initializes enemy properties based on its type
     * @param type - Type of enemy
     * @private
     */
    private initializeEnemyType(type: EnemyType): void {
        switch (type) {
            case Enemy.ENEMY_TYPES.BASIC:
                this._speed = 2;
                this._health = 1;
                this._points = 10;
                break;
            case Enemy.ENEMY_TYPES.ADVANCED:
                this._speed = 3;
                this._health = 2;
                this._points = 20;
                break;
            case Enemy.ENEMY_TYPES.BOSS:
                this._speed = 1;
                this._health = 5;
                this._points = 50;
                break;
            default:
                throw new Error(`Invalid enemy type: ${type}`);
        }
    }

    /**
     * Updates the enemy's position
     * @param deltaTime - Time elapsed since last update
     */
    public update(deltaTime: number): void {
        if (!this._isActive) return;
        
        this._x += this._speed * this._direction * deltaTime;
    }

    /**
     * Handles enemy taking damage
     * @param damage - Amount of damage to take
     * @returns boolean indicating if enemy was destroyed
     */
    public takeDamage(damage: number): boolean {
        if (!this._isActive) return false;

        this._health -= damage;
        if (this._health <= 0) {
            this._isActive = false;
            return true;
        }
        return false;
    }

    /**
     * Changes enemy movement direction and moves down
     * @param dropDistance - Distance to drop downward
     */
    public changeDirection(dropDistance: number): void {
        this._direction *= -1;
        this._y += dropDistance;
    }

    // Getters
    public get id(): string {
        return this._id;
    }

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

    public get speed(): number {
        return this._speed;
    }

    public get health(): number {
        return this._health;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public get points(): number {
        return this._points;
    }

    public get direction(): number {
        return this._direction;
    }

    public get type(): EnemyType {
        return this._type;
    }

    // Setters
    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }

    /**
     * Gets the enemy's bounding box for collision detection
     * @returns Object containing position and dimensions
     */
    public getBoundingBox(): BoundingBox {
        return {
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height
        };
    }
}

/**
 * Type definition for enemy types
 */
export type EnemyType = typeof Enemy.ENEMY_TYPES[keyof typeof Enemy.ENEMY_TYPES];

/**
 * Interface for bounding box used in collision detection
 */
interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}