/**
 * @file HealthBar.ts
 * @description Health bar UI component for displaying player health status
 */

export interface HealthBarConfig {
    maxHealth: number;
    width: number;
    height: number;
    x: number;
    y: number;
    borderColor?: string;
    fillColor?: string;
    backgroundColor?: string;
}

export class HealthBar {
    private readonly maxHealth: number;
    private currentHealth: number;
    private readonly width: number;
    private readonly height: number;
    private readonly x: number;
    private readonly y: number;
    private readonly borderColor: string;
    private readonly fillColor: string;
    private readonly backgroundColor: string;

    /**
     * Creates a new HealthBar instance
     * @param config - Configuration options for the health bar
     */
    constructor(config: HealthBarConfig) {
        this.maxHealth = config.maxHealth;
        this.currentHealth = config.maxHealth;
        this.width = config.width;
        this.height = config.height;
        this.x = config.x;
        this.y = config.y;
        this.borderColor = config.borderColor || '#FFFFFF';
        this.fillColor = config.fillColor || '#FF0000';
        this.backgroundColor = config.backgroundColor || '#333333';
    }

    /**
     * Updates the current health value
     * @param health - New health value
     * @throws Error if health value is invalid
     */
    public updateHealth(health: number): void {
        if (health < 0 || health > this.maxHealth) {
            throw new Error(`Health value must be between 0 and ${this.maxHealth}`);
        }
        this.currentHealth = health;
    }

    /**
     * Gets the current health percentage
     * @returns Percentage of health remaining
     */
    public getHealthPercentage(): number {
        return (this.currentHealth / this.maxHealth) * 100;
    }

    /**
     * Renders the health bar on the canvas
     * @param ctx - Canvas rendering context
     */
    public render(ctx: CanvasRenderingContext2D): void {
        // Save current context state
        ctx.save();

        // Draw background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health fill
        const fillWidth = (this.currentHealth / this.maxHealth) * this.width;
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, fillWidth, this.height);

        // Draw border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Restore context state
        ctx.restore();
    }

    /**
     * Checks if health is at critical level
     * @returns boolean indicating if health is critical
     */
    public isCritical(): boolean {
        return this.getHealthPercentage() <= 25;
    }

    /**
     * Gets the current health value
     * @returns Current health value
     */
    public getCurrentHealth(): number {
        return this.currentHealth;
    }

    /**
     * Gets the maximum health value
     * @returns Maximum health value
     */
    public getMaxHealth(): number {
        return this.maxHealth;
    }

    /**
     * Resets health to maximum value
     */
    public reset(): void {
        this.currentHealth = this.maxHealth;
    }

    /**
     * Updates the position of the health bar
     * @param x - New x coordinate
     * @param y - New y coordinate
     */
    public updatePosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}