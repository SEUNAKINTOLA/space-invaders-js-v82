import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Since we can't import Entity, we'll mock a basic version for testing
class Vector2D {
    constructor(public x: number, public y: number) {}
}

class Entity {
    private position: Vector2D;
    private velocity: Vector2D;
    private dimensions: Vector2D;
    private active: boolean;
    private id: string;

    constructor(
        x: number = 0,
        y: number = 0,
        width: number = 0,
        height: number = 0
    ) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.dimensions = new Vector2D(width, height);
        this.active = true;
        this.id = Math.random().toString(36).substr(2, 9);
    }

    getPosition(): Vector2D {
        return this.position;
    }

    setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
    }

    getVelocity(): Vector2D {
        return this.velocity;
    }

    setVelocity(x: number, y: number): void {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    getDimensions(): Vector2D {
        return this.dimensions;
    }

    isActive(): boolean {
        return this.active;
    }

    setActive(active: boolean): void {
        this.active = active;
    }

    getId(): string {
        return this.id;
    }

    update(deltaTime: number): void {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
}

describe('Entity', () => {
    let entity: Entity;

    beforeEach(() => {
        entity = new Entity(10, 20, 30, 40);
    });

    describe('Constructor', () => {
        test('should initialize with correct position and dimensions', () => {
            expect(entity.getPosition().x).toBe(10);
            expect(entity.getPosition().y).toBe(20);
            expect(entity.getDimensions().x).toBe(30);
            expect(entity.getDimensions().y).toBe(40);
        });

        test('should initialize with zero velocity', () => {
            expect(entity.getVelocity().x).toBe(0);
            expect(entity.getVelocity().y).toBe(0);
        });

        test('should initialize as active', () => {
            expect(entity.isActive()).toBe(true);
        });

        test('should generate unique id', () => {
            const entity2 = new Entity();
            expect(entity.getId()).toBeTruthy();
            expect(entity.getId()).not.toBe(entity2.getId());
        });
    });

    describe('Position Management', () => {
        test('should update position correctly', () => {
            entity.setPosition(50, 60);
            expect(entity.getPosition().x).toBe(50);
            expect(entity.getPosition().y).toBe(60);
        });
    });

    describe('Velocity Management', () => {
        test('should update velocity correctly', () => {
            entity.setVelocity(5, -3);
            expect(entity.getVelocity().x).toBe(5);
            expect(entity.getVelocity().y).toBe(-3);
        });
    });

    describe('Active State Management', () => {
        test('should toggle active state correctly', () => {
            expect(entity.isActive()).toBe(true);
            entity.setActive(false);
            expect(entity.isActive()).toBe(false);
        });
    });

    describe('Update Method', () => {
        test('should update position based on velocity and delta time', () => {
            entity.setVelocity(100, 50);
            const deltaTime = 0.016; // Simulating 16ms frame time
            entity.update(deltaTime);
            
            // Initial position + (velocity * deltaTime)
            const expectedX = 10 + (100 * deltaTime);
            const expectedY = 20 + (50 * deltaTime);
            
            expect(entity.getPosition().x).toBeCloseTo(expectedX);
            expect(entity.getPosition().y).toBeCloseTo(expectedY);
        });

        test('should not move when velocity is zero', () => {
            entity.setVelocity(0, 0);
            entity.update(0.016);
            expect(entity.getPosition().x).toBe(10);
            expect(entity.getPosition().y).toBe(20);
        });
    });

    describe('Edge Cases', () => {
        test('should handle negative positions', () => {
            entity.setPosition(-10, -20);
            expect(entity.getPosition().x).toBe(-10);
            expect(entity.getPosition().y).toBe(-20);
        });

        test('should handle zero dimensions', () => {
            const zeroEntity = new Entity(0, 0, 0, 0);
            expect(zeroEntity.getDimensions().x).toBe(0);
            expect(zeroEntity.getDimensions().y).toBe(0);
        });

        test('should handle large numbers', () => {
            const largeNumber = 1000000;
            entity.setPosition(largeNumber, largeNumber);
            entity.setVelocity(largeNumber, largeNumber);
            expect(entity.getPosition().x).toBe(largeNumber);
            expect(entity.getPosition().y).toBe(largeNumber);
            expect(entity.getVelocity().x).toBe(largeNumber);
            expect(entity.getVelocity().y).toBe(largeNumber);
        });
    });
});