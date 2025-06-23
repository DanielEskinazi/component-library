// Video utilities for playback and processing

import type { VideoConfig, MediaMetadata } from './types';

export class VideoPlayer {
  private element: HTMLVideoElement;
  private config: VideoConfig;

  constructor(element: HTMLVideoElement, config: VideoConfig = {}) {
    this.element = element;
    this.config = config;
    this.applyConfig();
  }

  private applyConfig() {
    if (this.config.autoplay !== undefined) this.element.autoplay = this.config.autoplay;
    if (this.config.controls !== undefined) this.element.controls = this.config.controls;
    if (this.config.loop !== undefined) this.element.loop = this.config.loop;
    if (this.config.muted !== undefined) this.element.muted = this.config.muted;
    if (this.config.preload) this.element.preload = this.config.preload;
    if (this.config.poster) this.element.poster = this.config.poster;
  }

  play(): Promise<void> {
    return this.element.play();
  }

  pause() {
    this.element.pause();
  }

  seek(time: number) {
    this.element.currentTime = time;
  }

  setVolume(volume: number) {
    this.element.volume = Math.max(0, Math.min(1, volume));
  }

  getMetadata(): MediaMetadata {
    return {
      duration: this.element.duration,
      width: this.element.videoWidth,
      height: this.element.videoHeight,
      format: this.element.currentSrc.split('.').pop()
    };
  }

  onTimeUpdate(callback: (time: number) => void) {
    this.element.addEventListener('timeupdate', () => {
      callback(this.element.currentTime);
    });
  }

  onLoadedMetadata(callback: (metadata: MediaMetadata) => void) {
    this.element.addEventListener('loadedmetadata', () => {
      callback(this.getMetadata());
    });
  }
}

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];

  async startRecording(config: { video?: boolean; audio?: boolean } = {}): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: config.video !== false,
        audio: config.audio !== false
      });

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.chunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error(`Failed to start video recording: ${error}`);
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' });
        this.cleanup();
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.chunks = [];
  }
}