/**
 * InputManager class handles both keyboard and touch input for the game
 * Implements the Observer pattern for input event handling
 */
export class InputManager {
    private static instance: InputManager;
    
    private keyState: Map<string, boolean>;
    private touchState: {
        touching: boolean;
        position: { x: number; y: number };
        startPosition: { x: number; y: number };
    };
    
    private listeners: Map<string, Function[]>;
    private touchThreshold: number = 20; // minimum distance for swipe detection

    private constructor() {
        this.keyState = new Map();
        this.touchState = {
            touching: false,
            position: { x: 0, y: 0 },
            startPosition: { x: 0, y: 0 }
        };
        this.listeners = new Map();
        
        this.initializeKeyboardControls();
        this.initializeTouchControls();
    }

    /**
     * Returns the singleton instance of InputManager
     */
    public static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    /**
     * Initialize keyboard event listeners
     */
    private initializeKeyboardControls(): void {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            this.keyState.set(event.code, true);
            this.notifyListeners('keydown', event.code);
        });

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            this.keyState.set(event.code, false);
            this.notifyListeners('keyup', event.code);
        });
    }

    /**
     * Initialize touch event listeners
     */
    private initializeTouchControls(): void {
        window.addEventListener('touchstart', (event: TouchEvent) => {
            event.preventDefault();
            const touch = event.touches[0];
            this.touchState.touching = true;
            this.touchState.startPosition = {
                x: touch.clientX,
                y: touch.clientY
            };
            this.touchState.position = { ...this.touchState.startPosition };
            this.notifyListeners('touchstart', this.touchState);
        });

        window.addEventListener('touchmove', (event: TouchEvent) => {
            event.preventDefault();
            const touch = event.touches[0];
            this.touchState.position = {
                x: touch.clientX,
                y: touch.clientY
            };
            this.handleTouchMove();
            this.notifyListeners('touchmove', this.touchState);
        });

        window.addEventListener('touchend', (event: TouchEvent) => {
            event.preventDefault();
            this.touchState.touching = false;
            this.notifyListeners('touchend', this.touchState);
        });
    }

    /**
     * Handle touch movement and determine gestures
     */
    private handleTouchMove(): void {
        const deltaX = this.touchState.position.x - this.touchState.startPosition.x;
        const deltaY = this.touchState.position.y - this.touchState.startPosition.y;

        if (Math.abs(deltaX) > this.touchThreshold) {
            const direction = deltaX > 0 ? 'right' : 'left';
            this.notifyListeners('swipe', direction);
        }

        if (Math.abs(deltaY) > this.touchThreshold) {
            const direction = deltaY > 0 ? 'down' : 'up';
            this.notifyListeners('swipe', direction);
        }
    }

    /**
     * Add an event listener
     * @param eventType - Type of event to listen for
     * @param callback - Function to call when event occurs
     */
    public addEventListener(eventType: string, callback: Function): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)?.push(callback);
    }

    /**
     * Remove an event listener
     * @param eventType - Type of event to remove
     * @param callback - Function to remove
     */
    public removeEventListener(eventType: string, callback: Function): void {
        const callbacks = this.listeners.get(eventType);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Notify all listeners of an event
     * @param eventType - Type of event that occurred
     * @param data - Data associated with the event
     */
    private notifyListeners(eventType: string, data: any): void {
        const callbacks = this.listeners.get(eventType);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    /**
     * Check if a key is currently pressed
     * @param keyCode - Key code to check
     */
    public isKeyPressed(keyCode: string): boolean {
        return this.keyState.get(keyCode) || false;
    }

    /**
     * Get current touch position
     */
    public getTouchPosition(): { x: number; y: number } {
        return { ...this.touchState.position };
    }

    /**
     * Check if screen is currently being touched
     */
    public isTouching(): boolean {
        return this.touchState.touching;
    }

    /**
     * Clean up event listeners
     */
    public dispose(): void {
        this.listeners.clear();
        this.keyState.clear();
    }
}

export default InputManager;