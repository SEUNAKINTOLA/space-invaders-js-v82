/**
 * @file CollisionSystem.ts
 * @description Provides collision detection functionality for game entities
 */

/**
 * Represents a bounding box for collision detection
 */
interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Represents an object that can collide
 */
interface Collidable {
    getBoundingBox(): BoundingBox;
    onCollision?(other: Collidable): void;
}

/**
 * Manages collision detection between game entities
 */
export class CollisionSystem {
    private static instance: CollisionSystem;
    private collidables: Set<Collidable>;

    private constructor() {
        this.collidables = new Set<Collidable>();
    }

    /**
     * Gets the singleton instance of the CollisionSystem
     * @returns CollisionSystem instance
     */
    public static getInstance(): CollisionSystem {
        if (!CollisionSystem.instance) {
            CollisionSystem.instance = new CollisionSystem();
        }
        return CollisionSystem.instance;
    }

    /**
     * Registers a collidable object with the collision system
     * @param collidable - The object to register
     */
    public register(collidable: Collidable): void {
        if (!collidable) {
            throw new Error('Cannot register null or undefined collidable');
        }
        this.collidables.add(collidable);
    }

    /**
     * Unregisters a collidable object from the collision system
     * @param collidable - The object to unregister
     */
    public unregister(collidable: Collidable): void {
        this.collidables.delete(collidable);
    }

    /**
     * Checks for collisions between all registered collidables
     */
    public checkCollisions(): void {
        const collidableArray = Array.from(this.collidables);

        for (let i = 0; i < collidableArray.length; i++) {
            for (let j = i + 1; j < collidableArray.length; j++) {
                if (this.detectCollision(collidableArray[i], collidableArray[j])) {
                    // Notify both objects of the collision
                    if (collidableArray[i].onCollision) {
                        collidableArray[i].onCollision(collidableArray[j]);
                    }
                    if (collidableArray[j].onCollision) {
                        collidableArray[j].onCollision(collidableArray[i]);
                    }
                }
            }
        }
    }

    /**
     * Detects collision between two collidable objects using AABB collision detection
     * @param a - First collidable object
     * @param b - Second collidable object
     * @returns True if objects are colliding, false otherwise
     */
    private detectCollision(a: Collidable, b: Collidable): boolean {
        const boxA = a.getBoundingBox();
        const boxB = b.getBoundingBox();

        return (
            boxA.x < boxB.x + boxB.width &&
            boxA.x + boxA.width > boxB.x &&
            boxA.y < boxB.y + boxB.height &&
            boxA.y + boxA.height > boxB.y
        );
    }

    /**
     * Checks if a point is within a collidable object
     * @param x - X coordinate of the point
     * @param y - Y coordinate of the point
     * @param collidable - The collidable object to check against
     * @returns True if point is within the collidable, false otherwise
     */
    public isPointColliding(x: number, y: number, collidable: Collidable): boolean {
        const box = collidable.getBoundingBox();
        return (
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height
        );
    }

    /**
     * Clears all registered collidables
     */
    public clear(): void {
        this.collidables.clear();
    }

    /**
     * Gets the number of registered collidables
     * @returns Number of registered collidables
     */
    public getCollidableCount(): number {
        return this.collidables.size;
    }
}

// Export interfaces for use in other files
export type { BoundingBox, Collidable };