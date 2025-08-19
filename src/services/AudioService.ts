/**
 * @file AudioService.ts
 * @description Service for managing game sound effects and audio playback
 */

/**
 * Represents the state of an audio asset
 */
interface AudioAsset {
    audio: HTMLAudioElement;
    volume: number;
    isLoaded: boolean;
}

/**
 * Manages game audio including sound effects and background music
 */
export class AudioService {
    private static instance: AudioService;
    private audioMap: Map<string, AudioAsset>;
    private isMuted: boolean;
    private masterVolume: number;
    private isInitialized: boolean;

    private constructor() {
        this.audioMap = new Map();
        this.isMuted = false;
        this.masterVolume = 1.0;
        this.isInitialized = false;
    }

    /**
     * Gets the singleton instance of AudioService
     */
    public static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    /**
     * Initializes the audio service
     * @throws Error if initialization fails
     */
    public async initialize(): Promise<void> {
        try {
            if (this.isInitialized) {
                return;
            }

            // Check if Web Audio API is supported
            if (!window.AudioContext && !window.webkitAudioContext) {
                throw new Error('Web Audio API is not supported in this browser');
            }

            this.isInitialized = true;
        } catch (error) {
            throw new Error(`Failed to initialize AudioService: ${error.message}`);
        }
    }

    /**
     * Loads an audio file and stores it in the audio map
     * @param id Unique identifier for the audio asset
     * @param url URL of the audio file
     * @throws Error if loading fails
     */
    public async loadAudio(id: string, url: string): Promise<void> {
        try {
            if (this.audioMap.has(id)) {
                console.warn(`Audio with id ${id} already exists. Skipping load.`);
                return;
            }

            const audio = new Audio(url);
            
            const audioAsset: AudioAsset = {
                audio,
                volume: 1.0,
                isLoaded: false
            };

            // Wait for the audio to load
            await new Promise<void>((resolve, reject) => {
                audio.addEventListener('canplaythrough', () => {
                    audioAsset.isLoaded = true;
                    resolve();
                });
                audio.addEventListener('error', () => {
                    reject(new Error(`Failed to load audio: ${url}`));
                });
            });

            this.audioMap.set(id, audioAsset);
        } catch (error) {
            throw new Error(`Failed to load audio ${id}: ${error.message}`);
        }
    }

    /**
     * Plays an audio asset
     * @param id Identifier of the audio to play
     * @param loop Whether the audio should loop
     * @throws Error if audio asset doesn't exist
     */
    public play(id: string, loop: boolean = false): void {
        const audioAsset = this.audioMap.get(id);
        
        if (!audioAsset) {
            throw new Error(`Audio asset ${id} not found`);
        }

        if (!audioAsset.isLoaded) {
            console.warn(`Audio asset ${id} is not fully loaded`);
            return;
        }

        try {
            const { audio } = audioAsset;
            audio.loop = loop;
            audio.volume = this.isMuted ? 0 : audioAsset.volume * this.masterVolume;
            
            // Reset audio to start if it's already playing
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.error(`Failed to play audio ${id}:`, error);
            });
        } catch (error) {
            console.error(`Error playing audio ${id}:`, error);
        }
    }

    /**
     * Stops playing an audio asset
     * @param id Identifier of the audio to stop
     */
    public stop(id: string): void {
        const audioAsset = this.audioMap.get(id);
        
        if (!audioAsset) {
            console.warn(`Audio asset ${id} not found`);
            return;
        }

        try {
            const { audio } = audioAsset;
            audio.pause();
            audio.currentTime = 0;
        } catch (error) {
            console.error(`Error stopping audio ${id}:`, error);
        }
    }

    /**
     * Sets the volume for a specific audio asset
     * @param id Identifier of the audio asset
     * @param volume Volume level (0.0 to 1.0)
     */
    public setVolume(id: string, volume: number): void {
        const audioAsset = this.audioMap.get(id);
        
        if (!audioAsset) {
            console.warn(`Audio asset ${id} not found`);
            return;
        }

        audioAsset.volume = Math.max(0, Math.min(1, volume));
        audioAsset.audio.volume = this.isMuted ? 0 : audioAsset.volume * this.masterVolume;
    }

    /**
     * Sets the master volume for all audio
     * @param volume Master volume level (0.0 to 1.0)
     */
    public setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        // Update all audio volumes
        this.audioMap.forEach(audioAsset => {
            audioAsset.audio.volume = this.isMuted ? 0 : audioAsset.volume * this.masterVolume;
        });
    }

    /**
     * Mutes/unmutes all audio
     * @param muted Whether audio should be muted
     */
    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        
        // Update all audio volumes
        this.audioMap.forEach(audioAsset => {
            audioAsset.audio.volume = this.isMuted ? 0 : audioAsset.volume * this.masterVolume;
        });
    }

    /**
     * Cleans up and releases audio resources
     */
    public dispose(): void {
        this.audioMap.forEach(audioAsset => {
            audioAsset.audio.pause();
            audioAsset.audio.src = '';
        });
        this.audioMap.clear();
        this.isInitialized = false;
    }
}