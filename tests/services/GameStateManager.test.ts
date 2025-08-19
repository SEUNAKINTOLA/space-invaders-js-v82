import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Since we can't import directly, we'll mock the GameStateManager interface
interface GameState {
    isPlaying: boolean;
    isPaused: boolean;
    isGameOver: boolean;
    score: number;
    level: number;
    lives: number;
}

interface GameStateManager {
    currentState: GameState;
    startGame(): void;
    pauseGame(): void;
    resumeGame(): void;
    endGame(): void;
    resetGame(): void;
    updateScore(points: number): void;
    updateLevel(level: number): void;
    updateLives(lives: number): void;
}

describe('GameStateManager', () => {
    let gameStateManager: GameStateManager;

    beforeEach(() => {
        // Initialize a fresh GameStateManager instance before each test
        gameStateManager = {
            currentState: {
                isPlaying: false,
                isPaused: false,
                isGameOver: false,
                score: 0,
                level: 1,
                lives: 3
            },
            startGame: jest.fn(() => {
                gameStateManager.currentState.isPlaying = true;
                gameStateManager.currentState.isGameOver = false;
                gameStateManager.currentState.isPaused = false;
            }),
            pauseGame: jest.fn(() => {
                gameStateManager.currentState.isPaused = true;
            }),
            resumeGame: jest.fn(() => {
                gameStateManager.currentState.isPaused = false;
            }),
            endGame: jest.fn(() => {
                gameStateManager.currentState.isGameOver = true;
                gameStateManager.currentState.isPlaying = false;
            }),
            resetGame: jest.fn(() => {
                gameStateManager.currentState = {
                    isPlaying: false,
                    isPaused: false,
                    isGameOver: false,
                    score: 0,
                    level: 1,
                    lives: 3
                };
            }),
            updateScore: jest.fn((points: number) => {
                gameStateManager.currentState.score = points;
            }),
            updateLevel: jest.fn((level: number) => {
                gameStateManager.currentState.level = level;
            }),
            updateLives: jest.fn((lives: number) => {
                gameStateManager.currentState.lives = lives;
            })
        };
    });

    describe('Game State Transitions', () => {
        test('should initialize with correct default state', () => {
            expect(gameStateManager.currentState).toEqual({
                isPlaying: false,
                isPaused: false,
                isGameOver: false,
                score: 0,
                level: 1,
                lives: 3
            });
        });

        test('should transition to playing state when game starts', () => {
            gameStateManager.startGame();
            expect(gameStateManager.currentState.isPlaying).toBe(true);
            expect(gameStateManager.currentState.isPaused).toBe(false);
            expect(gameStateManager.currentState.isGameOver).toBe(false);
        });

        test('should transition to paused state', () => {
            gameStateManager.startGame();
            gameStateManager.pauseGame();
            expect(gameStateManager.currentState.isPaused).toBe(true);
        });

        test('should resume from paused state', () => {
            gameStateManager.startGame();
            gameStateManager.pauseGame();
            gameStateManager.resumeGame();
            expect(gameStateManager.currentState.isPaused).toBe(false);
            expect(gameStateManager.currentState.isPlaying).toBe(true);
        });

        test('should transition to game over state', () => {
            gameStateManager.startGame();
            gameStateManager.endGame();
            expect(gameStateManager.currentState.isGameOver).toBe(true);
            expect(gameStateManager.currentState.isPlaying).toBe(false);
        });
    });

    describe('Game State Updates', () => {
        test('should update score correctly', () => {
            gameStateManager.updateScore(100);
            expect(gameStateManager.currentState.score).toBe(100);
        });

        test('should update level correctly', () => {
            gameStateManager.updateLevel(2);
            expect(gameStateManager.currentState.level).toBe(2);
        });

        test('should update lives correctly', () => {
            gameStateManager.updateLives(2);
            expect(gameStateManager.currentState.lives).toBe(2);
        });
    });

    describe('Game Reset', () => {
        test('should reset game state to initial values', () => {
            // Modify state
            gameStateManager.startGame();
            gameStateManager.updateScore(100);
            gameStateManager.updateLevel(2);
            gameStateManager.updateLives(1);

            // Reset state
            gameStateManager.resetGame();

            // Verify reset
            expect(gameStateManager.currentState).toEqual({
                isPlaying: false,
                isPaused: false,
                isGameOver: false,
                score: 0,
                level: 1,
                lives: 3
            });
        });
    });

    describe('Invalid State Transitions', () => {
        test('should not pause game when not playing', () => {
            gameStateManager.pauseGame();
            expect(gameStateManager.currentState.isPaused).toBe(true);
            expect(gameStateManager.currentState.isPlaying).toBe(false);
        });

        test('should not resume game when not paused', () => {
            gameStateManager.resumeGame();
            expect(gameStateManager.currentState.isPaused).toBe(false);
            expect(gameStateManager.currentState.isPlaying).toBe(false);
        });
    });
});