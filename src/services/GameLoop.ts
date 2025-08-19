/**
 * @file GameLoop.ts
 * @description Service responsible for managing the game loop and frame timing
 */

/**
 * Configuration interface for GameLoop settings
 */
interface GameLoopConfig {
    targetFPS: number;
    updateCallback: (deltaTime: number) => void;
    renderCallback: () => void;
    panicThreshold?: number;
}

/**
 * Service that manages the game loop timing and execution
 */
export class GameLoop {
    private running: boolean = false;
    private lastTimestamp: number = 0;
    private targetFPS: number;
    private frameInterval: number;
    private accumulatedTime: number = 0;
    private readonly panicThreshold: number;
    private animationFrameId: number | null = null;

    private updateCallback: (deltaTime: number) => void;
    private renderCallback: () => void;

    /**
     * Creates a new GameLoop instance
     * @param config - Configuration options for the game loop
     */
    constructor(config: GameLoopConfig) {
        this.targetFPS = config.targetFPS;
        this.frameInterval = 1000 / this.targetFPS;
        this.panicThreshold = config.panicThreshold || 300; // Default panic threshold at 300ms
        this.updateCallback = config.updateCallback;
        this.renderCallback = config.renderCallback;
    }

    /**
     * Starts the game loop
     */
    public start(): void {
        if (this.running) {
            return;
        }

        this.running = true;
        this.lastTimestamp = performance.now();
        this.accumulatedTime = 0;
        this.tick();
    }

    /**
     * Stops the game loop
     */
    public stop(): void {
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Main loop tick function
     * Implements a fixed time step with accumulator
     */
    private tick = (): void => {
        if (!this.running) {
            return;
        }

        this.animationFrameId = requestAnimationFrame(this.tick);

        const currentTime = performance.now();
        let deltaTime = currentTime - this.lastTimestamp;
        this.lastTimestamp = currentTime;

        // Prevent spiral of death
        if (deltaTime > this.panicThreshold) {
            console.warn('Game loop delta time exceeded panic threshold, resetting to safe value');
            deltaTime = this.frameInterval;
        }

        this.accumulatedTime += deltaTime;

        // Update game logic in fixed time steps
        while (this.accumulatedTime >= this.frameInterval) {
            try {
                this.updateCallback(this.frameInterval);
                this.accumulatedTime -= this.frameInterval;
            } catch (error) {
                console.error('Error in update loop:', error);
                this.stop();
                throw error;
            }
        }

        // Render at whatever FPS the browser is capable of
        try {
            this.renderCallback();
        } catch (error) {
            console.error('Error in render loop:', error);
            this.stop();
            throw error;
        }
    };

    /**
     * Gets the current FPS
     * @returns The calculated frames per second
     */
    public getCurrentFPS(): number {
        return 1000 / this.frameInterval;
    }

    /**
     * Checks if the game loop is currently running
     * @returns True if the game loop is running
     */
    public isRunning(): boolean {
        return this.running;
    }

    /**
     * Updates the target FPS
     * @param newFPS - The new target FPS value
     */
    public setTargetFPS(newFPS: number): void {
        if (newFPS <= 0) {
            throw new Error('Target FPS must be greater than 0');
        }
        this.targetFPS = newFPS;
        this.frameInterval = 1000 / this.targetFPS;
    }
}