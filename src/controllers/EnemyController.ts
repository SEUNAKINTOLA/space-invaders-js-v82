/**
 * @file EnemyController.ts
 * @description Controls enemy wave patterns, spawning, and movement behaviors in the game
 */

type Vector2D = {
    x: number;
    y: number;
};

type WaveConfig = {
    enemyCount: number;
    formation: FormationType;
    movementPattern: MovementPattern;
    spawnDelay: number;
    difficulty: number;
};

enum FormationType {
    GRID,
    V_SHAPE,
    CIRCLE,
    RANDOM
}

enum MovementPattern {
    SIDE_TO_SIDE,
    SINE_WAVE,
    DIVE_BOMB,
    SPIRAL
}

/**
 * Controls enemy behavior, spawning, and wave patterns
 */
export class EnemyController {
    private enemies: Enemy[] = [];
    private currentWave: number = 0;
    private spawnTimer: number = 0;
    private readonly canvas: { width: number; height: number };
    private readonly waveConfigs: WaveConfig[];

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvas = {
            width: canvasWidth,
            height: canvasHeight
        };
        this.waveConfigs = this.initializeWaveConfigs();
    }

    /**
     * Updates all enemies and handles wave management
     * @param deltaTime Time elapsed since last update
     */
    public update(deltaTime: number): void {
        this.updateEnemies(deltaTime);
        this.handleWaveSpawning(deltaTime);
        this.removeDeadEnemies();
    }

    /**
     * Gets all active enemies
     * @returns Array of active enemies
     */
    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    /**
     * Spawns a new wave of enemies based on current wave configuration
     */
    private spawnWave(): void {
        const config = this.waveConfigs[this.currentWave % this.waveConfigs.length];
        const positions = this.calculateFormationPositions(config);

        positions.forEach((position, index) => {
            setTimeout(() => {
                this.spawnEnemy(position, config);
            }, index * config.spawnDelay);
        });

        this.currentWave++;
    }

    /**
     * Updates all enemy positions and behaviors
     * @param deltaTime Time elapsed since last update
     */
    private updateEnemies(deltaTime: number): void {
        this.enemies.forEach(enemy => {
            const movement = this.calculateEnemyMovement(
                enemy,
                this.waveConfigs[this.currentWave % this.waveConfigs.length].movementPattern,
                deltaTime
            );
            enemy.position.x += movement.x;
            enemy.position.y += movement.y;
        });
    }

    /**
     * Calculates enemy movement based on pattern
     * @param enemy Enemy to calculate movement for
     * @param pattern Movement pattern to follow
     * @param deltaTime Time elapsed since last update
     * @returns Movement vector
     */
    private calculateEnemyMovement(
        enemy: Enemy,
        pattern: MovementPattern,
        deltaTime: number
    ): Vector2D {
        switch (pattern) {
            case MovementPattern.SIDE_TO_SIDE:
                return this.sideToSideMovement(enemy, deltaTime);
            case MovementPattern.SINE_WAVE:
                return this.sineWaveMovement(enemy, deltaTime);
            case MovementPattern.DIVE_BOMB:
                return this.diveBombMovement(enemy, deltaTime);
            case MovementPattern.SPIRAL:
                return this.spiralMovement(enemy, deltaTime);
            default:
                return { x: 0, y: 0 };
        }
    }

    /**
     * Calculates formation positions based on configuration
     * @param config Wave configuration
     * @returns Array of spawn positions
     */
    private calculateFormationPositions(config: WaveConfig): Vector2D[] {
        const positions: Vector2D[] = [];
        const margin = 50; // Margin from canvas edges

        switch (config.formation) {
            case FormationType.GRID:
                const columns = Math.ceil(Math.sqrt(config.enemyCount));
                const rows = Math.ceil(config.enemyCount / columns);
                const spacing = {
                    x: (this.canvas.width - margin * 2) / (columns - 1),
                    y: 100
                };

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < columns; col++) {
                        if (positions.length < config.enemyCount) {
                            positions.push({
                                x: margin + col * spacing.x,
                                y: margin + row * spacing.y
                            });
                        }
                    }
                }
                break;
            // Additional formation patterns can be implemented here
        }

        return positions;
    }

    /**
     * Removes dead enemies from the array
     */
    private removeDeadEnemies(): void {
        this.enemies = this.enemies.filter(enemy => enemy.isAlive());
    }

    /**
     * Handles wave spawning timing
     * @param deltaTime Time elapsed since last update
     */
    private handleWaveSpawning(deltaTime: number): void {
        if (this.enemies.length === 0) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= 2000) { // 2 seconds between waves
                this.spawnWave();
                this.spawnTimer = 0;
            }
        }
    }

    /**
     * Initializes wave configurations
     * @returns Array of wave configurations
     */
    private initializeWaveConfigs(): WaveConfig[] {
        return [
            {
                enemyCount: 10,
                formation: FormationType.GRID,
                movementPattern: MovementPattern.SIDE_TO_SIDE,
                spawnDelay: 200,
                difficulty: 1
            },
            {
                enemyCount: 15,
                formation: FormationType.GRID,
                movementPattern: MovementPattern.SINE_WAVE,
                spawnDelay: 150,
                difficulty: 2
            }
            // Additional wave configurations can be added here
        ];
    }

    // Movement pattern implementations
    private sideToSideMovement(enemy: Enemy, deltaTime: number): Vector2D {
        // Implementation for side-to-side movement
        return {
            x: Math.sin(Date.now() * 0.001) * 2,
            y: 0.5
        };
    }

    private sineWaveMovement(enemy: Enemy, deltaTime: number): Vector2D {
        // Implementation for sine wave movement
        return {
            x: Math.cos(enemy.position.y * 0.02) * 2,
            y: 1
        };
    }

    private diveBombMovement(enemy: Enemy, deltaTime: number): Vector2D {
        // Implementation for dive bomb movement
        return {
            x: 0,
            y: 2
        };
    }

    private spiralMovement(enemy: Enemy, deltaTime: number): Vector2D {
        // Implementation for spiral movement
        const time = Date.now() * 0.001;
        return {
            x: Math.cos(time) * 2,
            y: Math.sin(time) * 2
        };
    }
}

// Temporary Enemy class (should be imported from Enemy.ts in actual implementation)
class Enemy {
    public position: Vector2D;
    private health: number;

    constructor(position: Vector2D) {
        this.position = position;
        this.health = 100;
    }

    public isAlive(): boolean {
        return this.health > 0;
    }
}