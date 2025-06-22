import { 
  SpeechRecognitionProvider, 
  SpeechRecognitionOptions,
  SpeechRecognitionResult,
  SpeechRecognitionError,
  SpeechRecognitionState,
  SpeechRecognitionEvent
} from './types';
import { WebSpeechAPIProvider } from './providers/web-speech-api';
import { MockProvider } from './providers/mock';

export class SpeechRecognition {
  private provider: SpeechRecognitionProvider;
  private state: SpeechRecognitionState;
  private listeners: Map<string, Set<Function>>;

  constructor(provider?: SpeechRecognitionProvider) {
    this.provider = provider || this.createDefaultProvider();
    this.listeners = new Map();
    this.state = {
      isListening: false,
      isSupported: this.provider.isSupported(),
      error: null,
      results: [],
      interimTranscript: '',
      finalTranscript: '',
    };

    this.setupProviderListeners();
  }

  private createDefaultProvider(): SpeechRecognitionProvider {
    if (WebSpeechAPIProvider.isAvailable()) {
      return new WebSpeechAPIProvider();
    }
    return new MockProvider();
  }

  private setupProviderListeners(): void {
    this.provider.onResult((result) => {
      this.handleResult(result);
    });

    this.provider.onError((error) => {
      this.handleError(error);
    });

    this.provider.onEnd(() => {
      this.handleEnd();
    });
  }

  private handleResult(result: SpeechRecognitionResult): void {
    this.state.results.push(result);

    if (result.isFinal) {
      this.state.finalTranscript += result.transcript + ' ';
      this.state.interimTranscript = '';
    } else {
      this.state.interimTranscript = result.transcript;
    }

    this.emit('result', result);
    this.emit('stateChange', { ...this.state });
  }

  private handleError(error: SpeechRecognitionError): void {
    this.state.error = error;
    this.state.isListening = false;
    this.emit('error', error);
    this.emit('stateChange', { ...this.state });
  }

  private handleEnd(): void {
    this.state.isListening = false;
    this.emit('end');
    this.emit('stateChange', { ...this.state });
  }

  async start(options?: SpeechRecognitionOptions): Promise<void> {
    if (!this.state.isSupported) {
      throw new Error('Speech recognition is not supported in this environment');
    }

    if (this.state.isListening) {
      return;
    }

    try {
      await this.provider.start(options);
      this.state.isListening = true;
      this.state.error = null;
      this.state.results = [];
      this.state.interimTranscript = '';
      this.emit('start');
      this.emit('stateChange', { ...this.state });
    } catch (error) {
      this.handleError({
        error: 'start-error',
        message: error instanceof Error ? error.message : 'Failed to start speech recognition',
        timestamp: Date.now(),
      });
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.state.isListening) {
      return;
    }

    try {
      await this.provider.stop();
    } catch (error) {
      this.handleError({
        error: 'stop-error',
        message: error instanceof Error ? error.message : 'Failed to stop speech recognition',
        timestamp: Date.now(),
      });
      throw error;
    }
  }

  abort(): void {
    this.provider.abort();
    this.state.isListening = false;
    this.emit('abort');
    this.emit('stateChange', { ...this.state });
  }

  getState(): SpeechRecognitionState {
    return { ...this.state };
  }

  isSupported(): boolean {
    return this.state.isSupported;
  }

  isListening(): boolean {
    return this.state.isListening;
  }

  getTranscript(): string {
    return this.state.finalTranscript + this.state.interimTranscript;
  }

  clearTranscript(): void {
    this.state.finalTranscript = '';
    this.state.interimTranscript = '';
    this.state.results = [];
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
    this.abort();
    this.provider.removeAllListeners();
    this.listeners.clear();
  }
}