/**
 * @file ScoreManager.ts
 * @description Service responsible for managing game scores and score-related state
 */

/**
 * Interface defining the structure of a high score entry
 */
interface HighScoreEntry {
    score: number;
    playerName: string;
    date: Date;
}

/**
 * Interface for score-related game events
 */
interface ScoreEvent {
    type: 'enemy_destroyed' | 'powerup_collected' | 'wave_completed';
    points: number;
    multiplier?: number;
}

/**
 * Manages game scoring system and high scores
 */
export class ScoreManager {
    private static instance: ScoreManager;
    
    private currentScore: number = 0;
    private highScores: HighScoreEntry[] = [];
    private scoreMultiplier: number = 1;
    private readonly MAX_HIGH_SCORES: number = 10;
    
    // Score values for different actions
    private readonly SCORE_VALUES = {
        ENEMY_DESTROYED: 100,
        POWERUP_COLLECTED: 50,
        WAVE_COMPLETED: 1000
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
     * Adds points to the current score
     * @param points - Number of points to add
     */
    public addPoints(points: number): void {
        this.currentScore += points * this.scoreMultiplier;
        this.checkHighScore();
    }

    /**
     * Handles score events from game actions
     * @param event - Score event containing type and points
     */
    public handleScoreEvent(event: ScoreEvent): void {
        let points = event.points;
        
        switch (event.type) {
            case 'enemy_destroyed':
                points = this.SCORE_VALUES.ENEMY_DESTROYED;
                break;
            case 'powerup_collected':
                points = this.SCORE_VALUES.POWERUP_COLLECTED;
                break;
            case 'wave_completed':
                points = this.SCORE_VALUES.WAVE_COMPLETED;
                break;
        }

        this.addPoints(points);
    }

    /**
     * Gets the current score
     */
    public getCurrentScore(): number {
        return this.currentScore;
    }

    /**
     * Sets the score multiplier
     * @param multiplier - New score multiplier value
     */
    public setMultiplier(multiplier: number): void {
        if (multiplier < 1) {
            throw new Error('Score multiplier cannot be less than 1');
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
     * Gets the current high scores
     */
    public getHighScores(): HighScoreEntry[] {
        return [...this.highScores];
    }

    /**
     * Adds a new high score entry
     * @param playerName - Name of the player
     */
    public addHighScore(playerName: string): void {
        const newEntry: HighScoreEntry = {
            score: this.currentScore,
            playerName,
            date: new Date()
        };

        this.highScores.push(newEntry);
        this.highScores.sort((a, b) => b.score - a.score);
        
        if (this.highScores.length > this.MAX_HIGH_SCORES) {
            this.highScores = this.highScores.slice(0, this.MAX_HIGH_SCORES);
        }

        this.saveHighScores();
    }

    /**
     * Checks if current score is a high score
     */
    private checkHighScore(): boolean {
        if (this.highScores.length < this.MAX_HIGH_SCORES) {
            return true;
        }
        return this.currentScore > this.highScores[this.highScores.length - 1].score;
    }

    /**
     * Loads high scores from local storage
     */
    private loadHighScores(): void {
        try {
            const savedScores = localStorage.getItem('highScores');
            if (savedScores) {
                this.highScores = JSON.parse(savedScores);
            }
        } catch (error) {
            console.error('Error loading high scores:', error);
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
            console.error('Error saving high scores:', error);
        }
    }
}