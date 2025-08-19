/**
 * @file Player.ts
 * @description Player entity model for Space Invaders game
 */

/**
 * Represents the possible states a player can be in
 */
export enum PlayerState {
  ALIVE = 'ALIVE',
  INVULNERABLE = 'INVULNERABLE',
  DEAD = 'DEAD'
}

/**
 * Interface defining the configuration options for a Player instance
 */
export interface PlayerConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lives: number;
  maxLives?: number;
}

/**
 * Player class representing the main player entity in the game
 */
export class Player {
  private readonly _width: number;
  private readonly _height: number;
  private readonly _speed: number;
  private readonly _maxLives: number;

  private _x: number;
  private _y: number;
  private _lives: number;
  private _state: PlayerState;
  private _invulnerabilityTimer: number;
  private _score: number;

  /**
   * Creates a new Player instance
   * @param config - Configuration options for the player
   */
  constructor(config: PlayerConfig) {
    this._x = config.x;
    this._y = config.y;
    this._width = config.width;
    this._height = config.height;
    this._speed = config.speed;
    this._lives = config.lives;
    this._maxLives = config.maxLives || 3;
    this._state = PlayerState.ALIVE;
    this._invulnerabilityTimer = 0;
    this._score = 0;

    this.validateConfig(config);
  }

  /**
   * Validates the configuration parameters
   * @param config - Configuration to validate
   * @throws Error if configuration is invalid
   */
  private validateConfig(config: PlayerConfig): void {
    if (config.width <= 0 || config.height <= 0) {
      throw new Error('Player dimensions must be positive numbers');
    }
    if (config.speed <= 0) {
      throw new Error('Player speed must be a positive number');
    }
    if (config.lives <= 0 || config.lives > this._maxLives) {
      throw new Error(`Lives must be between 1 and ${this._maxLives}`);
    }
  }

  // Getters
  get x(): number { return this._x; }
  get y(): number { return this._y; }
  get width(): number { return this._width; }
  get height(): number { return this._height; }
  get speed(): number { return this._speed; }
  get lives(): number { return this._lives; }
  get state(): PlayerState { return this._state; }
  get score(): number { return this._score; }
  get isAlive(): boolean { return this._state !== PlayerState.DEAD; }

  /**
   * Updates the player's position
   * @param deltaX - Change in x position
   * @param deltaY - Change in y position
   */
  move(deltaX: number, deltaY: number): void {
    this._x += deltaX * this._speed;
    this._y += deltaY * this._speed;
  }

  /**
   * Sets the player's absolute position
   * @param x - New x position
   * @param y - New y position
   */
  setPosition(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  /**
   * Handles player taking damage
   * @returns boolean indicating if the player was damaged
   */
  takeDamage(): boolean {
    if (this._state === PlayerState.INVULNERABLE) {
      return false;
    }

    this._lives--;
    
    if (this._lives <= 0) {
      this._state = PlayerState.DEAD;
    } else {
      this._state = PlayerState.INVULNERABLE;
      this._invulnerabilityTimer = 2000; // 2 seconds of invulnerability
    }

    return true;
  }

  /**
   * Updates the player's state
   * @param deltaTime - Time elapsed since last update in milliseconds
   */
  update(deltaTime: number): void {
    if (this._state === PlayerState.INVULNERABLE) {
      this._invulnerabilityTimer -= deltaTime;
      if (this._invulnerabilityTimer <= 0) {
        this._state = PlayerState.ALIVE;
        this._invulnerabilityTimer = 0;
      }
    }
  }

  /**
   * Adds points to the player's score
   * @param points - Points to add
   */
  addScore(points: number): void {
    if (points < 0) {
      throw new Error('Cannot add negative points');
    }
    this._score += points;
  }

  /**
   * Adds an extra life to the player if below maximum
   * @returns boolean indicating if life was added
   */
  addLife(): boolean {
    if (this._lives < this._maxLives) {
      this._lives++;
      return true;
    }
    return false;
  }

  /**
   * Resets the player to initial state
   * @param config - Optional configuration for reset state
   */
  reset(config?: Partial<PlayerConfig>): void {
    if (config?.x !== undefined) this._x = config.x;
    if (config?.y !== undefined) this._y = config.y;
    if (config?.lives !== undefined) this._lives = config.lives;
    
    this._state = PlayerState.ALIVE;
    this._invulnerabilityTimer = 0;
    this._score = 0;
  }
}