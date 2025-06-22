import { Voice } from './types';

export function getVoicesByLanguage(voices: Voice[], lang: string): Voice[] {
  return voices.filter(voice => voice.lang.startsWith(lang));
}

export function getDefaultVoice(voices: Voice[], preferredLang?: string): Voice | null {
  if (voices.length === 0) return null;

  if (preferredLang) {
    const langVoices = getVoicesByLanguage(voices, preferredLang);
    const defaultLangVoice = langVoices.find(v => v.default);
    if (defaultLangVoice) return defaultLangVoice;
    if (langVoices.length > 0) return langVoices[0];
  }

  const defaultVoice = voices.find(v => v.default);
  return defaultVoice || voices[0];
}

export function calculateReadingTime(text: string, wordsPerMinute: number = 150): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil((words / wordsPerMinute) * 60 * 1000);
}

export function splitTextIntoChunks(text: string, maxChunkSize: number = 200): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function sanitizeTextForSpeech(text: string): string {
  return text
    .replace(/https?:\/\/[^\s]+/g, 'link')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\1+/g, '$1')
    .trim();
}

export function getLanguageName(langCode: string): string {
  const languages: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'nl': 'Dutch',
    'pl': 'Polish',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish',
    'tr': 'Turkish',
    'el': 'Greek',
    'he': 'Hebrew',
  };

  const baseLang = langCode.split('-')[0];
  return languages[baseLang] || langCode;
}

export function groupVoicesByLanguage(voices: Voice[]): Map<string, Voice[]> {
  const grouped = new Map<string, Voice[]>();

  for (const voice of voices) {
    const langKey = voice.lang.split('-')[0];
    if (!grouped.has(langKey)) {
      grouped.set(langKey, []);
    }
    grouped.get(langKey)!.push(voice);
  }

  return grouped;
}

export function rateToSpeed(rate: number): string {
  if (rate < 0.5) return 'Very Slow';
  if (rate < 0.8) return 'Slow';
  if (rate < 1.2) return 'Normal';
  if (rate < 1.5) return 'Fast';
  return 'Very Fast';
}

export function pitchToDescription(pitch: number): string {
  if (pitch < 0.5) return 'Very Low';
  if (pitch < 0.8) return 'Low';
  if (pitch < 1.2) return 'Normal';
  if (pitch < 1.5) return 'High';
  return 'Very High';
}