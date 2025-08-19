/**
 * Generic object pool implementation for efficient object reuse in game systems.
 * Helps reduce garbage collection overhead and improve performance, especially on mobile devices.
 * @template T The type of objects managed by the pool
 */
export class ObjectPool<T> {
    private pool: T[] = [];
    private activeObjects: Set<T> = new Set();
    private factory: () => T;
    private reset: (obj: T) => void;
    private maxSize: number;

    /**
     * Creates a new ObjectPool instance
     * @param factory Function to create new objects when pool is empty
     * @param reset Function to reset object state when returning to pool
     * @param initialSize Initial number of objects to create
     * @param maxSize Maximum number of objects the pool can hold
     */
    constructor(
        factory: () => T,
        reset: (obj: T) => void,
        initialSize: number = 0,
        maxSize: number = 1000
    ) {
        this.factory = factory;
        this.reset = reset;
        this.maxSize = maxSize;

        // Pre-populate pool with initial objects
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.factory());
        }
    }

    /**
     * Acquires an object from the pool or creates a new one if pool is empty
     * @returns An object of type T
     */
    public acquire(): T {
        let obj: T;

        if (this.pool.length > 0) {
            obj = this.pool.pop()!;
        } else {
            obj = this.factory();
        }

        this.activeObjects.add(obj);
        return obj;
    }

    /**
     * Returns an object to the pool and resets its state
     * @param obj The object to return to the pool
     * @returns boolean indicating if the object was successfully released
     */
    public release(obj: T): boolean {
        if (!this.activeObjects.has(obj)) {
            return false;
        }

        this.activeObjects.delete(obj);
        this.reset(obj);

        // Only add to pool if under max size
        if (this.pool.length < this.maxSize) {
            this.pool.push(obj);
            return true;
        }

        return false;
    }

    /**
     * Releases all currently active objects back to the pool
     */
    public releaseAll(): void {
        this.activeObjects.forEach(obj => this.release(obj));
    }

    /**
     * Gets the number of objects currently available in the pool
     */
    public get availableCount(): number {
        return this.pool.length;
    }

    /**
     * Gets the number of objects currently in use
     */
    public get activeCount(): number {
        return this.activeObjects.size;
    }

    /**
     * Gets the total number of objects managed by the pool
     */
    public get totalCount(): number {
        return this.pool.length + this.activeObjects.size;
    }

    /**
     * Clears the pool and active objects
     */
    public clear(): void {
        this.pool = [];
        this.activeObjects.clear();
    }

    /**
     * Ensures the pool has at least the specified number of objects available
     * @param count Minimum number of objects to maintain in the pool
     */
    public warmup(count: number): void {
        while (this.pool.length < count) {
            this.pool.push(this.factory());
        }
    }

    /**
     * Trims the pool to a specified size by removing excess objects
     * @param maxSize Maximum number of objects to keep in the pool
     */
    public trim(maxSize: number): void {
        if (maxSize < 0) {
            throw new Error('Max size cannot be negative');
        }
        while (this.pool.length > maxSize) {
            this.pool.pop();
        }
    }
}

/**
 * Type guard to check if an object is poolable
 * @param obj Object to check
 */
export function isPoolable(obj: any): obj is { reset: () => void } {
    return obj && typeof obj.reset === 'function';
}