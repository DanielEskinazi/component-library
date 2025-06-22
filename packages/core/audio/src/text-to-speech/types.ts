export interface Voice {
  name: string;
  lang: string;
  voiceURI: string;
  default: boolean;
  localService: boolean;
}

export interface TextToSpeechOptions {
  voice?: Voice | string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface TextToSpeechState {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  voices: Voice[];
  currentVoice: Voice | null;
  rate: number;
  pitch: number;
  volume: number;
  error: TextToSpeechError | null;
}

export interface TextToSpeechError {
  error: string;
  message: string;
  timestamp: number;
}

export interface TextToSpeechProvider {
  isSupported(): boolean;
  getVoices(): Promise<Voice[]>;
  speak(text: string, options?: TextToSpeechOptions): Promise<void>;
  pause(): void;
  resume(): void;
  cancel(): void;
  onStart(callback: () => void): void;
  onEnd(callback: () => void): void;
  onPause(callback: () => void): void;
  onResume(callback: () => void): void;
  onError(callback: (error: TextToSpeechError) => void): void;
  removeAllListeners(): void;
}

export type TextToSpeechEvent = 
  | { type: 'start' }
  | { type: 'end' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'error'; error: TextToSpeechError }
  | { type: 'voicesChanged'; voices: Voice[] };