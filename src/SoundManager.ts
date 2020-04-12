import { logger } from './utils';

const TAG = 'SoundManager';
const VOLUME = 0.5;

export class SoundManager {
    static audios: HTMLAudioElement[] = [];

    protected static _volume = VOLUME;

    static get volume(): number {
        return this._volume;
    }

    static set volume(value: number) {
        this._volume = (value > 1 ? 1 : value < 0 ? 0 : value) || 0;
        this.audios.forEach(audio => (audio.volume = this._volume));
    }

    static playSound(file: string, onFinish?: () => void, onError?: (e: Error) => void): HTMLAudioElement {
        const audio = new Audio(file);
        audio.volume = this._volume;

        this.audios.push(audio);

        audio.addEventListener('ended', () => {
            this.audios.splice(this.audios.indexOf(audio));
            onFinish?.();
        });
        audio.addEventListener('error', (e: ErrorEvent) => {
            this.audios.splice(this.audios.indexOf(audio));
            logger.warn(TAG, `Error occurred when playing "${file}"`, e.error);
            onError?.(e.error);
        });

        const playResult = audio.play();

        if (playResult) {
            playResult.catch(e => {
                logger.warn(TAG, `Error occurred when playing "${file}"`, e);
                onError?.(e.error);
            });
        }

        return audio;
    }

    private constructor() {}
}