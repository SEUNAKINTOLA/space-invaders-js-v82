/**
 * @file GameLoop.ts
 * @description Manages the main game loop and game state for Space Invaders
 */

// Game states enum
export enum GameState {
    INIT = 'INIT',
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER'
}

/**
 * Configuration interface for GameLoop
 */
interface GameLoopConfig {
    targetFPS: number;
    updateCallback?: (deltaTime: number) => void;
    renderCallback?: () => void;
    maxFrameTime?: number;
}

/**
 * GameLoop class responsible for managing the game loop and state
 */
export class GameLoop {
    private lastFrameTime: number = 0;
    private frameTime: number = 0;
    private isRunning: boolean = false;
    private accumulator: number = 0;
    private currentState: GameState = GameState.INIT;
    
    private readonly targetFPS: number;
    private readonly targetFrameTime: number;
    private readonly maxFrameTime: number;
    private readonly updateCallback?: (deltaTime: number) => void;
    private readonly renderCallback?: () => void;

    /**
     * Creates a new GameLoop instance
     * @param config - Configuration options for the game loop
     */
    constructor(config: GameLoopConfig) {
        this.targetFPS = config.targetFPS;
        this.targetFrameTime = 1000 / this.targetFPS;
        this.maxFrameTime = config.maxFrameTime || 250; // Default max frame time of 250ms
        this.updateCallback = config.updateCallback;
        this.renderCallback = config.renderCallback;
    }

    /**
     * Starts the game loop
     */
    public start(): void {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    /**
     * Stops the game loop
     */
    public stop(): void {
        this.isRunning = false;
    }

    /**
     * Changes the current game state
     * @param newState - The new state to transition to
     */
    public setState(newState: GameState): void {
        this.currentState = newState;
    }

    /**
     * Gets the current game state
     * @returns The current GameState
     */
    public getState(): GameState {
        return this.currentState;
    }

    /**
     * Main game loop implementation using requestAnimationFrame
     */
    private gameLoop(): void {
        if (!this.isRunning) {
            return;
        }

        const currentTime = performance.now();
        let deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        // Clamp delta time to prevent spiral of death
        if (deltaTime > this.maxFrameTime) {
            deltaTime = this.maxFrameTime;
        }

        // Accumulate time for fixed-time updates
        this.accumulator += deltaTime;

        // Update game logic at fixed time steps
        while (this.accumulator >= this.targetFrameTime) {
            this.update(this.targetFrameTime);
            this.accumulator -= this.targetFrameTime;
        }

        // Render at whatever frame rate the system can handle
        this.render();

        // Schedule next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Updates game logic with fixed time step
     * @param deltaTime - Time elapsed since last update in milliseconds
     */
    private update(deltaTime: number): void {
        if (this.currentState !== GameState.PLAYING) {
            return;
        }

        try {
            this.updateCallback?.(deltaTime);
        } catch (error) {
            console.error('Error in update callback:', error);
            this.stop();
        }
    }

    /**
     * Renders the game state
     */
    private render(): void {
        try {
            this.renderCallback?.();
        } catch (error) {
            console.error('Error in render callback:', error);
            this.stop();
        }
    }

    /**
     * Checks if the game loop is currently running
     * @returns boolean indicating if the game loop is active
     */
    public isActive(): boolean {
        return this.isRunning;
    }

    /**
     * Pauses the game
     */
    public pause(): void {
        if (this.currentState === GameState.PLAYING) {
            this.setState(GameState.PAUSED);
        }
    }

    /**
     * Resumes the game
     */
    public resume(): void {
        if (this.currentState === GameState.PAUSED) {
            this.setState(GameState.PLAYING);
        }
    }
}