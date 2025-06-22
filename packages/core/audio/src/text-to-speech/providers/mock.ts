import {
  TextToSpeechProvider,
  TextToSpeechOptions,
  TextToSpeechError,
  Voice,
} from '../types';

export class MockTTSProvider implements TextToSpeechProvider {
  private startCallbacks: Set<() => void>;
  private endCallbacks: Set<() => void>;
  private pauseCallbacks: Set<() => void>;
  private resumeCallbacks: Set<() => void>;
  private errorCallbacks: Set<(error: TextToSpeechError) => void>;
  private isSpeaking: boolean;
  private isPaused: boolean;
  private speakTimeout?: NodeJS.Timeout;
  private mockVoices: Voice[];

  constructor() {
    this.startCallbacks = new Set();
    this.endCallbacks = new Set();
    this.pauseCallbacks = new Set();
    this.resumeCallbacks = new Set();
    this.errorCallbacks = new Set();
    this.isSpeaking = false;
    this.isPaused = false;
    
    this.mockVoices = [
      {
        name: 'Mock Voice (English)',
        lang: 'en-US',
        voiceURI: 'mock-voice-en-us',
        default: true,
        localService: true,
      },
      {
        name: 'Mock Voice (Spanish)',
        lang: 'es-ES',
        voiceURI: 'mock-voice-es-es',
        default: false,
        localService: true,
      },
      {
        name: 'Mock Voice (French)',
        lang: 'fr-FR',
        voiceURI: 'mock-voice-fr-fr',
        default: false,
        localService: true,
      },
      {
        name: 'Mock Voice (German)',
        lang: 'de-DE',
        voiceURI: 'mock-voice-de-de',
        default: false,
        localService: true,
      },
      {
        name: 'Mock Voice (Japanese)',
        lang: 'ja-JP',
        voiceURI: 'mock-voice-ja-jp',
        default: false,
        localService: true,
      },
    ];
  }

  isSupported(): boolean {
    return true;
  }

  async getVoices(): Promise<Voice[]> {
    return Promise.resolve([...this.mockVoices]);
  }

  async speak(text: string, options?: TextToSpeechOptions): Promise<void> {
    if (this.isSpeaking) {
      this.cancel();
    }

    this.isSpeaking = true;
    this.isPaused = false;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.isSpeaking) {
          reject(new Error('Speech was canceled'));
          return;
        }

        this.startCallbacks.forEach(callback => callback());

        const words = text.split(' ');
        const rate = options?.rate || 1;
        const wordDuration = 300 / rate;
        const totalDuration = words.length * wordDuration;

        this.speakTimeout = setTimeout(() => {
          if (this.isSpeaking) {
            this.isSpeaking = false;
            this.endCallbacks.forEach(callback => callback());
            resolve();
          }
        }, totalDuration);
      }, 100);
    });
  }

  pause(): void {
    if (this.isSpeaking && !this.isPaused) {
      this.isPaused = true;
      this.pauseCallbacks.forEach(callback => callback());
    }
  }

  resume(): void {
    if (this.isSpeaking && this.isPaused) {
      this.isPaused = false;
      this.resumeCallbacks.forEach(callback => callback());
    }
  }

  cancel(): void {
    this.isSpeaking = false;
    this.isPaused = false;
    
    if (this.speakTimeout) {
      clearTimeout(this.speakTimeout);
      this.speakTimeout = undefined;
    }
    
    this.endCallbacks.forEach(callback => callback());
  }

  onStart(callback: () => void): void {
    this.startCallbacks.add(callback);
  }

  onEnd(callback: () => void): void {
    this.endCallbacks.add(callback);
  }

  onPause(callback: () => void): void {
    this.pauseCallbacks.add(callback);
  }

  onResume(callback: () => void): void {
    this.resumeCallbacks.add(callback);
  }

  onError(callback: (error: TextToSpeechError) => void): void {
    this.errorCallbacks.add(callback);
  }

  removeAllListeners(): void {
    this.startCallbacks.clear();
    this.endCallbacks.clear();
    this.pauseCallbacks.clear();
    this.resumeCallbacks.clear();
    this.errorCallbacks.clear();
  }
}