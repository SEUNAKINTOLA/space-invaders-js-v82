/**
 * @file Player.ts
 * @description Player entity model for Space Invaders game
 */

/**
 * Represents the movement direction of the player
 */
export enum PlayerMovementDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE'
}

/**
 * Interface defining the player's state
 */
export interface IPlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lives: number;
  isAlive: boolean;
  score: number;
  movementDirection: PlayerMovementDirection;
}

/**
 * Player class representing the main controllable entity in the game
 */
export class Player {
  private state: IPlayerState;
  private readonly MIN_X: number = 0;
  private readonly MAX_X: number;
  
  /**
   * Creates a new Player instance
   * @param canvasWidth - The width of the game canvas
   * @param canvasHeight - The height of the game canvas
   */
  constructor(canvasWidth: number, canvasHeight: number) {
    this.MAX_X = canvasWidth;
    
    this.state = {
      x: canvasWidth / 2, // Start at center
      y: canvasHeight - 50, // Position near bottom
      width: 50, // Default player width
      height: 30, // Default player height
      speed: 5, // Default movement speed
      lives: 3, // Starting lives
      isAlive: true,
      score: 0,
      movementDirection: PlayerMovementDirection.NONE
    };
  }

  /**
   * Updates the player's position based on current movement direction
   * @returns void
   */
  public update(): void {
    switch (this.state.movementDirection) {
      case PlayerMovementDirection.LEFT:
        this.moveLeft();
        break;
      case PlayerMovementDirection.RIGHT:
        this.moveRight();
        break;
      default:
        break;
    }
  }

  /**
   * Moves the player left while respecting boundaries
   */
  private moveLeft(): void {
    const newX = this.state.x - this.state.speed;
    this.state.x = Math.max(this.MIN_X, newX);
  }

  /**
   * Moves the player right while respecting boundaries
   */
  private moveRight(): void {
    const newX = this.state.x + this.state.speed;
    this.state.x = Math.min(this.MAX_X - this.state.width, newX);
  }

  /**
   * Sets the player's movement direction
   * @param direction - The direction to move
   */
  public setMovementDirection(direction: PlayerMovementDirection): void {
    this.state.movementDirection = direction;
  }

  /**
   * Handles player taking damage
   * @returns boolean - Whether the player is still alive
   */
  public takeDamage(): boolean {
    this.state.lives--;
    this.state.isAlive = this.state.lives > 0;
    return this.state.isAlive;
  }

  /**
   * Adds points to the player's score
   * @param points - Number of points to add
   */
  public addScore(points: number): void {
    this.state.score += points;
  }

  /**
   * Gets the current position of the player
   * @returns Object containing x and y coordinates
   */
  public getPosition(): { x: number; y: number } {
    return {
      x: this.state.x,
      y: this.state.y
    };
  }

  /**
   * Gets the current dimensions of the player
   * @returns Object containing width and height
   */
  public getDimensions(): { width: number; height: number } {
    return {
      width: this.state.width,
      height: this.state.height
    };
  }

  /**
   * Gets the current player state
   * @returns The complete player state
   */
  public getState(): Readonly<IPlayerState> {
    return { ...this.state };
  }

  /**
   * Checks if the player is still alive
   * @returns boolean indicating if player is alive
   */
  public isAlive(): boolean {
    return this.state.isAlive;
  }

  /**
   * Gets the current score
   * @returns The player's current score
   */
  public getScore(): number {
    return this.state.score;
  }

  /**
   * Gets the remaining lives
   * @returns Number of lives remaining
   */
  public getLives(): number {
    return this.state.lives;
  }

  /**
   * Resets the player to initial state
   */
  public reset(): void {
    this.state = {
      ...this.state,
      lives: 3,
      isAlive: true,
      score: 0,
      movementDirection: PlayerMovementDirection.NONE
    };
  }
}