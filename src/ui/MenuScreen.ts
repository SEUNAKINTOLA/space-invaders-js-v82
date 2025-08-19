/**
 * @file MenuScreen.ts
 * @description Implements the game's menu interface and handling of menu states
 */

export enum MenuState {
    MAIN,
    PAUSE,
    GAME_OVER,
    HIGH_SCORES
}

interface MenuOption {
    text: string;
    action: () => void;
    isEnabled: boolean;
}

export class MenuScreen {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private currentState: MenuState;
    private menuOptions: Map<MenuState, MenuOption[]>;
    private selectedIndex: number;
    private readonly fontFamily: string = 'Arial';

    /**
     * Creates a new MenuScreen instance
     * @param canvas - The canvas element to render the menu on
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.currentState = MenuState.MAIN;
        this.selectedIndex = 0;
        this.initializeMenuOptions();
    }

    /**
     * Initializes menu options for different menu states
     */
    private initializeMenuOptions(): void {
        this.menuOptions = new Map();

        // Main Menu Options
        this.menuOptions.set(MenuState.MAIN, [
            { text: 'Start Game', action: () => this.startGame(), isEnabled: true },
            { text: 'High Scores', action: () => this.showHighScores(), isEnabled: true },
            { text: 'Settings', action: () => this.showSettings(), isEnabled: true }
        ]);

        // Pause Menu Options
        this.menuOptions.set(MenuState.PAUSE, [
            { text: 'Resume', action: () => this.resumeGame(), isEnabled: true },
            { text: 'Restart', action: () => this.restartGame(), isEnabled: true },
            { text: 'Main Menu', action: () => this.returnToMain(), isEnabled: true }
        ]);

        // Game Over Menu Options
        this.menuOptions.set(MenuState.GAME_OVER, [
            { text: 'Play Again', action: () => this.restartGame(), isEnabled: true },
            { text: 'Main Menu', action: () => this.returnToMain(), isEnabled: true }
        ]);
    }

    /**
     * Renders the current menu state
     */
    public render(): void {
        this.ctx.save();
        this.clearScreen();
        this.drawBackground();
        this.drawMenuTitle();
        this.drawMenuOptions();
        this.ctx.restore();
    }

    /**
     * Clears the canvas screen
     */
    private clearScreen(): void {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the menu background
     */
    private drawBackground(): void {
        // Add background styling here
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the menu title based on current state
     */
    private drawMenuTitle(): void {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `48px ${this.fontFamily}`;
        this.ctx.textAlign = 'center';

        const titles = {
            [MenuState.MAIN]: 'SPACE INVADERS',
            [MenuState.PAUSE]: 'PAUSED',
            [MenuState.GAME_OVER]: 'GAME OVER',
            [MenuState.HIGH_SCORES]: 'HIGH SCORES'
        };

        this.ctx.fillText(
            titles[this.currentState],
            this.canvas.width / 2,
            this.canvas.height / 4
        );
    }

    /**
     * Draws the menu options for the current state
     */
    private drawMenuOptions(): void {
        const options = this.menuOptions.get(this.currentState) || [];
        const startY = this.canvas.height / 2;
        const spacing = 50;

        options.forEach((option, index) => {
            this.ctx.fillStyle = !option.isEnabled ? 'gray' : 
                               (index === this.selectedIndex ? '#00ff00' : 'white');
            this.ctx.font = `24px ${this.fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                option.text,
                this.canvas.width / 2,
                startY + (spacing * index)
            );
        });
    }

    /**
     * Handles menu navigation
     * @param direction - Direction of navigation (1 for down, -1 for up)
     */
    public navigate(direction: number): void {
        const options = this.menuOptions.get(this.currentState) || [];
        this.selectedIndex = (this.selectedIndex + direction + options.length) % options.length;
    }

    /**
     * Selects the current menu option
     */
    public selectOption(): void {
        const options = this.menuOptions.get(this.currentState) || [];
        const selectedOption = options[this.selectedIndex];
        
        if (selectedOption && selectedOption.isEnabled) {
            selectedOption.action();
        }
    }

    /**
     * Changes the current menu state
     * @param state - The new menu state
     */
    public setState(state: MenuState): void {
        this.currentState = state;
        this.selectedIndex = 0;
    }

    // Menu action handlers
    private startGame(): void {
        // Implement game start logic
        console.log('Starting game...');
    }

    private showHighScores(): void {
        this.setState(MenuState.HIGH_SCORES);
    }

    private showSettings(): void {
        // Implement settings display logic
        console.log('Showing settings...');
    }

    private resumeGame(): void {
        // Implement game resume logic
        console.log('Resuming game...');
    }

    private restartGame(): void {
        // Implement game restart logic
        console.log('Restarting game...');
    }

    private returnToMain(): void {
        this.setState(MenuState.MAIN);
    }
}