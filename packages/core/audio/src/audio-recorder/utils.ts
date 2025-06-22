import { AudioData, AudioFormat } from './types';

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export async function downloadAudioFile(
  audioData: AudioData,
  filename: string = 'recording'
): Promise<void> {
  const extension = getFileExtension(audioData.mimeType);
  const fullFilename = `${filename}.${extension}`;

  const a = document.createElement('a');
  a.href = audioData.url;
  a.download = fullFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function getFileExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/wave': 'wav',
  };

  const match = mimeType.match(/audio\/(\w+)/);
  if (match && mimeToExt[mimeType]) {
    return mimeToExt[mimeType];
  }

  return match ? match[1] : 'audio';
}

export function getMimeType(format: AudioFormat): string {
  const formatToMime: Record<AudioFormat, string> = {
    'webm': 'audio/webm;codecs=opus',
    'mp4': 'audio/mp4',
    'ogg': 'audio/ogg;codecs=opus',
    'wav': 'audio/wav',
  };

  return formatToMime[format] || 'audio/webm';
}

export async function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function convertBlobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer();
}

export function createWaveformCanvas(
  peaks: number[],
  width: number,
  height: number,
  color: string = '#4F46E5'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d')!;
  const barWidth = width / peaks.length;
  const centerY = height / 2;

  ctx.fillStyle = color;

  peaks.forEach((peak, index) => {
    const x = index * barWidth;
    const barHeight = peak * centerY * 0.8;
    
    ctx.fillRect(
      x,
      centerY - barHeight,
      barWidth - 1,
      barHeight * 2
    );
  });

  return canvas;
}

export function detectAudioFormat(blob: Blob): AudioFormat | null {
  const mimeType = blob.type.toLowerCase();
  
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  
  return null;
}

export function calculateBitrate(size: number, duration: number): number {
  if (duration === 0) return 0;
  return Math.round((size * 8) / duration);
}

export async function checkMicrophonePermission(): Promise<PermissionState> {
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ 
      name: 'microphone' as PermissionName 
    });
    return result.state;
  } catch {
    return 'prompt';
  }
}

export async function requestMicrophoneAccess(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone access denied:', error);
    return false;
  }
}