/**
 * @jest-environment jsdom
 */

import { SpeechRecognition } from '../speech-to-text/speech-recognition';

describe('Audio Core Package', () => {
  it('should export SpeechRecognition class', () => {
    expect(SpeechRecognition).toBeDefined();
    expect(typeof SpeechRecognition).toBe('function');
  });

  it('should create SpeechRecognition instance', () => {
    const speechRecognition = new SpeechRecognition();
    expect(speechRecognition).toBeInstanceOf(SpeechRecognition);
  });

  it('should handle provider initialization', () => {
    // Test with complete mock provider
    const mockProvider = {
      isSupported: () => true,
      start: jest.fn(() => Promise.resolve()),
      stop: jest.fn(),
      isListening: () => false,
      onResult: jest.fn(),
      onError: jest.fn(),
      onStateChange: jest.fn(),
      onEnd: jest.fn(),
    };
    
    const speechRecognition = new SpeechRecognition(mockProvider as any);
    expect(speechRecognition).toBeInstanceOf(SpeechRecognition);
  });
});