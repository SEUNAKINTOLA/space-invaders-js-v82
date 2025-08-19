/**
 * @file WaveManager.ts
 * @description Manages enemy wave spawning and movement patterns in the game
 */

export interface WaveConfig {
    enemyCount: number;
    speed: number;
    pattern: MovementPattern;
    spawnDelay: number;
    formation: FormationType;
}

export enum MovementPattern {
    HORIZONTAL = 'horizontal',
    ZIGZAG = 'zigzag',
    SINE_WAVE = 'sine_wave',
    V_FORMATION = 'v_formation'
}

export enum FormationType {
    GRID = 'grid',
    LINE = 'line',
    TRIANGLE = 'triangle',
    RANDOM = 'random'
}

export interface EnemySpawnPosition {
    x: number;
    y: number;
}

export class WaveManager {
    private currentWave: number;
    private waveConfigs: WaveConfig[];
    private activeEnemies: Set<string>;
    private canvasWidth: number;
    private canvasHeight: number;
    private timeElapsed: number;

    /**
     * Creates a new WaveManager instance
     * @param canvasWidth - Width of the game canvas
     * @param canvasHeight - Height of the game canvas
     */
    constructor(canvasWidth: number, canvasHeight: number) {
        this.currentWave = 0;
        this.waveConfigs = this.initializeWaveConfigs();
        this.activeEnemies = new Set<string>();
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.timeElapsed = 0;
    }

    /**
     * Initializes predefined wave configurations
     * @returns Array of wave configurations
     */
    private initializeWaveConfigs(): WaveConfig[] {
        return [
            {
                enemyCount: 10,
                speed: 1,
                pattern: MovementPattern.HORIZONTAL,
                spawnDelay: 500,
                formation: FormationType.GRID
            },
            {
                enemyCount: 15,
                speed: 1.5,
                pattern: MovementPattern.ZIGZAG,
                spawnDelay: 400,
                formation: FormationType.V_FORMATION
            },
            // Add more wave configurations as needed
        ];
    }

    /**
     * Updates the wave state
     * @param deltaTime - Time elapsed since last update
     * @returns Array of new enemy positions to spawn
     */
    public update(deltaTime: number): EnemySpawnPosition[] {
        this.timeElapsed += deltaTime;
        
        if (this.shouldSpawnNewWave()) {
            return this.spawnNewWave();
        }

        return [];
    }

    /**
     * Checks if a new wave should be spawned
     * @returns Boolean indicating if new wave should spawn
     */
    private shouldSpawnNewWave(): boolean {
        return this.activeEnemies.size === 0 && 
               this.currentWave < this.waveConfigs.length;
    }

    /**
     * Spawns a new wave of enemies
     * @returns Array of spawn positions for new enemies
     */
    private spawnNewWave(): EnemySpawnPosition[] {
        const config = this.waveConfigs[this.currentWave];
        const positions = this.calculateSpawnPositions(config);
        this.currentWave++;
        return positions;
    }

    /**
     * Calculates spawn positions based on formation type
     * @param config - Wave configuration
     * @returns Array of spawn positions
     */
    private calculateSpawnPositions(config: WaveConfig): EnemySpawnPosition[] {
        switch (config.formation) {
            case FormationType.GRID:
                return this.createGridFormation(config);
            case FormationType.LINE:
                return this.createLineFormation(config);
            case FormationType.TRIANGLE:
                return this.createTriangleFormation(config);
            case FormationType.RANDOM:
                return this.createRandomFormation(config);
            default:
                return this.createGridFormation(config);
        }
    }

    /**
     * Creates a grid formation of enemies
     * @param config - Wave configuration
     * @returns Array of spawn positions
     */
    private createGridFormation(config: WaveConfig): EnemySpawnPosition[] {
        const positions: EnemySpawnPosition[] = [];
        const rows = Math.ceil(Math.sqrt(config.enemyCount));
        const cols = Math.ceil(config.enemyCount / rows);
        const spacing = 60;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (positions.length < config.enemyCount) {
                    positions.push({
                        x: (this.canvasWidth / 2) - ((cols * spacing) / 2) + (col * spacing),
                        y: 50 + (row * spacing)
                    });
                }
            }
        }

        return positions;
    }

    /**
     * Notifies the manager that an enemy has been destroyed
     * @param enemyId - ID of the destroyed enemy
     */
    public onEnemyDestroyed(enemyId: string): void {
        this.activeEnemies.delete(enemyId);
    }

    /**
     * Gets the current wave number
     * @returns Current wave number
     */
    public getCurrentWave(): number {
        return this.currentWave;
    }

    /**
     * Gets the current wave configuration
     * @returns Current wave configuration or null if no more waves
     */
    public getCurrentWaveConfig(): WaveConfig | null {
        return this.currentWave < this.waveConfigs.length 
            ? this.waveConfigs[this.currentWave] 
            : null;
    }

    /**
     * Resets the wave manager to initial state
     */
    public reset(): void {
        this.currentWave = 0;
        this.activeEnemies.clear();
        this.timeElapsed = 0;
    }
}