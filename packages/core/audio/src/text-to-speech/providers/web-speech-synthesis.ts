import {
  TextToSpeechProvider,
  TextToSpeechOptions,
  TextToSpeechError,
  Voice,
} from '../types';

export class WebSpeechSynthesisProvider implements TextToSpeechProvider {
  private synthesis: SpeechSynthesis | null;
  private startCallbacks: Set<() => void>;
  private endCallbacks: Set<() => void>;
  private pauseCallbacks: Set<() => void>;
  private resumeCallbacks: Set<() => void>;
  private errorCallbacks: Set<(error: TextToSpeechError) => void>;
  // private _currentUtterance: SpeechSynthesisUtterance | null;

  constructor() {
    this.synthesis = this.isSupported() ? window.speechSynthesis : null;
    this.startCallbacks = new Set();
    this.endCallbacks = new Set();
    this.pauseCallbacks = new Set();
    this.resumeCallbacks = new Set();
    this.errorCallbacks = new Set();
    // this._currentUtterance = null;
  }

  static isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  isSupported(): boolean {
    return WebSpeechSynthesisProvider.isAvailable();
  }

  async getVoices(): Promise<Voice[]> {
    if (!this.synthesis) {
      return [];
    }

    return new Promise((resolve) => {
      const loadVoices = () => {
        const voices = this.synthesis!.getVoices();
        const mappedVoices: Voice[] = voices.map(voice => ({
          name: voice.name,
          lang: voice.lang,
          voiceURI: voice.voiceURI,
          default: voice.default,
          localService: voice.localService,
        }));
        resolve(mappedVoices);
      };

      if (this.synthesis!.getVoices().length > 0) {
        loadVoices();
      } else {
        this.synthesis!.addEventListener('voiceschanged', loadVoices, { once: true });
        
        setTimeout(() => {
          const voices = this.synthesis!.getVoices();
          if (voices.length === 0) {
            resolve([]);
          }
        }, 1000);
      }
    });
  }

  async speak(text: string, options?: TextToSpeechOptions): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Speech synthesis is not supported');
    }

    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // this._currentUtterance = utterance;

    if (options?.voice) {
      let voice: SpeechSynthesisVoice | undefined;
      if (typeof options.voice === 'string') {
        voice = this.synthesis.getVoices().find(v => v.name === options.voice);
      } else {
        const voiceObj = options.voice as Voice;
        voice = this.synthesis.getVoices().find(
          v => v.name === voiceObj.name || v.voiceURI === voiceObj.voiceURI
        );
      }
      if (voice) {
        utterance.voice = voice;
      }
    }

    if (options?.lang) {
      utterance.lang = options.lang;
    }

    if (options?.rate !== undefined) {
      utterance.rate = options.rate;
    }

    if (options?.pitch !== undefined) {
      utterance.pitch = options.pitch;
    }

    if (options?.volume !== undefined) {
      utterance.volume = options.volume;
    }

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        this.startCallbacks.forEach(callback => callback());
      };

      utterance.onend = () => {
        // this._currentUtterance = null;
        this.endCallbacks.forEach(callback => callback());
        resolve();
      };

      utterance.onpause = () => {
        this.pauseCallbacks.forEach(callback => callback());
      };

      utterance.onresume = () => {
        this.resumeCallbacks.forEach(callback => callback());
      };

      utterance.onerror = (event) => {
        // this._currentUtterance = null;
        const error: TextToSpeechError = {
          error: event.error,
          message: this.getErrorMessage(event.error),
          timestamp: Date.now(),
        };
        this.errorCallbacks.forEach(callback => callback(error));
        reject(new Error(error.message));
      };

      this.synthesis!.speak(utterance);
    });
  }

  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'canceled': 'Speech synthesis was canceled',
      'interrupted': 'Speech synthesis was interrupted',
      'audio-busy': 'Audio output is busy',
      'audio-hardware': 'Audio hardware error',
      'network': 'Network error occurred',
      'synthesis-unavailable': 'Speech synthesis is unavailable',
      'synthesis-failed': 'Speech synthesis failed',
      'language-unavailable': 'Language is not available',
      'voice-unavailable': 'Voice is not available',
      'text-too-long': 'Text is too long for synthesis',
      'invalid-argument': 'Invalid argument provided',
      'not-allowed': 'Speech synthesis is not allowed',
    };

    return errorMessages[error] || `Speech synthesis error: ${error}`;
  }

  pause(): void {
    if (this.synthesis && this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  cancel(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      // this._currentUtterance = null;
    }
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