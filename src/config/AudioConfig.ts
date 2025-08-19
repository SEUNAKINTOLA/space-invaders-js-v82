/**
 * @file AudioConfig.ts
 * @description Configuration file for game audio settings and sound effect definitions
 */

/**
 * Enum for different audio categories in the game
 */
export enum AudioCategory {
    SFX = 'sfx',
    MUSIC = 'music',
    UI = 'ui'
}

/**
 * Interface defining the structure of an audio asset
 */
export interface AudioAsset {
    readonly path: string;
    readonly volume: number;
    readonly category: AudioCategory;
    readonly loop: boolean;
}

/**
 * Interface for volume settings across different categories
 */
export interface VolumeSettings {
    readonly master: number;
    readonly sfx: number;
    readonly music: number;
    readonly ui: number;
}

/**
 * Default volume settings for the game
 */
export const DEFAULT_VOLUME_SETTINGS: VolumeSettings = {
    master: 1.0,
    sfx: 0.8,
    music: 0.6,
    ui: 0.7
};

/**
 * Configuration for all game sound effects and music
 */
export const AUDIO_ASSETS: { [key: string]: AudioAsset } = {
    // Player sound effects
    playerShoot: {
        path: 'assets/audio/sfx/player-shoot.wav',
        volume: 0.5,
        category: AudioCategory.SFX,
        loop: false
    },
    playerExplode: {
        path: 'assets/audio/sfx/player-explode.wav',
        volume: 0.6,
        category: AudioCategory.SFX,
        loop: false
    },
    playerDamage: {
        path: 'assets/audio/sfx/player-damage.wav',
        volume: 0.4,
        category: AudioCategory.SFX,
        loop: false
    },

    // Enemy sound effects
    enemyShoot: {
        path: 'assets/audio/sfx/enemy-shoot.wav',
        volume: 0.4,
        category: AudioCategory.SFX,
        loop: false
    },
    enemyExplode: {
        path: 'assets/audio/sfx/enemy-explode.wav',
        volume: 0.5,
        category: AudioCategory.SFX,
        loop: false
    },

    // UI sound effects
    menuSelect: {
        path: 'assets/audio/ui/menu-select.wav',
        volume: 0.3,
        category: AudioCategory.UI,
        loop: false
    },
    menuConfirm: {
        path: 'assets/audio/ui/menu-confirm.wav',
        volume: 0.4,
        category: AudioCategory.UI,
        loop: false
    },

    // Background music
    gameMusic: {
        path: 'assets/audio/music/game-theme.mp3',
        volume: 0.4,
        category: AudioCategory.MUSIC,
        loop: true
    },
    menuMusic: {
        path: 'assets/audio/music/menu-theme.mp3',
        volume: 0.3,
        category: AudioCategory.MUSIC,
        loop: true
    }
};

/**
 * Audio configuration settings
 */
export const AUDIO_CONFIG = {
    /**
     * Maximum number of simultaneous sound effects
     */
    MAX_CONCURRENT_SOUNDS: 8,

    /**
     * Fade duration for music transitions (in milliseconds)
     */
    MUSIC_FADE_DURATION: 1000,

    /**
     * Distance threshold for spatial audio effects
     */
    SPATIAL_AUDIO_THRESHOLD: 1000,

    /**
     * Default audio format
     */
    DEFAULT_FORMAT: '.wav',

    /**
     * Audio file formats supported by the game
     */
    SUPPORTED_FORMATS: ['.wav', '.mp3', '.ogg'],

    /**
     * Buffer size for audio processing (in samples)
     */
    BUFFER_SIZE: 2048
};

/**
 * Validation function for audio asset paths
 */
export function isValidAudioPath(path: string): boolean {
    const extension = path.substring(path.lastIndexOf('.'));
    return AUDIO_CONFIG.SUPPORTED_FORMATS.includes(extension);
}

/**
 * Clamp volume value to valid range (0.0 to 1.0)
 */
export function clampVolume(volume: number): number {
    return Math.max(0, Math.min(1, volume));
}