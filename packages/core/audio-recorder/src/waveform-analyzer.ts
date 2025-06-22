import { WaveformData } from './types';

export class WaveformAnalyzer {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async analyzeBlob(blob: Blob, samples: number = 200): Promise<WaveformData> {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    return this.analyzeAudioBuffer(audioBuffer, samples);
  }

  analyzeAudioBuffer(audioBuffer: AudioBuffer, samples: number = 200): WaveformData {
    const rawData = audioBuffer.getChannelData(0);
    const totalSamples = rawData.length;
    const blockSize = Math.floor(totalSamples / samples);
    const peaks: number[] = [];

    for (let i = 0; i < samples; i++) {
      const start = blockSize * i;
      let max = 0;
      
      for (let j = 0; j < blockSize; j++) {
        const value = Math.abs(rawData[start + j] || 0);
        if (value > max) {
          max = value;
        }
      }
      
      peaks.push(max);
    }

    const normalizedPeaks = this.normalizePeaks(peaks);

    return {
      peaks: normalizedPeaks,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
    };
  }

  private normalizePeaks(peaks: number[]): number[] {
    const maxPeak = Math.max(...peaks);
    if (maxPeak === 0) return peaks;
    
    return peaks.map(peak => peak / maxPeak);
  }

  generateWaveformPath(peaks: number[], width: number, height: number): string {
    const barWidth = width / peaks.length;
    const centerY = height / 2;
    let path = '';

    peaks.forEach((peak, index) => {
      const x = index * barWidth;
      const barHeight = peak * centerY * 0.8;
      
      path += `M${x},${centerY - barHeight} L${x},${centerY + barHeight} `;
    });

    return path.trim();
  }

  generateSmoothWaveformPath(peaks: number[], width: number, height: number): string {
    if (peaks.length === 0) return '';

    const points: [number, number][] = [];
    const barWidth = width / peaks.length;
    const centerY = height / 2;

    peaks.forEach((peak, index) => {
      const x = index * barWidth + barWidth / 2;
      const y = centerY - (peak * centerY * 0.8);
      points.push([x, y]);
    });

    const mirroredPoints: [number, number][] = peaks.map((peak, index) => {
      const x = (peaks.length - 1 - index) * barWidth + barWidth / 2;
      const y = centerY + (peak * centerY * 0.8);
      return [x, y];
    }).reverse();

    const allPoints = [...points, ...mirroredPoints];
    return this.createSmoothPath(allPoints);
  }

  private createSmoothPath(points: [number, number][]): string {
    if (points.length < 2) return '';

    let path = `M ${points[0][0]},${points[0][1]}`;

    for (let i = 1; i < points.length; i++) {
      const xMid = (points[i - 1][0] + points[i][0]) / 2;
      const yMid = (points[i - 1][1] + points[i][1]) / 2;
      const cp1x = (xMid + points[i - 1][0]) / 2;
      const cp2x = (xMid + points[i][0]) / 2;

      path += ` Q ${cp1x},${points[i - 1][1]} ${xMid},${yMid}`;
      path += ` Q ${cp2x},${points[i][1]} ${points[i][0]},${points[i][1]}`;
    }

    path += ' Z';
    return path;
  }

  getAverageVolume(peaks: number[]): number {
    if (peaks.length === 0) return 0;
    const sum = peaks.reduce((acc, peak) => acc + peak, 0);
    return sum / peaks.length;
  }

  findSilentRegions(peaks: number[], threshold: number = 0.05): Array<[number, number]> {
    const regions: Array<[number, number]> = [];
    let inSilence = false;
    let silenceStart = 0;

    peaks.forEach((peak, index) => {
      if (peak < threshold && !inSilence) {
        inSilence = true;
        silenceStart = index;
      } else if (peak >= threshold && inSilence) {
        inSilence = false;
        regions.push([silenceStart, index - 1]);
      }
    });

    if (inSilence) {
      regions.push([silenceStart, peaks.length - 1]);
    }

    return regions;
  }

  destroy(): void {
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}