/**
 * @file ParticleSystem.ts
 * @description Manages particle effects for visual feedback in the game
 */

interface ParticleConfig {
    x: number;
    y: number;
    color: string;
    speed: number;
    life: number;
    size: number;
    direction: { x: number; y: number };
}

interface ParticleEmitterConfig {
    particleCount: number;
    spread: number;
    lifetime: { min: number; max: number };
    speed: { min: number; max: number };
    size: { min: number; max: number };
    colors: string[];
}

class Particle {
    private x: number;
    private y: number;
    private initialLife: number;
    private life: number;
    private color: string;
    private size: number;
    private velocity: { x: number; y: number };
    private alpha: number = 1;

    constructor(config: ParticleConfig) {
        this.x = config.x;
        this.y = config.y;
        this.color = config.color;
        this.size = config.size;
        this.life = config.life;
        this.initialLife = config.life;
        this.velocity = {
            x: config.direction.x * config.speed,
            y: config.direction.y * config.speed
        };
    }

    /**
     * Updates particle position and life
     * @param deltaTime Time elapsed since last update
     * @returns boolean indicating if particle is still alive
     */
    update(deltaTime: number): boolean {
        this.life -= deltaTime;
        if (this.life <= 0) return false;

        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        this.alpha = this.life / this.initialLife;
        return true;
    }

    /**
     * Renders particle to the canvas context
     */
    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ParticleSystem {
    private particles: Particle[] = [];
    private readonly maxParticles: number = 1000;

    /**
     * Creates an explosion effect at the specified position
     */
    createExplosion(x: number, y: number, config: ParticleEmitterConfig): void {
        const particlesToCreate = Math.min(
            config.particleCount,
            this.maxParticles - this.particles.length
        );

        for (let i = 0; i < particlesToCreate; i++) {
            const angle = (Math.PI * 2 * i) / particlesToCreate;
            const spread = (Math.random() - 0.5) * config.spread;
            const speed = this.randomRange(config.speed.min, config.speed.max);
            const life = this.randomRange(config.lifetime.min, config.lifetime.max);
            const size = this.randomRange(config.size.min, config.size.max);
            const color = config.colors[Math.floor(Math.random() * config.colors.length)];

            this.particles.push(
                new Particle({
                    x,
                    y,
                    color,
                    speed,
                    life,
                    size,
                    direction: {
                        x: Math.cos(angle + spread),
                        y: Math.sin(angle + spread)
                    }
                })
            );
        }
    }

    /**
     * Creates a hit effect at the specified position
     */
    createHitEffect(x: number, y: number): void {
        const hitConfig: ParticleEmitterConfig = {
            particleCount: 15,
            spread: 0.5,
            lifetime: { min: 0.2, max: 0.4 },
            speed: { min: 100, max: 200 },
            size: { min: 1, max: 3 },
            colors: ['#ffffff', '#ffff00', '#ff8800']
        };
        this.createExplosion(x, y, hitConfig);
    }

    /**
     * Creates an explosion effect for enemy destruction
     */
    createEnemyExplosion(x: number, y: number): void {
        const explosionConfig: ParticleEmitterConfig = {
            particleCount: 30,
            spread: 0.8,
            lifetime: { min: 0.4, max: 0.8 },
            speed: { min: 150, max: 300 },
            size: { min: 2, max: 4 },
            colors: ['#ff0000', '#ff8800', '#ffff00']
        };
        this.createExplosion(x, y, explosionConfig);
    }

    /**
     * Updates all particles in the system
     */
    update(deltaTime: number): void {
        this.particles = this.particles.filter(particle => 
            particle.update(deltaTime)
        );
    }

    /**
     * Renders all particles to the canvas
     */
    render(ctx: CanvasRenderingContext2D): void {
        this.particles.forEach(particle => particle.render(ctx));
    }

    /**
     * Clears all particles from the system
     */
    clear(): void {
        this.particles = [];
    }

    /**
     * Returns the current number of active particles
     */
    getParticleCount(): number {
        return this.particles.length;
    }

    private randomRange(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }
}