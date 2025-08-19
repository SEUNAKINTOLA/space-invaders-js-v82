/**
 * @file ScoreManager.ts
 * @description Manages and tracks game scoring system for Space Invaders
 */

/**
 * Represents different types of scoring events in the game
 */
export enum ScoreEvent {
  ENEMY_DESTROYED = 'ENEMY_DESTROYED',
  BONUS_COLLECTED = 'BONUS_COLLECTED',
  LEVEL_COMPLETED = 'LEVEL_COMPLETED',
  PERFECT_WAVE = 'PERFECT_WAVE'
}

/**
 * Score configuration for different game events
 */
interface ScoreConfig {
  readonly [ScoreEvent.ENEMY_DESTROYED]: number;
  readonly [ScoreEvent.BONUS_COLLECTED]: number;
  readonly [ScoreEvent.LEVEL_COMPLETED]: number;
  readonly [ScoreEvent.PERFECT_WAVE]: number;
}

/**
 * Represents a high score entry
 */
interface HighScoreEntry {
  score: number;
  playerName: string;
  date: Date;
}

/**
 * Manages game scoring system including current score, high scores,
 * and score multipliers
 */
export class ScoreManager {
  private static instance: ScoreManager;
  private currentScore: number = 0;
  private highScores: HighScoreEntry[] = [];
  private scoreMultiplier: number = 1;
  private readonly maxHighScores: number = 10;

  private readonly scoreConfig: ScoreConfig = {
    [ScoreEvent.ENEMY_DESTROYED]: 100,
    [ScoreEvent.BONUS_COLLECTED]: 500,
    [ScoreEvent.LEVEL_COMPLETED]: 1000,
    [ScoreEvent.PERFECT_WAVE]: 2000
  };

  private constructor() {
    this.loadHighScores();
  }

  /**
   * Gets the singleton instance of ScoreManager
   */
  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  /**
   * Adds points to the current score based on the event type
   * @param event - The scoring event type
   * @throws Error if invalid event type is provided
   */
  public addScore(event: ScoreEvent): void {
    if (!(event in this.scoreConfig)) {
      throw new Error(`Invalid score event: ${event}`);
    }

    const points = this.scoreConfig[event] * this.scoreMultiplier;
    this.currentScore += points;
  }

  /**
   * Gets the current score
   */
  public getCurrentScore(): number {
    return this.currentScore;
  }

  /**
   * Sets the score multiplier for bonus scoring
   * @param multiplier - The multiplier value (must be >= 1)
   * @throws Error if invalid multiplier value is provided
   */
  public setScoreMultiplier(multiplier: number): void {
    if (multiplier < 1) {
      throw new Error('Score multiplier must be greater than or equal to 1');
    }
    this.scoreMultiplier = multiplier;
  }

  /**
   * Resets the current score to zero
   */
  public resetScore(): void {
    this.currentScore = 0;
    this.scoreMultiplier = 1;
  }

  /**
   * Adds a new high score entry if it qualifies
   * @param playerName - Name of the player
   * @returns boolean indicating if the score was added to high scores
   */
  public submitHighScore(playerName: string): boolean {
    if (this.currentScore <= 0) {
      return false;
    }

    const newEntry: HighScoreEntry = {
      score: this.currentScore,
      playerName: playerName.trim(),
      date: new Date()
    };

    this.highScores.push(newEntry);
    this.highScores.sort((a, b) => b.score - a.score);
    
    if (this.highScores.length > this.maxHighScores) {
      this.highScores = this.highScores.slice(0, this.maxHighScores);
    }

    this.saveHighScores();
    return this.isHighScore(this.currentScore);
  }

  /**
   * Checks if a score qualifies as a high score
   * @param score - The score to check
   */
  public isHighScore(score: number): boolean {
    return (
      this.highScores.length < this.maxHighScores ||
      score > this.highScores[this.highScores.length - 1].score
    );
  }

  /**
   * Gets the current high scores
   */
  public getHighScores(): ReadonlyArray<HighScoreEntry> {
    return [...this.highScores];
  }

  /**
   * Loads high scores from local storage
   */
  private loadHighScores(): void {
    try {
      const savedScores = localStorage.getItem('highScores');
      if (savedScores) {
        this.highScores = JSON.parse(savedScores).map((score: any) => ({
          ...score,
          date: new Date(score.date)
        }));
      }
    } catch (error) {
      console.error('Failed to load high scores:', error);
      this.highScores = [];
    }
  }

  /**
   * Saves high scores to local storage
   */
  private saveHighScores(): void {
    try {
      localStorage.setItem('highScores', JSON.stringify(this.highScores));
    } catch (error) {
      console.error('Failed to save high scores:', error);
    }
  }
}

export default ScoreManager;