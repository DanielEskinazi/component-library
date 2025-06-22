import { AudioAnalysisResult } from './types';

export class AudioProcessor {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaStreamAudioSourceNode;
  private dataArray: Uint8Array;
  private isActive: boolean = false;

  constructor(stream: MediaStream) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    
    this.source = this.audioContext.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  start(): void {
    this.isActive = true;
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  stop(): void {
    this.isActive = false;
    this.source.disconnect();
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }

  getCurrentLevel(): number {
    if (!this.isActive) return 0;

    this.analyser.getByteTimeDomainData(this.dataArray);
    
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const value = (this.dataArray[i] - 128) / 128;
      sum += value * value;
    }
    
    const rms = Math.sqrt(sum / this.dataArray.length);
    return Math.min(1, rms * 3);
  }

  getFrequencyData(): Uint8Array {
    const freqData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freqData);
    return freqData;
  }

  getWaveformData(): Uint8Array {
    const waveData = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(waveData);
    return waveData;
  }

  analyzeAudio(): AudioAnalysisResult {
    if (!this.isActive) {
      return {
        averageLevel: 0,
        peakLevel: 0,
        rms: 0,
        isSilent: true,
      };
    }

    this.analyser.getByteTimeDomainData(this.dataArray);
    
    let sum = 0;
    let max = 0;
    let min = 255;
    
    for (let i = 0; i < this.dataArray.length; i++) {
      const value = this.dataArray[i];
      sum += value;
      max = Math.max(max, value);
      min = Math.min(min, value);
    }
    
    const average = sum / this.dataArray.length;
    const normalizedAverage = Math.abs(average - 128) / 128;
    const peakLevel = (max - min) / 255;
    
    let rmsSum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = (this.dataArray[i] - 128) / 128;
      rmsSum += normalized * normalized;
    }
    const rms = Math.sqrt(rmsSum / this.dataArray.length);
    
    const silenceThreshold = 0.01;
    const isSilent = rms < silenceThreshold;
    
    return {
      averageLevel: normalizedAverage,
      peakLevel,
      rms,
      isSilent,
    };
  }

  getSampleRate(): number {
    return this.audioContext.sampleRate;
  }
}