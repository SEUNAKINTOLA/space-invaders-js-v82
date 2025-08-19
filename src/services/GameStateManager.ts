/**
 * @file GameStateManager.ts
 * @description Manages game state, scoring, and game flow for Space Invaders
 */

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE'
}

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  enemiesDefeated: number;
  accuracy: number;
  shotsFired: number;
  shotsHit: number;
}

export interface GameStateChangeListener {
  onGameStateChange: (newState: GameState) => void;
}

/**
 * Manages the game state, scoring, and related statistics
 */
export class GameStateManager {
  private static instance: GameStateManager;
  private currentState: GameState = GameState.MENU;
  private listeners: GameStateChangeListener[] = [];
  private stats: GameStats;

  private constructor() {
    this.stats = this.getInitialStats();
    this.loadHighScore();
  }

  /**
   * Gets the singleton instance of GameStateManager
   */
  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  /**
   * Initialize game stats with default values
   */
  private getInitialStats(): GameStats {
    return {
      score: 0,
      highScore: 0,
      level: 1,
      lives: 3,
      enemiesDefeated: 0,
      accuracy: 0,
      shotsFired: 0,
      shotsHit: 0
    };
  }

  /**
   * Load high score from local storage
   */
  private loadHighScore(): void {
    try {
      const savedHighScore = localStorage.getItem('highScore');
      if (savedHighScore) {
        this.stats.highScore = parseInt(savedHighScore, 10);
      }
    } catch (error) {
      console.warn('Failed to load high score:', error);
    }
  }

  /**
   * Save high score to local storage
   */
  private saveHighScore(): void {
    try {
      localStorage.setItem('highScore', this.stats.highScore.toString());
    } catch (error) {
      console.warn('Failed to save high score:', error);
    }
  }

  /**
   * Add points to the current score
   */
  public addScore(points: number): void {
    this.stats.score += points;
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      this.saveHighScore();
    }
  }

  /**
   * Register a state change listener
   */
  public addStateChangeListener(listener: GameStateChangeListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a state change listener
   */
  public removeStateChangeListener(listener: GameStateChangeListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Change the current game state
   */
  public setState(newState: GameState): void {
    if (this.currentState !== newState) {
      this.currentState = newState;
      this.notifyListeners();
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener.onGameStateChange(this.currentState);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  /**
   * Get current game state
   */
  public getCurrentState(): GameState {
    return this.currentState;
  }

  /**
   * Get current game statistics
   */
  public getStats(): GameStats {
    return { ...this.stats };
  }

  /**
   * Record a successful hit
   */
  public recordHit(): void {
    this.stats.shotsHit++;
    this.updateAccuracy();
  }

  /**
   * Record a shot fired
   */
  public recordShotFired(): void {
    this.stats.shotsFired++;
    this.updateAccuracy();
  }

  /**
   * Update accuracy calculation
   */
  private updateAccuracy(): void {
    this.stats.accuracy = this.stats.shotsFired === 0 ? 0 :
      (this.stats.shotsHit / this.stats.shotsFired) * 100;
  }

  /**
   * Increment the current level
   */
  public incrementLevel(): void {
    this.stats.level++;
  }

  /**
   * Decrement remaining lives
   */
  public decrementLives(): void {
    this.stats.lives--;
    if (this.stats.lives <= 0) {
      this.setState(GameState.GAME_OVER);
    }
  }

  /**
   * Reset game state for a new game
   */
  public resetGame(): void {
    this.stats = this.getInitialStats();
    this.stats.highScore = this.getStats().highScore; // Preserve high score
    this.setState(GameState.PLAYING);
  }

  /**
   * Record an enemy defeat
   */
  public recordEnemyDefeated(): void {
    this.stats.enemiesDefeated++;
  }

  /**
   * Check if game is active
   */
  public isGameActive(): boolean {
    return this.currentState === GameState.PLAYING;
  }
}