/**
 * @file Score.ts
 * @description Score model class for tracking and managing game scores
 */

/**
 * Interface defining the structure of score data
 */
interface IScoreData {
    value: number;
    playerName: string;
    timestamp: Date;
    level?: number;
}

/**
 * Represents a game score with associated metadata
 */
export class Score {
    private readonly _value: number;
    private readonly _playerName: string;
    private readonly _timestamp: Date;
    private readonly _level: number;

    /**
     * Creates a new Score instance
     * @param value - The numeric score value
     * @param playerName - Name of the player who achieved the score
     * @param level - Optional level number where the score was achieved
     */
    constructor(value: number, playerName: string, level: number = 1) {
        // Validate inputs
        if (value < 0) {
            throw new Error('Score value cannot be negative');
        }
        if (!playerName || playerName.trim().length === 0) {
            throw new Error('Player name cannot be empty');
        }
        if (level < 1) {
            throw new Error('Level must be greater than 0');
        }

        this._value = Math.floor(value); // Ensure integer value
        this._playerName = playerName.trim();
        this._timestamp = new Date();
        this._level = level;
    }

    /**
     * Gets the score value
     */
    get value(): number {
        return this._value;
    }

    /**
     * Gets the player name
     */
    get playerName(): string {
        return this._playerName;
    }

    /**
     * Gets the timestamp when the score was created
     */
    get timestamp(): Date {
        return new Date(this._timestamp);
    }

    /**
     * Gets the level number
     */
    get level(): number {
        return this._level;
    }

    /**
     * Creates a new Score instance with an updated value
     * @param additionalPoints - Points to add to the current score
     * @returns A new Score instance with the updated value
     */
    public addPoints(additionalPoints: number): Score {
        if (additionalPoints < 0) {
            throw new Error('Additional points cannot be negative');
        }
        return new Score(
            this._value + additionalPoints,
            this._playerName,
            this._level
        );
    }

    /**
     * Compares this score with another score
     * @param other - Score to compare with
     * @returns number indicating comparison result (-1, 0, 1)
     */
    public compareTo(other: Score): number {
        if (!(other instanceof Score)) {
            throw new Error('Can only compare with another Score instance');
        }
        return this._value === other.value
            ? 0
            : this._value > other.value
            ? 1
            : -1;
    }

    /**
     * Converts the score to a plain object
     * @returns IScoreData representation of the score
     */
    public toJSON(): IScoreData {
        return {
            value: this._value,
            playerName: this._playerName,
            timestamp: this._timestamp,
            level: this._level,
        };
    }

    /**
     * Creates a Score instance from a plain object
     * @param data - Score data object
     * @returns New Score instance
     */
    public static fromJSON(data: IScoreData): Score {
        return new Score(
            data.value,
            data.playerName,
            data.level || 1
        );
    }

    /**
     * Returns a formatted string representation of the score
     */
    public toString(): string {
        return `Score: ${this._value} | Player: ${this._playerName} | Level: ${this._level}`;
    }
}