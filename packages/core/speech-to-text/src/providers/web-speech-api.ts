import { 
  SpeechRecognitionProvider, 
  SpeechRecognitionOptions,
  SpeechRecognitionResult,
  SpeechRecognitionError 
} from '../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class WebSpeechAPIProvider implements SpeechRecognitionProvider {
  private recognition: any;
  private resultCallbacks: Set<(result: SpeechRecognitionResult) => void>;
  private errorCallbacks: Set<(error: SpeechRecognitionError) => void>;
  private endCallbacks: Set<() => void>;

  constructor() {
    this.resultCallbacks = new Set();
    this.errorCallbacks = new Set();
    this.endCallbacks = new Set();
    
    if (this.isSupported()) {
      this.initializeRecognition();
    }
  }

  static isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  isSupported(): boolean {
    return WebSpeechAPIProvider.isAvailable();
  }

  private initializeRecognition(): void {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();

    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const resultIndex = event.resultIndex;
      
      for (let i = resultIndex; i < results.length; i++) {
        const result = results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 1;
        
        const speechResult: SpeechRecognitionResult = {
          transcript,
          confidence,
          isFinal: result.isFinal,
          timestamp: Date.now(),
        };

        this.resultCallbacks.forEach(callback => callback(speechResult));
      }
    };

    this.recognition.onerror = (event: any) => {
      const error: SpeechRecognitionError = {
        error: event.error,
        message: this.getErrorMessage(event.error),
        timestamp: Date.now(),
      };

      this.errorCallbacks.forEach(callback => callback(error));
    };

    this.recognition.onend = () => {
      this.endCallbacks.forEach(callback => callback());
    };
  }

  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'no-speech': 'No speech was detected',
      'aborted': 'Speech recognition was aborted',
      'audio-capture': 'No microphone was found',
      'network': 'Network error occurred',
      'not-allowed': 'Permission to use microphone was denied',
      'service-not-allowed': 'Speech recognition service is not allowed',
      'bad-grammar': 'Grammar error in speech recognition',
      'language-not-supported': 'Language is not supported',
    };

    return errorMessages[error] || `Speech recognition error: ${error}`;
  }

  async start(options: SpeechRecognitionOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Speech recognition is not supported');
    }

    if (!this.recognition) {
      this.initializeRecognition();
    }

    this.recognition.lang = options.lang || navigator.language || 'en-US';
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.maxAlternatives = options.maxAlternatives ?? 1;

    return new Promise((resolve, reject) => {
      try {
        this.recognition.start();
        
        const handleStart = () => {
          this.recognition.removeEventListener('start', handleStart);
          this.recognition.removeEventListener('error', handleError);
          resolve();
        };

        const handleError = (event: any) => {
          this.recognition.removeEventListener('start', handleStart);
          this.recognition.removeEventListener('error', handleError);
          reject(new Error(event.error));
        };

        this.recognition.addEventListener('start', handleStart);
        this.recognition.addEventListener('error', handleError);
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop(): Promise<void> {
    if (!this.recognition) {
      return;
    }

    return new Promise((resolve) => {
      const handleEnd = () => {
        this.recognition.removeEventListener('end', handleEnd);
        resolve();
      };

      this.recognition.addEventListener('end', handleEnd);
      this.recognition.stop();
    });
  }

  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  onResult(callback: (result: SpeechRecognitionResult) => void): void {
    this.resultCallbacks.add(callback);
  }

  onError(callback: (error: SpeechRecognitionError) => void): void {
    this.errorCallbacks.add(callback);
  }

  onEnd(callback: () => void): void {
    this.endCallbacks.add(callback);
  }

  removeAllListeners(): void {
    this.resultCallbacks.clear();
    this.errorCallbacks.clear();
    this.endCallbacks.clear();
  }
}