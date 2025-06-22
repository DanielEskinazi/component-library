import { 
  SpeechRecognitionProvider, 
  SpeechRecognitionOptions,
  SpeechRecognitionResult,
  SpeechRecognitionError 
} from '../types';

export class MockProvider implements SpeechRecognitionProvider {
  private resultCallbacks: Set<(result: SpeechRecognitionResult) => void>;
  private errorCallbacks: Set<(error: SpeechRecognitionError) => void>;
  private endCallbacks: Set<() => void>;
  private isRunning: boolean;
  private mockInterval?: NodeJS.Timeout;
  private mockPhrases: string[];

  constructor() {
    this.resultCallbacks = new Set();
    this.errorCallbacks = new Set();
    this.endCallbacks = new Set();
    this.isRunning = false;
    this.mockPhrases = [
      'Hello world',
      'This is a test',
      'Speech recognition is working',
      'Mock provider is active',
      'Testing speech to text functionality',
    ];
  }

  isSupported(): boolean {
    return true;
  }

  async start(_options: SpeechRecognitionOptions = {}): Promise<void> {
    if (this.isRunning) {
      throw new Error('Recognition is already running');
    }

    this.isRunning = true;
    let phraseIndex = 0;

    this.mockInterval = setInterval(() => {
      if (!this.isRunning) {
        return;
      }

      const phrase = this.mockPhrases[phraseIndex % this.mockPhrases.length];
      const words = phrase.split(' ');
      
      words.forEach((_word, index) => {
        setTimeout(() => {
          if (!this.isRunning) return;

          const isLastWord = index === words.length - 1;
          const transcript = words.slice(0, index + 1).join(' ');

          const result: SpeechRecognitionResult = {
            transcript,
            confidence: 0.95 + Math.random() * 0.05,
            isFinal: isLastWord,
            timestamp: Date.now(),
          };

          this.resultCallbacks.forEach(callback => callback(result));
        }, index * 200);
      });

      phraseIndex++;
    }, 3000);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = undefined;
    }
    
    setTimeout(() => {
      this.endCallbacks.forEach(callback => callback());
    }, 100);
  }

  abort(): void {
    this.isRunning = false;
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = undefined;
    }
    
    this.endCallbacks.forEach(callback => callback());
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