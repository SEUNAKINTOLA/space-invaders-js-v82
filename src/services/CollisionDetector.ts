/**
 * @file CollisionDetector.ts
 * @description Service responsible for detecting collisions between game entities
 */

/**
 * Represents the basic shape for collision detection
 */
interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Represents the result of a collision check
 */
interface CollisionResult {
    hasCollision: boolean;
    intersection?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

/**
 * Service responsible for detecting collisions between game entities
 */
export class CollisionDetector {
    /**
     * Checks if two bounding boxes intersect
     * @param boxA First bounding box
     * @param boxB Second bounding box
     * @returns CollisionResult containing collision status and intersection details
     */
    public detectCollision(boxA: BoundingBox, boxB: BoundingBox): CollisionResult {
        // Calculate the edges of both boxes
        const leftA = boxA.x;
        const rightA = boxA.x + boxA.width;
        const topA = boxA.y;
        const bottomA = boxA.y + boxA.height;

        const leftB = boxB.x;
        const rightB = boxB.x + boxB.width;
        const topB = boxB.y;
        const bottomB = boxB.y + boxB.height;

        // Check if boxes overlap
        if (
            leftA < rightB &&
            rightA > leftB &&
            topA < bottomB &&
            bottomA > topB
        ) {
            // Calculate intersection rectangle
            const intersection = {
                x: Math.max(leftA, leftB),
                y: Math.max(topA, topB),
                width: Math.min(rightA, rightB) - Math.max(leftA, leftB),
                height: Math.min(bottomA, bottomB) - Math.max(topA, topB)
            };

            return {
                hasCollision: true,
                intersection
            };
        }

        return { hasCollision: false };
    }

    /**
     * Checks if a point is inside a bounding box
     * @param point Point coordinates
     * @param box Bounding box
     * @returns boolean indicating if point is inside box
     */
    public isPointInBox(point: { x: number; y: number }, box: BoundingBox): boolean {
        return (
            point.x >= box.x &&
            point.x <= box.x + box.width &&
            point.y >= box.y &&
            point.y <= box.y + box.height
        );
    }

    /**
     * Checks if two circles collide
     * @param circleA First circle (x, y, radius)
     * @param circleB Second circle (x, y, radius)
     * @returns boolean indicating if circles collide
     */
    public detectCircleCollision(
        circleA: { x: number; y: number; radius: number },
        circleB: { x: number; y: number; radius: number }
    ): boolean {
        const dx = circleA.x - circleB.x;
        const dy = circleA.y - circleB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < (circleA.radius + circleB.radius);
    }

    /**
     * Checks if a circle and box collide
     * @param circle Circle data
     * @param box Bounding box
     * @returns boolean indicating if circle and box collide
     */
    public detectCircleBoxCollision(
        circle: { x: number; y: number; radius: number },
        box: BoundingBox
    ): boolean {
        // Find closest point to circle within box
        const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
        const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));

        // Calculate distance between closest point and circle center
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        const distanceSquared = dx * dx + dy * dy;

        return distanceSquared < (circle.radius * circle.radius);
    }

    /**
     * Predicts if two moving boxes will collide within a given time frame
     * @param boxA First box with velocity
     * @param boxB Second box with velocity
     * @param timeFrame Time frame to check (in seconds)
     * @returns boolean indicating if collision will occur
     */
    public predictCollision(
        boxA: BoundingBox & { vx: number; vy: number },
        boxB: BoundingBox & { vx: number; vy: number },
        timeFrame: number
    ): boolean {
        // Create future positions
        const futureBoxA: BoundingBox = {
            x: boxA.x + boxA.vx * timeFrame,
            y: boxA.y + boxA.vy * timeFrame,
            width: boxA.width,
            height: boxA.height
        };

        const futureBoxB: BoundingBox = {
            x: boxB.x + boxB.vx * timeFrame,
            y: boxB.y + boxB.vy * timeFrame,
            width: boxB.width,
            height: boxB.height
        };

        return this.detectCollision(futureBoxA, futureBoxB).hasCollision;
    }
}