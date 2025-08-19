/**
 * @file PlayerController.ts
 * @description Controls player movement and shooting mechanics in the Space Invaders game
 */

import { Player } from '../models/Player';
import { Projectile } from '../models/Projectile';

export interface PlayerControllerConfig {
    movementSpeed: number;
    shootCooldown: number;
    boundaries: {
        left: number;
        right: number;
    };
}

export class PlayerController {
    private player: Player;
    private config: PlayerControllerConfig;
    private lastShotTime: number;
    private projectiles: Projectile[];

    /**
     * Creates a new PlayerController instance
     * @param player - The player entity to control
     * @param config - Configuration for player movement and shooting
     */
    constructor(player: Player, config: PlayerControllerConfig) {
        this.player = player;
        this.config = config;
        this.lastShotTime = 0;
        this.projectiles = [];
    }

    /**
     * Updates player position based on input
     * @param deltaTime - Time elapsed since last update
     * @param input - Object containing current input state
     */
    public update(deltaTime: number, input: { left: boolean; right: boolean; shoot: boolean }): void {
        this.handleMovement(deltaTime, input);
        this.handleShooting(input);
        this.updateProjectiles(deltaTime);
    }

    /**
     * Handles player movement based on input
     * @param deltaTime - Time elapsed since last update
     * @param input - Object containing current input state
     */
    private handleMovement(deltaTime: number, input: { left: boolean; right: boolean }): void {
        const movement = this.calculateMovement(input);
        const newPosition = this.player.position.x + movement * this.config.movementSpeed * deltaTime;

        // Ensure player stays within boundaries
        this.player.position.x = Math.max(
            this.config.boundaries.left,
            Math.min(this.config.boundaries.right, newPosition)
        );
    }

    /**
     * Calculates movement direction based on input
     * @param input - Object containing current input state
     * @returns Movement direction (-1 for left, 1 for right, 0 for no movement)
     */
    private calculateMovement(input: { left: boolean; right: boolean }): number {
        let movement = 0;
        if (input.left) movement -= 1;
        if (input.right) movement += 1;
        return movement;
    }

    /**
     * Handles player shooting mechanics
     * @param input - Object containing current input state
     */
    private handleShooting(input: { shoot: boolean }): void {
        const currentTime = Date.now();
        if (input.shoot && currentTime - this.lastShotTime >= this.config.shootCooldown) {
            this.shoot();
            this.lastShotTime = currentTime;
        }
    }

    /**
     * Creates a new projectile from the player's position
     */
    private shoot(): void {
        const projectile = new Projectile({
            x: this.player.position.x,
            y: this.player.position.y,
            velocity: { x: 0, y: -5 }, // Projectile moves upward
            width: 2,
            height: 10
        });
        this.projectiles.push(projectile);
    }

    /**
     * Updates all active projectiles
     * @param deltaTime - Time elapsed since last update
     */
    private updateProjectiles(deltaTime: number): void {
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update(deltaTime);
            return projectile.isActive(); // Remove inactive projectiles
        });
    }

    /**
     * Gets all active projectiles
     * @returns Array of active projectiles
     */
    public getProjectiles(): Projectile[] {
        return this.projectiles;
    }

    /**
     * Removes a projectile from the active projectiles list
     * @param projectile - The projectile to remove
     */
    public removeProjectile(projectile: Projectile): void {
        const index = this.projectiles.indexOf(projectile);
        if (index !== -1) {
            this.projectiles.splice(index, 1);
        }
    }

    /**
     * Resets the player controller state
     */
    public reset(): void {
        this.projectiles = [];
        this.lastShotTime = 0;
        // Reset player position if needed
        // this.player.position = { x: startX, y: startY };
    }
}