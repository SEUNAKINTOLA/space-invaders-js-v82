/**
 * @file SoundManager.ts
 * @description Manages loading, caching, and playing of game sound effects and audio
 */

type SoundEffect = {
    buffer: AudioBuffer;
    volume: number;
    loop: boolean;
};

export class SoundManager {
    private static instance: SoundManager;
    private audioContext: AudioContext;
    private soundCache: Map<string, SoundEffect>;
    private activeAudioSources: Set<AudioBufferSourceNode>;
    private masterVolume: number;
    private isMuted: boolean;

    private constructor() {
        this.audioContext = new AudioContext();
        this.soundCache = new Map();
        this.activeAudioSources = new Set();
        this.masterVolume = 1.0;
        this.isMuted = false;
    }

    /**
     * Gets the singleton instance of SoundManager
     * @returns SoundManager instance
     */
    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    /**
     * Loads a sound file and caches it for future use
     * @param soundId Unique identifier for the sound
     * @param url URL of the sound file
     * @param volume Optional volume level (0.0 to 1.0)
     * @param loop Optional loop flag
     */
    public async loadSound(
        soundId: string,
        url: string,
        volume: number = 1.0,
        loop: boolean = false
    ): Promise<void> {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.soundCache.set(soundId, {
                buffer: audioBuffer,
                volume: Math.max(0, Math.min(1, volume)),
                loop
            });
        } catch (error) {
            console.error(`Failed to load sound ${soundId}:`, error);
            throw new Error(`Sound loading failed: ${soundId}`);
        }
    }

    /**
     * Plays a previously loaded sound
     * @param soundId Identifier of the sound to play
     * @returns Promise that resolves when the sound starts playing
     */
    public async playSound(soundId: string): Promise<void> {
        if (this.isMuted) return;

        const sound = this.soundCache.get(soundId);
        if (!sound) {
            throw new Error(`Sound not loaded: ${soundId}`);
        }

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = sound.buffer;
            source.loop = sound.loop;

            gainNode.gain.value = sound.volume * this.masterVolume;

            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            this.activeAudioSources.add(source);

            source.onended = () => {
                this.activeAudioSources.delete(source);
                source.disconnect();
                gainNode.disconnect();
            };

            await this.audioContext.resume();
            source.start(0);
        } catch (error) {
            console.error(`Failed to play sound ${soundId}:`, error);
            throw new Error(`Sound playback failed: ${soundId}`);
        }
    }

    /**
     * Stops all currently playing sounds
     */
    public stopAllSounds(): void {
        this.activeAudioSources.forEach(source => {
            try {
                source.stop();
                source.disconnect();
            } catch (error) {
                console.warn('Error stopping sound:', error);
            }
        });
        this.activeAudioSources.clear();
    }

    /**
     * Sets the master volume for all sounds
     * @param volume Volume level (0.0 to 1.0)
     */
    public setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Mutes or unmutes all sounds
     * @param muted Mute state
     */
    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        if (muted) {
            this.stopAllSounds();
        }
    }

    /**
     * Checks if a sound is loaded
     * @param soundId Sound identifier to check
     * @returns boolean indicating if the sound is loaded
     */
    public isSoundLoaded(soundId: string): boolean {
        return this.soundCache.has(soundId);
    }

    /**
     * Releases resources for a specific sound
     * @param soundId Sound identifier to unload
     */
    public unloadSound(soundId: string): void {
        this.soundCache.delete(soundId);
    }

    /**
     * Releases all audio resources
     */
    public dispose(): void {
        this.stopAllSounds();
        this.soundCache.clear();
        this.audioContext.close();
    }

    /**
     * Gets the current master volume
     * @returns Current master volume level
     */
    public getMasterVolume(): number {
        return this.masterVolume;
    }

    /**
     * Gets the current mute state
     * @returns Current mute state
     */
    public getMuted(): boolean {
        return this.isMuted;
    }
}

export default SoundManager;