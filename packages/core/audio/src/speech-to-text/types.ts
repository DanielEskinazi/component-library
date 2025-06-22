export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: number;
}

export interface SpeechRecognitionError {
  error: string;
  message: string;
  timestamp: number;
}

export interface SpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  grammars?: string[];
}

export interface SpeechRecognitionProvider {
  isSupported(): boolean;
  start(options?: SpeechRecognitionOptions): Promise<void>;
  stop(): Promise<void>;
  abort(): void;
  onResult(callback: (result: SpeechRecognitionResult) => void): void;
  onError(callback: (error: SpeechRecognitionError) => void): void;
  onEnd(callback: () => void): void;
  removeAllListeners(): void;
}

export interface SpeechRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  error: SpeechRecognitionError | null;
  results: SpeechRecognitionResult[];
  interimTranscript: string;
  finalTranscript: string;
}

export type SpeechRecognitionEvent = 
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'result'; result: SpeechRecognitionResult }
  | { type: 'error'; error: SpeechRecognitionError }
  | { type: 'end' };