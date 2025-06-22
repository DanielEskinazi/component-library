import {
  AudioRecorderOptions,
  AudioRecorderState,
  AudioRecorderError,
  AudioData,
  AudioConstraints,
} from './types';
import { AudioProcessor } from './audio-processor';

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private audioProcessor: AudioProcessor | null = null;
  private chunks: Blob[] = [];
  private startTime: number = 0;
  private pausedDuration: number = 0;
  private pauseStartTime: number = 0;
  private state: AudioRecorderState;
  private listeners: Map<string, Set<Function>>;
  private levelUpdateInterval?: number;

  constructor() {
    this.listeners = new Map();
    this.state = {
      isSupported: this.checkSupport(),
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioLevel: 0,
      error: null,
    };
  }

  private checkSupport(): boolean {
    return typeof window !== 'undefined' && 
           'MediaRecorder' in window && 
           'getUserMedia' in navigator.mediaDevices;
  }

  async start(options: AudioRecorderOptions = {}): Promise<void> {
    if (!this.state.isSupported) {
      throw new Error('Audio recording is not supported in this environment');
    }

    if (this.state.isRecording) {
      throw new Error('Recording is already in progress');
    }

    try {
      const constraints: AudioConstraints = {
        audio: {
          echoCancellation: options.echoCancellation ?? true,
          noiseSuppression: options.noiseSuppression ?? true,
          autoGainControl: options.autoGainControl ?? true,
          sampleRate: options.sampleRate,
          channelCount: options.numberOfChannels,
        }
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const mimeType = this.getOptimalMimeType(options.mimeType);
      const recorderOptions: MediaRecorderOptions = {
        mimeType,
      };

      if (options.audioBitsPerSecond) {
        recorderOptions.audioBitsPerSecond = options.audioBitsPerSecond;
      }

      this.mediaRecorder = new MediaRecorder(this.mediaStream, recorderOptions);
      this.setupMediaRecorderHandlers();

      this.audioProcessor = new AudioProcessor(this.mediaStream);
      this.audioProcessor.start();
      
      this.startLevelMonitoring();

      this.chunks = [];
      this.startTime = Date.now();
      this.pausedDuration = 0;
      
      this.mediaRecorder.start();
      
      this.state.isRecording = true;
      this.state.isPaused = false;
      this.state.error = null;
      
      this.emit('start');
      this.emit('stateChange', { ...this.state });
    } catch (error) {
      this.handleError('start-error', error);
      throw error;
    }
  }

  private getOptimalMimeType(preferredType?: string): string {
    const types = [
      preferredType,
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mpeg',
    ].filter(Boolean) as string[];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return '';
  }

  private setupMediaRecorderHandlers(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
        this.emit('dataAvailable', event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { 
        type: this.mediaRecorder!.mimeType || 'audio/webm' 
      });
      
      const duration = this.calculateDuration();
      const audioData: AudioData = {
        blob,
        duration,
        mimeType: blob.type,
        size: blob.size,
        url: URL.createObjectURL(blob),
      };

      this.emit('stop', audioData);
      this.cleanup();
    };

    this.mediaRecorder.onerror = (event: Event) => {
      this.handleError('recording-error', new Error('MediaRecorder error'));
    };

    this.mediaRecorder.onpause = () => {
      this.pauseStartTime = Date.now();
      this.state.isPaused = true;
      this.emit('pause');
      this.emit('stateChange', { ...this.state });
    };

    this.mediaRecorder.onresume = () => {
      this.pausedDuration += Date.now() - this.pauseStartTime;
      this.state.isPaused = false;
      this.emit('resume');
      this.emit('stateChange', { ...this.state });
    };
  }

  private startLevelMonitoring(): void {
    this.levelUpdateInterval = window.setInterval(() => {
      if (this.audioProcessor && this.state.isRecording && !this.state.isPaused) {
        const level = this.audioProcessor.getCurrentLevel();
        this.state.audioLevel = level;
        this.emit('levelUpdate', level);
      }
    }, 100);
  }

  private calculateDuration(): number {
    if (!this.startTime) return 0;
    
    let duration = Date.now() - this.startTime - this.pausedDuration;
    if (this.state.isPaused) {
      duration -= (Date.now() - this.pauseStartTime);
    }
    
    return duration / 1000;
  }

  pause(): void {
    if (!this.mediaRecorder || !this.state.isRecording || this.state.isPaused) {
      return;
    }

    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resume(): void {
    if (!this.mediaRecorder || !this.state.isRecording || !this.state.isPaused) {
      return;
    }

    if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  async stop(): Promise<AudioData> {
    if (!this.mediaRecorder || !this.state.isRecording) {
      throw new Error('No recording in progress');
    }

    return new Promise((resolve) => {
      const handleStop = (audioData: AudioData) => {
        this.off('stop', handleStop);
        resolve(audioData);
      };

      this.on('stop', handleStop);
      
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  private cleanup(): void {
    if (this.levelUpdateInterval) {
      clearInterval(this.levelUpdateInterval);
      this.levelUpdateInterval = undefined;
    }

    if (this.audioProcessor) {
      this.audioProcessor.stop();
      this.audioProcessor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    this.mediaRecorder = null;
    this.state.isRecording = false;
    this.state.isPaused = false;
    this.state.audioLevel = 0;
    
    this.emit('stateChange', { ...this.state });
  }

  private handleError(errorType: string, error: unknown): void {
    const recorderError: AudioRecorderError = {
      error: errorType,
      message: error instanceof Error ? error.message : String(error),
      timestamp: Date.now(),
    };

    this.state.error = recorderError;
    this.emit('error', recorderError);
    this.emit('stateChange', { ...this.state });
    
    this.cleanup();
  }

  getState(): AudioRecorderState {
    return { 
      ...this.state,
      duration: this.state.isRecording ? this.calculateDuration() : 0,
    };
  }

  isSupported(): boolean {
    return this.state.isSupported;
  }

  isRecording(): boolean {
    return this.state.isRecording;
  }

  isPaused(): boolean {
    return this.state.isPaused;
  }

  getSupportedMimeTypes(): string[] {
    if (!this.state.isSupported) return [];

    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
    ];

    return types.filter(type => MediaRecorder.isTypeSupported(type));
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
    if (this.state.isRecording) {
      this.mediaRecorder?.stop();
    }
    this.cleanup();
    this.listeners.clear();
  }
}