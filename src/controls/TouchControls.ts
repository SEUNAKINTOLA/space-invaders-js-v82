/**
 * @file TouchControls.ts
 * @description Handles touch-based controls for mobile devices in Space Invaders game
 */

export interface TouchPosition {
    x: number;
    y: number;
}

export interface TouchControlConfig {
    touchThreshold: number;      // Minimum distance for touch movement detection
    doubleTapDelay: number;      // Maximum delay between taps for double tap detection
    longPressDelay: number;      // Delay for long press detection
}

export interface TouchControlEvents {
    onMove: (position: TouchPosition) => void;
    onShoot: () => void;
    onPause: () => void;
}

export class TouchControls {
    private readonly canvas: HTMLCanvasElement;
    private readonly config: TouchControlConfig;
    private readonly events: TouchControlEvents;

    private touchStartPosition: TouchPosition | null = null;
    private lastTapTime: number = 0;
    private longPressTimer: number | null = null;
    private isEnabled: boolean = false;

    /**
     * Creates a new TouchControls instance
     * @param canvas - The game canvas element
     * @param events - Event callbacks for touch actions
     * @param config - Optional configuration for touch controls
     */
    constructor(
        canvas: HTMLCanvasElement,
        events: TouchControlEvents,
        config: Partial<TouchControlConfig> = {}
    ) {
        this.canvas = canvas;
        this.events = events;
        this.config = {
            touchThreshold: config.touchThreshold || 10,
            doubleTapDelay: config.doubleTapDelay || 300,
            longPressDelay: config.longPressDelay || 500
        };

        this.initializeEventListeners();
    }

    /**
     * Enables touch controls
     */
    public enable(): void {
        this.isEnabled = true;
    }

    /**
     * Disables touch controls
     */
    public disable(): void {
        this.isEnabled = false;
        this.clearLongPressTimer();
    }

    /**
     * Cleans up event listeners and timers
     */
    public destroy(): void {
        this.disable();
        this.removeEventListeners();
    }

    private initializeEventListeners(): void {
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }

    private removeEventListeners(): void {
        this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    private handleTouchStart(event: TouchEvent): void {
        if (!this.isEnabled) return;
        event.preventDefault();

        const touch = event.touches[0];
        this.touchStartPosition = this.getTouchPosition(touch);

        // Handle double tap detection
        const currentTime = Date.now();
        if (currentTime - this.lastTapTime < this.config.doubleTapDelay) {
            this.events.onPause();
            this.lastTapTime = 0;
        } else {
            this.lastTapTime = currentTime;
        }

        // Set up long press timer
        this.longPressTimer = window.setTimeout(() => {
            this.events.onShoot();
        }, this.config.longPressDelay);
    }

    private handleTouchMove(event: TouchEvent): void {
        if (!this.isEnabled || !this.touchStartPosition) return;
        event.preventDefault();

        const currentPosition = this.getTouchPosition(event.touches[0]);
        const deltaX = currentPosition.x - this.touchStartPosition.x;

        if (Math.abs(deltaX) > this.config.touchThreshold) {
            this.events.onMove(currentPosition);
            this.clearLongPressTimer();
        }
    }

    private handleTouchEnd(event: TouchEvent): void {
        if (!this.isEnabled) return;
        event.preventDefault();

        this.clearLongPressTimer();
        this.touchStartPosition = null;
    }

    private getTouchPosition(touch: Touch): TouchPosition {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    private clearLongPressTimer(): void {
        if (this.longPressTimer !== null) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
}