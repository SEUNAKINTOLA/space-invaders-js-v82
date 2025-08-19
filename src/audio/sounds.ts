/**
 * @file sounds.ts
 * @description Defines sound assets and mappings for the game's audio system
 */

/**
 * Enum representing all available sound effect types in the game
 */
export enum SoundEffect {
    PLAYER_SHOOT = 'playerShoot',
    PLAYER_HIT = 'playerHit',
    PLAYER_DEATH = 'playerDeath',
    ENEMY_SHOOT = 'enemyShoot',
    ENEMY_HIT = 'enemyHit',
    ENEMY_DEATH = 'enemyDeath',
    POWERUP_COLLECT = 'powerupCollect',
    GAME_OVER = 'gameOver',
    LEVEL_COMPLETE = 'levelComplete',
    MENU_SELECT = 'menuSelect',
    MENU_NAVIGATE = 'menuNavigate',
    EXPLOSION_SMALL = 'explosionSmall',
    EXPLOSION_LARGE = 'explosionLarge',
    SHIELD_HIT = 'shieldHit',
    WAVE_START = 'waveStart'
}

/**
 * Interface defining the structure of a sound asset
 */
export interface SoundAsset {
    readonly path: string;
    readonly volume: number;
    readonly loop: boolean;
    readonly poolSize: number;
}

/**
 * Configuration for sound effect properties
 */
export const SoundAssets: Record<SoundEffect, SoundAsset> = {
    [SoundEffect.PLAYER_SHOOT]: {
        path: 'assets/audio/player-shoot.mp3',
        volume: 0.4,
        loop: false,
        poolSize: 3
    },
    [SoundEffect.PLAYER_HIT]: {
        path: 'assets/audio/player-hit.mp3',
        volume: 0.5,
        loop: false,
        poolSize: 2
    },
    [SoundEffect.PLAYER_DEATH]: {
        path: 'assets/audio/player-death.mp3',
        volume: 0.6,
        loop: false,
        poolSize: 1
    },
    [SoundEffect.ENEMY_SHOOT]: {
        path: 'assets/audio/enemy-shoot.mp3',
        volume: 0.3,
        loop: false,
        poolSize: 5
    },
    [SoundEffect.ENEMY_HIT]: {
        path: 'assets/audio/enemy-hit.mp3',
        volume: 0.4,
        loop: false,
        poolSize: 5
    },
    [SoundEffect.ENEMY_DEATH]: {
        path: 'assets/audio/enemy-death.mp3',
        volume: 0.5,
        loop: false,
        poolSize: 5
    },
    [SoundEffect.POWERUP_COLLECT]: {
        path: 'assets/audio/powerup-collect.mp3',
        volume: 0.5,
        loop: false,
        poolSize: 2
    },
    [SoundEffect.GAME_OVER]: {
        path: 'assets/audio/game-over.mp3',
        volume: 0.6,
        loop: false,
        poolSize: 1
    },
    [SoundEffect.LEVEL_COMPLETE]: {
        path: 'assets/audio/level-complete.mp3',
        volume: 0.6,
        loop: false,
        poolSize: 1
    },
    [SoundEffect.MENU_SELECT]: {
        path: 'assets/audio/menu-select.mp3',
        volume: 0.4,
        loop: false,
        poolSize: 1
    },
    [SoundEffect.MENU_NAVIGATE]: {
        path: 'assets/audio/menu-navigate.mp3',
        volume: 0.3,
        loop: false,
        poolSize: 1
    },
    [SoundEffect.EXPLOSION_SMALL]: {
        path: 'assets/audio/explosion-small.mp3',
        volume: 0.4,
        loop: false,
        poolSize: 5
    },
    [SoundEffect.EXPLOSION_LARGE]: {
        path: 'assets/audio/explosion-large.mp3',
        volume: 0.6,
        loop: false,
        poolSize: 2
    },
    [SoundEffect.SHIELD_HIT]: {
        path: 'assets/audio/shield-hit.mp3',
        volume: 0.4,
        loop: false,
        poolSize: 3
    },
    [SoundEffect.WAVE_START]: {
        path: 'assets/audio/wave-start.mp3',
        volume: 0.5,
        loop: false,
        poolSize: 1
    }
};

/**
 * Validates that a sound effect exists in the assets configuration
 * @param effect - The sound effect to validate
 * @throws Error if the sound effect is not found
 */
export function validateSoundEffect(effect: SoundEffect): void {
    if (!SoundAssets[effect]) {
        throw new Error(`Sound effect "${effect}" not found in assets configuration`);
    }
}

/**
 * Gets the file extension from a sound asset path
 * @param path - The path to the sound asset
 * @returns The file extension
 */
export function getSoundFileExtension(path: string): string {
    const match = path.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
}

/**
 * Checks if the audio format is supported by the browser
 * @param extension - The file extension to check
 * @returns Boolean indicating if the format is supported
 */
export function isAudioFormatSupported(extension: string): boolean {
    const audio = new Audio();
    return audio.canPlayType(`audio/${extension}`) !== '';
}