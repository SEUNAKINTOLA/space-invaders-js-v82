/**
 * @file Player.ts
 * @description Player entity model for Space Invaders game
 */

/**
 * Represents the possible movement directions for the player
 */
export enum PlayerMovementDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE'
}

/**
 * Interface defining the player's state
 */
export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  isAlive: boolean;
  score: number;
}

/**
 * Player class representing the main controllable entity in the game
 */
export class Player {
  private readonly maxHealth: number = 100;
  private readonly defaultSpeed: number = 5;
  private readonly minX: number = 0;
  private readonly maxX: number = 800; // Default canvas width

  private state: PlayerState;

  /**
   * Creates a new Player instance
   * @param x - Initial x position
   * @param y - Initial y position
   * @param width - Player width
   * @param height - Player height
   */
  constructor(
    x: number = 400,
    y: number = 550,
    width: number = 50,
    height: number = 50
  ) {
    this.state = {
      x,
      y,
      width,
      height,
      speed: this.defaultSpeed,
      health: this.maxHealth,
      isAlive: true,
      score: 0
    };
  }

  /**
   * Updates the player's position based on the movement direction
   * @param direction - Direction of movement
   * @param deltaTime - Time elapsed since last update
   */
  public move(direction: PlayerMovementDirection, deltaTime: number): void {
    const movement = this.calculateMovement(direction, deltaTime);
    const newX = this.state.x + movement;

    this.state.x = this.clampPosition(newX);
  }

  /**
   * Applies damage to the player
   * @param damage - Amount of damage to apply
   * @returns boolean indicating if the player is still alive
   */
  public takeDamage(damage: number): boolean {
    if (!this.state.isAlive) return false;

    this.state.health = Math.max(0, this.state.health - damage);
    
    if (this.state.health <= 0) {
      this.state.isAlive = false;
    }

    return this.state.isAlive;
  }

  /**
   * Adds points to the player's score
   * @param points - Points to add
   */
  public addScore(points: number): void {
    if (points < 0) return;
    this.state.score += points;
  }

  /**
   * Sets the player's movement speed
   * @param speed - New speed value
   */
  public setSpeed(speed: number): void {
    if (speed <= 0) return;
    this.state.speed = speed;
  }

  /**
   * Returns the current player state
   */
  public getState(): PlayerState {
    return { ...this.state };
  }

  /**
   * Resets the player to initial state
   */
  public reset(): void {
    this.state = {
      ...this.state,
      health: this.maxHealth,
      isAlive: true,
      score: 0,
      speed: this.defaultSpeed
    };
  }

  /**
   * Calculates movement distance based on direction and time
   */
  private calculateMovement(direction: PlayerMovementDirection, deltaTime: number): number {
    const normalizedDelta = deltaTime / 1000; // Convert to seconds

    switch (direction) {
      case PlayerMovementDirection.LEFT:
        return -this.state.speed * normalizedDelta;
      case PlayerMovementDirection.RIGHT:
        return this.state.speed * normalizedDelta;
      default:
        return 0;
    }
  }

  /**
   * Ensures the player stays within the game boundaries
   */
  private clampPosition(newX: number): number {
    const minBoundary = this.minX;
    const maxBoundary = this.maxX - this.state.width;

    return Math.max(minBoundary, Math.min(maxBoundary, newX));
  }
}