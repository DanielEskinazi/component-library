export interface AudioRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  sampleRate?: number;
  numberOfChannels?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

export interface AudioRecorderState {
  isSupported: boolean;
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
  error: AudioRecorderError | null;
}

export interface AudioRecorderError {
  error: string;
  message: string;
  timestamp: number;
}

export interface AudioData {
  blob: Blob;
  duration: number;
  mimeType: string;
  size: number;
  url: string;
}

export interface WaveformData {
  peaks: number[];
  duration: number;
  sampleRate: number;
}

export interface AudioAnalysisResult {
  averageLevel: number;
  peakLevel: number;
  rms: number;
  isSilent: boolean;
}

export type AudioFormat = 'webm' | 'mp4' | 'ogg' | 'wav';

export interface AudioConstraints extends MediaTrackConstraints {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  sampleRate?: number;
  channelCount?: number;
}

export type AudioRecorderEvent = 
  | { type: 'start' }
  | { type: 'stop'; data: AudioData }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'dataAvailable'; data: Blob }
  | { type: 'error'; error: AudioRecorderError }
  | { type: 'levelUpdate'; level: number };