import { SpeechRecognitionResult } from './types';

export function formatTranscript(results: SpeechRecognitionResult[]): string {
  return results
    .filter(result => result.isFinal)
    .map(result => result.transcript)
    .join(' ')
    .trim();
}

export function getAverageConfidence(results: SpeechRecognitionResult[]): number {
  if (results.length === 0) return 0;
  
  const totalConfidence = results.reduce((sum, result) => sum + result.confidence, 0);
  return totalConfidence / results.length;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function getMicrophonePermissionStatus(): Promise<PermissionStatus | null> {
  if (!navigator.permissions || !navigator.permissions.query) {
    return Promise.resolve(null);
  }

  return navigator.permissions
    .query({ name: 'microphone' as PermissionName })
    .catch(() => null);
}

export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    return false;
  }
}

export function getSupportedLanguages(): string[] {
  return [
    'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-ZA',
    'es-ES', 'es-MX', 'es-AR', 'es-CL', 'es-CO', 'es-PE', 'es-VE',
    'fr-FR', 'fr-CA', 'fr-BE', 'fr-CH',
    'de-DE', 'de-AT', 'de-CH',
    'it-IT', 'it-CH',
    'pt-BR', 'pt-PT',
    'nl-NL', 'nl-BE',
    'pl-PL',
    'ru-RU',
    'ja-JP',
    'ko-KR',
    'zh-CN', 'zh-TW', 'zh-HK',
    'ar-SA', 'ar-AE', 'ar-EG',
    'hi-IN',
    'th-TH',
    'sv-SE',
    'da-DK',
    'no-NO',
    'fi-FI',
    'tr-TR',
    'el-GR',
    'he-IL',
    'hu-HU',
    'cs-CZ',
    'sk-SK',
    'ro-RO',
    'uk-UA',
    'vi-VN',
    'id-ID',
    'ms-MY',
    'bn-IN', 'bn-BD',
    'ta-IN', 'ta-SG', 'ta-LK',
    'te-IN',
    'mr-IN',
    'gu-IN',
    'kn-IN',
    'ml-IN',
  ];
}