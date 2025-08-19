/**
 * @file InputManager.ts
 * @description Manages keyboard and touch input handling for the game
 */

// Type definitions for input handling
type InputKey = string;
type InputCallback = () => void;
type TouchPosition = { x: number; y: number };

interface InputBinding {
    key: InputKey;
    callback: InputCallback;
    isPressed: boolean;
}

/**
 * InputManager class handles keyboard and touch input detection and management
 * Implements the Singleton pattern to ensure only one input manager exists
 */
export class InputManager {
    private static instance: InputManager;
    private inputBindings: Map<InputKey, InputBinding>;
    private touchPosition: TouchPosition;
    private isTouching: boolean;
    private touchCallbacks: Set<(position: TouchPosition) => void>;

    private constructor() {
        this.inputBindings = new Map();
        this.touchPosition = { x: 0, y: 0 };
        this.isTouching = false;
        this.touchCallbacks = new Set();

        // Initialize event listeners
        this.initializeKeyboardEvents();
        this.initializeTouchEvents();
    }

    /**
     * Gets the singleton instance of InputManager
     */
    public static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    /**
     * Binds a keyboard key to a callback function
     * @param key - The key to bind (e.g., 'ArrowLeft', 'Space')
     * @param callback - The function to call when the key is pressed
     */
    public bindKey(key: InputKey, callback: InputCallback): void {
        this.inputBindings.set(key.toLowerCase(), {
            key: key.toLowerCase(),
            callback,
            isPressed: false
        });
    }

    /**
     * Unbinds a keyboard key
     * @param key - The key to unbind
     */
    public unbindKey(key: InputKey): void {
        this.inputBindings.delete(key.toLowerCase());
    }

    /**
     * Registers a touch callback function
     * @param callback - Function to call when touch position updates
     */
    public registerTouchCallback(callback: (position: TouchPosition) => void): void {
        this.touchCallbacks.add(callback);
    }

    /**
     * Unregisters a touch callback function
     * @param callback - Function to remove from touch callbacks
     */
    public unregisterTouchCallback(callback: (position: TouchPosition) => void): void {
        this.touchCallbacks.delete(callback);
    }

    /**
     * Gets the current touch position
     */
    public getTouchPosition(): TouchPosition {
        return { ...this.touchPosition };
    }

    /**
     * Checks if a specific key is currently pressed
     * @param key - The key to check
     */
    public isKeyPressed(key: InputKey): boolean {
        const binding = this.inputBindings.get(key.toLowerCase());
        return binding ? binding.isPressed : false;
    }

    /**
     * Checks if the screen is currently being touched
     */
    public isTouchActive(): boolean {
        return this.isTouching;
    }

    /**
     * Cleans up all input bindings and event listeners
     */
    public cleanup(): void {
        this.inputBindings.clear();
        this.touchCallbacks.clear();
        // Remove event listeners if necessary
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    private initializeKeyboardEvents(): void {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    private initializeTouchEvents(): void {
        if ('ontouchstart' in window) {
            window.addEventListener('touchstart', this.handleTouchStart);
            window.addEventListener('touchmove', this.handleTouchMove);
            window.addEventListener('touchend', this.handleTouchEnd);
        }
    }

    private handleKeyDown = (event: KeyboardEvent): void => {
        const binding = this.inputBindings.get(event.key.toLowerCase());
        if (binding && !binding.isPressed) {
            binding.isPressed = true;
            binding.callback();
        }
    };

    private handleKeyUp = (event: KeyboardEvent): void => {
        const binding = this.inputBindings.get(event.key.toLowerCase());
        if (binding) {
            binding.isPressed = false;
        }
    };

    private handleTouchStart = (event: TouchEvent): void => {
        event.preventDefault();
        this.isTouching = true;
        this.updateTouchPosition(event.touches[0]);
    };

    private handleTouchMove = (event: TouchEvent): void => {
        event.preventDefault();
        this.updateTouchPosition(event.touches[0]);
    };

    private handleTouchEnd = (event: TouchEvent): void => {
        event.preventDefault();
        this.isTouching = false;
    };

    private updateTouchPosition(touch: Touch): void {
        this.touchPosition = {
            x: touch.clientX,
            y: touch.clientY
        };
        
        // Notify all touch callbacks
        this.touchCallbacks.forEach(callback => {
            callback(this.touchPosition);
        });
    }
}

// Export a default instance
export default InputManager.getInstance();