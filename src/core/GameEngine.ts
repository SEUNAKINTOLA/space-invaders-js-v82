/**
 * @file GameEngine.ts
 * @description Core game engine implementation optimized for mobile performance
 */

// Types for game state management
type GameState = {
  isPaused: boolean;
  isRunning: boolean;
  lastFrameTime: number;
  frameCount: number;
  fps: number;
};

type EngineConfig = {
  targetFPS: number;
  updateInterval: number;
  maxDeltaTime: number;
};

/**
 * GameEngine class handles the core game loop and state management
 * Optimized for mobile devices with frame timing and state control
 */
export class GameEngine {
  private state: GameState;
  private config: EngineConfig;
  private rafId: number | null;
  private updateCallbacks: Array<(dt: number) => void>;
  private renderCallbacks: Array<() => void>;
  
  // Performance optimization: Use a fixed time step
  private readonly FIXED_TIME_STEP = 1000 / 60; // 60 FPS
  private accumulator: number = 0;

  constructor(config?: Partial<EngineConfig>) {
    this.state = {
      isPaused: false,
      isRunning: false,
      lastFrameTime: 0,
      frameCount: 0,
      fps: 0
    };

    this.config = {
      targetFPS: 60,
      updateInterval: 1000 / 60,
      maxDeltaTime: 32, // Cap at ~30 FPS minimum
      ...config
    };

    this.rafId = null;
    this.updateCallbacks = [];
    this.renderCallbacks = [];

    // Bind methods to preserve context
    this.gameLoop = this.gameLoop.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  /**
   * Starts the game loop
   */
  public start(): void {
    if (!this.state.isRunning) {
      this.state.isRunning = true;
      this.state.lastFrameTime = performance.now();
      this.rafId = requestAnimationFrame(this.gameLoop);
    }
  }

  /**
   * Stops the game loop
   */
  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.state.isRunning = false;
  }

  /**
   * Pauses/unpauses the game
   */
  public togglePause(): void {
    this.state.isPaused = !this.state.isPaused;
  }

  /**
   * Adds an update callback to the game loop
   */
  public addUpdateCallback(callback: (dt: number) => void): void {
    this.updateCallbacks.push(callback);
  }

  /**
   * Adds a render callback to the game loop
   */
  public addRenderCallback(callback: () => void): void {
    this.renderCallbacks.push(callback);
  }

  /**
   * Main game loop implementation using requestAnimationFrame
   * Implements fixed time step with accumulator for consistent physics
   */
  private gameLoop(timestamp: number): void {
    if (!this.state.isRunning) return;

    this.rafId = requestAnimationFrame(this.gameLoop);

    // Calculate delta time
    let deltaTime = timestamp - this.state.lastFrameTime;
    
    // Cap maximum delta time to prevent spiral of death
    deltaTime = Math.min(deltaTime, this.config.maxDeltaTime);

    // Update FPS counter
    this.updateFPSCounter(deltaTime);

    // Skip update if paused
    if (this.state.isPaused) {
      this.state.lastFrameTime = timestamp;
      return;
    }

    // Accumulate time for fixed time step
    this.accumulator += deltaTime;

    // Update with fixed time step
    while (this.accumulator >= this.FIXED_TIME_STEP) {
      this.update(this.FIXED_TIME_STEP);
      this.accumulator -= this.FIXED_TIME_STEP;
    }

    // Render
    this.render();

    this.state.lastFrameTime = timestamp;
  }

  /**
   * Updates game state with fixed time step
   */
  private update(dt: number): void {
    // Performance optimization: Use for...of instead of forEach
    for (const callback of this.updateCallbacks) {
      callback(dt);
    }
  }

  /**
   * Renders game state
   */
  private render(): void {
    // Performance optimization: Use for...of instead of forEach
    for (const callback of this.renderCallbacks) {
      callback();
    }
  }

  /**
   * Updates FPS counter
   */
  private updateFPSCounter(deltaTime: number): void {
    this.state.frameCount++;
    
    // Update FPS every second
    if (this.state.frameCount % 60 === 0) {
      this.state.fps = Math.round(1000 / deltaTime);
    }
  }

  /**
   * Returns current FPS
   */
  public getFPS(): number {
    return this.state.fps;
  }

  /**
   * Cleans up resources
   */
  public dispose(): void {
    this.stop();
    this.updateCallbacks = [];
    this.renderCallbacks = [];
  }
}