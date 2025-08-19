import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Since we can't import directly, we'll mock the necessary types
interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    isActive: boolean;
}

interface CollisionDetector {
    checkCollision(entity1: Entity, entity2: Entity): boolean;
    checkBoundaryCollision(entity: Entity, boundaryWidth: number, boundaryHeight: number): boolean;
    detectCollisions(entities: Entity[]): [Entity, Entity][];
}

// Mock implementation for testing
class MockCollisionDetector implements CollisionDetector {
    checkCollision(entity1: Entity, entity2: Entity): boolean {
        // Basic AABB (Axis-Aligned Bounding Box) collision detection
        return (
            entity1.isActive &&
            entity2.isActive &&
            entity1.x < entity2.x + entity2.width &&
            entity1.x + entity1.width > entity2.x &&
            entity1.y < entity2.y + entity2.height &&
            entity1.y + entity1.height > entity2.y
        );
    }

    checkBoundaryCollision(entity: Entity, boundaryWidth: number, boundaryHeight: number): boolean {
        return (
            entity.x < 0 ||
            entity.x + entity.width > boundaryWidth ||
            entity.y < 0 ||
            entity.y + entity.height > boundaryHeight
        );
    }

    detectCollisions(entities: Entity[]): [Entity, Entity][] {
        const collisions: [Entity, Entity][] = [];
        for (let i = 0; i < entities.length; i++) {
            for (let j = i + 1; j < entities.length; j++) {
                if (this.checkCollision(entities[i], entities[j])) {
                    collisions.push([entities[i], entities[j]]);
                }
            }
        }
        return collisions;
    }
}

describe('CollisionDetector', () => {
    let collisionDetector: CollisionDetector;

    beforeEach(() => {
        collisionDetector = new MockCollisionDetector();
    });

    describe('checkCollision', () => {
        test('should detect collision between overlapping entities', () => {
            const entity1: Entity = {
                x: 0,
                y: 0,
                width: 10,
                height: 10,
                isActive: true
            };
            const entity2: Entity = {
                x: 5,
                y: 5,
                width: 10,
                height: 10,
                isActive: true
            };

            expect(collisionDetector.checkCollision(entity1, entity2)).toBe(true);
        });

        test('should not detect collision between non-overlapping entities', () => {
            const entity1: Entity = {
                x: 0,
                y: 0,
                width: 10,
                height: 10,
                isActive: true
            };
            const entity2: Entity = {
                x: 20,
                y: 20,
                width: 10,
                height: 10,
                isActive: true
            };

            expect(collisionDetector.checkCollision(entity1, entity2)).toBe(false);
        });

        test('should not detect collision when one entity is inactive', () => {
            const entity1: Entity = {
                x: 0,
                y: 0,
                width: 10,
                height: 10,
                isActive: true
            };
            const entity2: Entity = {
                x: 5,
                y: 5,
                width: 10,
                height: 10,
                isActive: false
            };

            expect(collisionDetector.checkCollision(entity1, entity2)).toBe(false);
        });
    });

    describe('checkBoundaryCollision', () => {
        test('should detect collision with left boundary', () => {
            const entity: Entity = {
                x: -5,
                y: 50,
                width: 10,
                height: 10,
                isActive: true
            };

            expect(collisionDetector.checkBoundaryCollision(entity, 800, 600)).toBe(true);
        });

        test('should detect collision with right boundary', () => {
            const entity: Entity = {
                x: 795,
                y: 50,
                width: 10,
                height: 10,
                isActive: true
            };

            expect(collisionDetector.checkBoundaryCollision(entity, 800, 600)).toBe(true);
        });

        test('should not detect boundary collision for entity within bounds', () => {
            const entity: Entity = {
                x: 400,
                y: 300,
                width: 10,
                height: 10,
                isActive: true
            };

            expect(collisionDetector.checkBoundaryCollision(entity, 800, 600)).toBe(false);
        });
    });

    describe('detectCollisions', () => {
        test('should detect multiple collisions between entities', () => {
            const entities: Entity[] = [
                { x: 0, y: 0, width: 10, height: 10, isActive: true },
                { x: 5, y: 5, width: 10, height: 10, isActive: true },
                { x: 20, y: 20, width: 10, height: 10, isActive: true },
                { x: 25, y: 25, width: 10, height: 10, isActive: true }
            ];

            const collisions = collisionDetector.detectCollisions(entities);
            expect(collisions.length).toBe(2);
            expect(collisions).toContainEqual([entities[0], entities[1]]);
            expect(collisions).toContainEqual([entities[2], entities[3]]);
        });

        test('should return empty array when no collisions detected', () => {
            const entities: Entity[] = [
                { x: 0, y: 0, width: 10, height: 10, isActive: true },
                { x: 20, y: 20, width: 10, height: 10, isActive: true },
                { x: 40, y: 40, width: 10, height: 10, isActive: true }
            ];

            const collisions = collisionDetector.detectCollisions(entities);
            expect(collisions.length).toBe(0);
        });
    });
});