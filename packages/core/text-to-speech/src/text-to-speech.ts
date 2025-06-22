import {
  TextToSpeechProvider,
  TextToSpeechOptions,
  TextToSpeechState,
  TextToSpeechError,
  Voice,
} from './types';
import { WebSpeechSynthesisProvider } from './providers/web-speech-synthesis';
import { MockTTSProvider } from './providers/mock';

export class TextToSpeech {
  private provider: TextToSpeechProvider;
  private state: TextToSpeechState;
  private listeners: Map<string, Set<Function>>;

  constructor(provider?: TextToSpeechProvider) {
    this.provider = provider || this.createDefaultProvider();
    this.listeners = new Map();
    this.state = {
      isSupported: this.provider.isSupported(),
      isSpeaking: false,
      isPaused: false,
      voices: [],
      currentVoice: null,
      rate: 1,
      pitch: 1,
      volume: 1,
      error: null,
    };

    this.setupProviderListeners();
    this.loadVoices();
  }

  private createDefaultProvider(): TextToSpeechProvider {
    if (WebSpeechSynthesisProvider.isAvailable()) {
      return new WebSpeechSynthesisProvider();
    }
    return new MockTTSProvider();
  }

  private setupProviderListeners(): void {
    this.provider.onStart(() => {
      this.state.isSpeaking = true;
      this.state.isPaused = false;
      this.emit('start');
      this.emit('stateChange', { ...this.state });
    });

    this.provider.onEnd(() => {
      this.state.isSpeaking = false;
      this.state.isPaused = false;
      this.emit('end');
      this.emit('stateChange', { ...this.state });
    });

    this.provider.onPause(() => {
      this.state.isPaused = true;
      this.emit('pause');
      this.emit('stateChange', { ...this.state });
    });

    this.provider.onResume(() => {
      this.state.isPaused = false;
      this.emit('resume');
      this.emit('stateChange', { ...this.state });
    });

    this.provider.onError((error) => {
      this.state.error = error;
      this.state.isSpeaking = false;
      this.state.isPaused = false;
      this.emit('error', error);
      this.emit('stateChange', { ...this.state });
    });
  }

  private async loadVoices(): Promise<void> {
    try {
      const voices = await this.provider.getVoices();
      this.state.voices = voices;
      
      if (voices.length > 0 && !this.state.currentVoice) {
        const defaultVoice = voices.find(v => v.default) || voices[0];
        this.state.currentVoice = defaultVoice;
      }

      this.emit('voicesChanged', voices);
      this.emit('stateChange', { ...this.state });
    } catch (error) {
      this.handleError('load-voices-error', error);
    }
  }

  private handleError(errorType: string, error: unknown): void {
    const ttsError: TextToSpeechError = {
      error: errorType,
      message: error instanceof Error ? error.message : String(error),
      timestamp: Date.now(),
    };

    this.state.error = ttsError;
    this.emit('error', ttsError);
    this.emit('stateChange', { ...this.state });
  }

  async speak(text: string, options?: TextToSpeechOptions): Promise<void> {
    if (!this.state.isSupported) {
      throw new Error('Text-to-speech is not supported in this environment');
    }

    if (!text || text.trim().length === 0) {
      return;
    }

    try {
      const mergedOptions: TextToSpeechOptions = {
        voice: options?.voice || this.state.currentVoice || undefined,
        lang: options?.lang || this.state.currentVoice?.lang,
        rate: options?.rate ?? this.state.rate,
        pitch: options?.pitch ?? this.state.pitch,
        volume: options?.volume ?? this.state.volume,
      };

      if (options?.rate !== undefined) this.state.rate = options.rate;
      if (options?.pitch !== undefined) this.state.pitch = options.pitch;
      if (options?.volume !== undefined) this.state.volume = options.volume;

      if (typeof mergedOptions.voice === 'string') {
        const voice = this.state.voices.find(
          v => v.name === mergedOptions.voice || v.voiceURI === mergedOptions.voice
        );
        if (voice) {
          mergedOptions.voice = voice;
          this.state.currentVoice = voice;
        }
      } else if (mergedOptions.voice) {
        this.state.currentVoice = mergedOptions.voice as Voice;
      }

      await this.provider.speak(text, mergedOptions);
    } catch (error) {
      this.handleError('speak-error', error);
      throw error;
    }
  }

  pause(): void {
    if (this.state.isSpeaking && !this.state.isPaused) {
      this.provider.pause();
    }
  }

  resume(): void {
    if (this.state.isSpeaking && this.state.isPaused) {
      this.provider.resume();
    }
  }

  cancel(): void {
    this.provider.cancel();
    this.state.isSpeaking = false;
    this.state.isPaused = false;
    this.emit('stateChange', { ...this.state });
  }

  getState(): TextToSpeechState {
    return { ...this.state };
  }

  isSupported(): boolean {
    return this.state.isSupported;
  }

  isSpeaking(): boolean {
    return this.state.isSpeaking;
  }

  isPaused(): boolean {
    return this.state.isPaused;
  }

  getVoices(): Voice[] {
    return [...this.state.voices];
  }

  setVoice(voice: Voice | string): void {
    if (typeof voice === 'string') {
      const foundVoice = this.state.voices.find(
        v => v.name === voice || v.voiceURI === voice
      );
      if (foundVoice) {
        this.state.currentVoice = foundVoice;
        this.emit('stateChange', { ...this.state });
      }
    } else {
      this.state.currentVoice = voice;
      this.emit('stateChange', { ...this.state });
    }
  }

  setRate(rate: number): void {
    this.state.rate = Math.max(0.1, Math.min(10, rate));
    this.emit('stateChange', { ...this.state });
  }

  setPitch(pitch: number): void {
    this.state.pitch = Math.max(0, Math.min(2, pitch));
    this.emit('stateChange', { ...this.state });
  }

  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(1, volume));
    this.emit('stateChange', { ...this.state });
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  destroy(): void {
    this.cancel();
    this.provider.removeAllListeners();
    this.listeners.clear();
  }
}