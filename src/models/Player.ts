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
  canShoot: boolean;
  lastShotTime: number;
  shootCooldown: number;
}

/**
 * Represents a projectile fired by the player
 */
export interface IProjectile {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

/**
 * Player class representing the main controllable entity in the game
 */
export class Player {
  private state: IPlayerState;
  private readonly MIN_X: number = 0;
  private readonly MAX_X: number;
  private readonly SHOOT_COOLDOWN: number = 250; // Cooldown in milliseconds
  
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
      movementDirection: PlayerMovementDirection.NONE,
      canShoot: true,
      lastShotTime: 0,
      shootCooldown: this.SHOOT_COOLDOWN
    };
  }

  /**
   * Updates the player's position and shooting state
   * @returns void
   */
  public update(): void {
    // Update movement
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

    // Update shooting cooldown
    const currentTime = Date.now();
    if (!this.state.canShoot && 
        currentTime - this.state.lastShotTime >= this.state.shootCooldown) {
      this.state.canShoot = true;
    }
  }

  /**
   * Attempts to fire a projectile
   * @returns IProjectile | null - The created projectile or null if cannot shoot
   */
  public shoot(): IProjectile | null {
    if (!this.state.canShoot || !this.state.isAlive) {
      return null;
    }

    this.state.canShoot = false;
    this.state.lastShotTime = Date.now();

    // Create and return a new projectile
    return {
      x: this.state.x + (this.state.width / 2) - 2, // Center of player
      y: this.state.y, // Top of player
      width: 4, // Projectile width
      height: 10, // Projectile height
      speed: 7 // Projectile speed
    };
  }

  /**
   * Checks if the player can currently shoot
   * @returns boolean indicating if player can shoot
   */
  public canShoot(): boolean {
    return this.state.canShoot && this.state.isAlive;
  }

  // ... [Previous movement methods remain unchanged]
  private moveLeft(): void {
    const newX = this.state.x - this.state.speed;
    this.state.x = Math.max(this.MIN_X, newX);
  }

  private moveRight(): void {
    const newX = this.state.x + this.state.speed;
    this.state.x = Math.min(this.MAX_X - this.state.width, newX);
  }

  public setMovementDirection(direction: PlayerMovementDirection): void {
    this.state.movementDirection = direction;
  }

  // ... [Previous state management methods remain unchanged]
  public takeDamage(): boolean {
    this.state.lives--;
    this.state.isAlive = this.state.lives > 0;
    return this.state.isAlive;
  }

  public addScore(points: number): void {
    this.state.score += points;
  }

  public getPosition(): { x: number; y: number } {
    return {
      x: this.state.x,
      y: this.state.y
    };
  }

  public getDimensions(): { width: number; height: number } {
    return {
      width: this.state.width,
      height: this.state.height
    };
  }

  public getState(): Readonly<IPlayerState> {
    return { ...this.state };
  }

  public isAlive(): boolean {
    return this.state.isAlive;
  }

  public getScore(): number {
    return this.state.score;
  }

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
      movementDirection: PlayerMovementDirection.NONE,
      canShoot: true,
      lastShotTime: 0
    };
  }
}