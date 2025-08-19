/**
 * @file Animations.ts
 * @description Manages game animations and visual effects using a flexible animation system
 */

type EasingFunction = (t: number) => number;
type AnimationCallback = (value: number) => void;

interface Animation {
    duration: number;
    elapsed: number;
    startValue: number;
    endValue: number;
    easing: EasingFunction;
    onUpdate: AnimationCallback;
    onComplete?: () => void;
    isComplete: boolean;
}

export class AnimationSystem {
    private animations: Animation[] = [];
    private static instance: AnimationSystem;

    // Standard easing functions
    public static readonly easings = {
        linear: (t: number): number => t,
        easeInQuad: (t: number): number => t * t,
        easeOutQuad: (t: number): number => t * (2 - t),
        easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInExpo: (t: number): number => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
        easeOutExpo: (t: number): number => t === 1 ? 1 : -Math.pow(2, -10 * t) + 1
    };

    private constructor() {}

    /**
     * Gets the singleton instance of the AnimationSystem
     */
    public static getInstance(): AnimationSystem {
        if (!AnimationSystem.instance) {
            AnimationSystem.instance = new AnimationSystem();
        }
        return AnimationSystem.instance;
    }

    /**
     * Creates and starts a new animation
     * @param startValue Initial value of the animation
     * @param endValue Final value of the animation
     * @param duration Duration in milliseconds
     * @param onUpdate Callback function called on each update with current value
     * @param easing Easing function to use
     * @param onComplete Optional callback function called when animation completes
     */
    public animate(
        startValue: number,
        endValue: number,
        duration: number,
        onUpdate: AnimationCallback,
        easing: EasingFunction = AnimationSystem.easings.linear,
        onComplete?: () => void
    ): void {
        const animation: Animation = {
            duration,
            elapsed: 0,
            startValue,
            endValue,
            easing,
            onUpdate,
            onComplete,
            isComplete: false
        };

        this.animations.push(animation);
    }

    /**
     * Updates all active animations
     * @param deltaTime Time elapsed since last frame in milliseconds
     */
    public update(deltaTime: number): void {
        this.animations = this.animations.filter(animation => {
            if (animation.isComplete) return false;

            animation.elapsed += deltaTime;
            
            // Calculate progress
            let progress = Math.min(animation.elapsed / animation.duration, 1);
            
            // Apply easing
            const easedProgress = animation.easing(progress);
            
            // Calculate current value
            const currentValue = animation.startValue + 
                (animation.endValue - animation.startValue) * easedProgress;
            
            // Call update callback
            animation.onUpdate(currentValue);

            // Check if animation is complete
            if (progress >= 1) {
                animation.isComplete = true;
                if (animation.onComplete) {
                    animation.onComplete();
                }
                return false;
            }

            return true;
        });
    }

    /**
     * Creates a shake animation effect
     * @param intensity Maximum displacement of the shake
     * @param duration Duration of the shake in milliseconds
     * @param onUpdate Callback function for updating position
     */
    public shake(
        intensity: number,
        duration: number,
        onUpdate: (x: number, y: number) => void
    ): void {
        let elapsed = 0;
        const frequency = 4; // Number of shakes per second

        this.animate(
            1,
            0,
            duration,
            (progress) => {
                elapsed += 16; // Assuming 60fps
                const decay = 1 - progress;
                const offset = Math.sin(elapsed * frequency) * intensity * decay;
                const offsetX = Math.cos(elapsed * frequency) * intensity * decay;
                onUpdate(offsetX, offset);
            },
            AnimationSystem.easings.easeOutExpo
        );
    }

    /**
     * Creates a fade animation
     * @param startOpacity Starting opacity value (0-1)
     * @param endOpacity Ending opacity value (0-1)
     * @param duration Duration in milliseconds
     * @param onUpdate Callback function for updating opacity
     * @param onComplete Optional callback function when fade completes
     */
    public fade(
        startOpacity: number,
        endOpacity: number,
        duration: number,
        onUpdate: (opacity: number) => void,
        onComplete?: () => void
    ): void {
        this.animate(
            startOpacity,
            endOpacity,
            duration,
            onUpdate,
            AnimationSystem.easings.easeInOutQuad,
            onComplete
        );
    }

    /**
     * Creates a scale animation
     * @param startScale Starting scale value
     * @param endScale Ending scale value
     * @param duration Duration in milliseconds
     * @param onUpdate Callback function for updating scale
     * @param onComplete Optional callback function when scaling completes
     */
    public scale(
        startScale: number,
        endScale: number,
        duration: number,
        onUpdate: (scale: number) => void,
        onComplete?: () => void
    ): void {
        this.animate(
            startScale,
            endScale,
            duration,
            onUpdate,
            AnimationSystem.easings.easeOutQuad,
            onComplete
        );
    }

    /**
     * Stops all currently running animations
     */
    public stopAll(): void {
        this.animations = [];
    }

    /**
     * Returns the number of currently active animations
     */
    public get activeAnimations(): number {
        return this.animations.length;
    }
}

export default AnimationSystem.getInstance();