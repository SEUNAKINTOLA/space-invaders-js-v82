/**
 * @file InputHandler.ts
 * @description Service for handling keyboard and touch input in Space Invaders game
 */

// Types for input handling
type InputCallback = (event: KeyboardEvent | TouchEvent) => void;
type InputMap = Map<string, boolean>;

/**
 * Input state interface to track active inputs
 */
interface InputState {
  isPressed: boolean;
  timestamp: number;
}

/**
 * Service responsible for handling keyboard and touch input
 */
export class InputHandler {
  private static instance: InputHandler;
  private keyStates: Map<string, InputState>;
  private touchState: boolean;
  private callbacks: Map<string, Set<InputCallback>>;
  private readonly validKeys: Set<string>;

  /**
   * Initialize input handler with default settings
   */
  private constructor() {
    this.keyStates = new Map();
    this.touchState = false;
    this.callbacks = new Map();
    
    // Define valid keys for the game
    this.validKeys = new Set([
      'ArrowLeft',
      'ArrowRight',
      'Space',
      'Enter',
      'Escape',
      'KeyA',
      'KeyD',
    ]);

    this.initializeEventListeners();
  }

  /**
   * Get singleton instance of InputHandler
   */
  public static getInstance(): InputHandler {
    if (!InputHandler.instance) {
      InputHandler.instance = new InputHandler();
    }
    return InputHandler.instance;
  }

  /**
   * Initialize event listeners for keyboard and touch events
   */
  private initializeEventListeners(): void {
    // Keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Touch event listeners
    window.addEventListener('touchstart', this.handleTouchStart.bind(this));
    window.addEventListener('touchend', this.handleTouchEnd.bind(this));
    window.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.validKeys.has(event.code)) return;

    this.keyStates.set(event.code, {
      isPressed: true,
      timestamp: Date.now()
    });

    this.notifyCallbacks(event.code, event);
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.validKeys.has(event.code)) return;

    this.keyStates.set(event.code, {
      isPressed: false,
      timestamp: Date.now()
    });

    this.notifyCallbacks(event.code, event);
  }

  /**
   * Handle touch start events
   */
  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.touchState = true;
    this.notifyCallbacks('touch', event);
  }

  /**
   * Handle touch end events
   */
  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    this.touchState = false;
    this.notifyCallbacks('touch', event);
  }

  /**
   * Register callback for specific input
   */
  public subscribe(inputType: string, callback: InputCallback): void {
    if (!this.callbacks.has(inputType)) {
      this.callbacks.set(inputType, new Set());
    }
    this.callbacks.get(inputType)?.add(callback);
  }

  /**
   * Unregister callback for specific input
   */
  public unsubscribe(inputType: string, callback: InputCallback): void {
    this.callbacks.get(inputType)?.delete(callback);
  }

  /**
   * Notify all callbacks registered for a specific input
   */
  private notifyCallbacks(inputType: string, event: KeyboardEvent | TouchEvent): void {
    this.callbacks.get(inputType)?.forEach(callback => callback(event));
  }

  /**
   * Check if a specific key is currently pressed
   */
  public isKeyPressed(keyCode: string): boolean {
    return this.keyStates.get(keyCode)?.isPressed || false;
  }

  /**
   * Check if touch is currently active
   */
  public isTouchActive(): boolean {
    return this.touchState;
  }

  /**
   * Get the timestamp of the last key press
   */
  public getLastKeyPressTime(keyCode: string): number {
    return this.keyStates.get(keyCode)?.timestamp || 0;
  }

  /**
   * Clear all input states
   */
  public reset(): void {
    this.keyStates.clear();
    this.touchState = false;
  }

  /**
   * Clean up event listeners
   */
  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    window.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    window.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    window.removeEventListener('touchcancel', this.handleTouchEnd.bind(this));
    this.callbacks.clear();
    this.reset();
  }
}