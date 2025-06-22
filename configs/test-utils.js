/**
 * Shared test utilities for all packages
 * Common mocks, helpers, and testing patterns
 */

/**
 * Creates a mock speech recognition result event
 */
const createMockSpeechResult = (transcript, isFinal = true) => ({
  results: [
    [
      {
        transcript,
        confidence: 0.9,
        isFinal,
      },
    ],
  ],
  resultIndex: 0,
});

/**
 * Creates a mock media stream for audio recording tests
 */
const createMockMediaStream = () => {
  const tracks = [{
    stop: jest.fn(),
    kind: 'audio',
    label: 'Mock microphone',
    enabled: true,
    muted: false,
    readyState: 'live',
  }];
  
  return {
    getTracks: () => tracks,
    getAudioTracks: () => tracks,
    getVideoTracks: () => [],
    addTrack: jest.fn(),
    removeTrack: jest.fn(),
    clone: jest.fn(),
    active: true,
    id: 'mock-stream-id',
  };
};

/**
 * Creates a mock audio context for waveform analysis tests
 */
const createMockAudioContext = () => ({
  state: 'running',
  sampleRate: 44100,
  currentTime: 0,
  createAnalyser: () => ({
    fftSize: 2048,
    frequencyBinCount: 1024,
    smoothingTimeConstant: 0.8,
    minDecibels: -100,
    maxDecibels: -30,
    getByteFrequencyData: jest.fn((array) => {
      // Fill with mock frequency data
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.random() * 255;
      }
    }),
    getByteTimeDomainData: jest.fn((array) => {
      // Fill with mock time domain data
      for (let i = 0; i < array.length; i++) {
        array[i] = 128 + Math.sin(i * 0.1) * 50;
      }
    }),
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
  createMediaStreamSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
  close: jest.fn(() => Promise.resolve()),
});

/**
 * Creates a mock SpeechSynthesis utterance event
 */
const createMockSpeechEvent = (type, charIndex = 0, elapsedTime = 0) => ({
  type,
  charIndex,
  elapsedTime,
  name: undefined,
});

/**
 * Mock implementation of localStorage for testing
 */
const createMockStorage = () => {
  const storage = {};
  return {
    getItem: jest.fn((key) => storage[key] || null),
    setItem: jest.fn((key, value) => {
      storage[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete storage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }),
    get length() {
      return Object.keys(storage).length;
    },
    key: jest.fn((index) => Object.keys(storage)[index] || null),
  };
};

/**
 * Waits for an async operation with timeout
 */
const waitForAsync = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
          return;
        }
      } catch (error) {
        // Continue checking
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error('Timeout waiting for async operation'));
        return;
      }
      
      setTimeout(check, 50);
    };
    
    check();
  });
};

/**
 * Creates a mock file for audio/blob testing
 */
const createMockFile = (content = 'mock content', name = 'test.wav', type = 'audio/wav') => {
  const blob = new Blob([content], { type });
  blob.name = name;
  blob.lastModified = Date.now();
  return blob;
};

/**
 * Triggers browser permission prompts for testing
 */
const mockPermissionGrant = (permission = 'microphone') => {
  const mockPermissionStatus = {
    state: 'granted',
    onchange: null,
  };
  
  if (navigator.permissions) {
    navigator.permissions.query = jest.fn(() => Promise.resolve(mockPermissionStatus));
  }
  
  return mockPermissionStatus;
};

/**
 * Mocks clipboard operations
 */
const mockClipboard = {
  writeText: jest.fn(() => Promise.resolve()),
  readText: jest.fn(() => Promise.resolve('mocked clipboard text')),
  write: jest.fn(() => Promise.resolve()),
  read: jest.fn(() => Promise.resolve()),
};

/**
 * Mocks Web Share API
 */
const mockWebShare = {
  share: jest.fn(() => Promise.resolve()),
  canShare: jest.fn(() => true),
};

/**
 * Helper to test theme changes
 */
const expectThemeClass = (element, theme) => {
  if (theme === 'dark') {
    expect(element).toHaveClass('dark');
  } else if (theme === 'light') {
    expect(element).not.toHaveClass('dark');
  }
};

/**
 * Helper to simulate user interactions with audio components
 */
const simulateAudioPermission = (granted = true) => {
  const mockStream = granted ? createMockMediaStream() : null;
  
  navigator.mediaDevices.getUserMedia = jest.fn(() => {
    if (granted) {
      return Promise.resolve(mockStream);
    } else {
      return Promise.reject(new Error('Permission denied'));
    }
  });
  
  return mockStream;
};

// Export all utilities
module.exports = {
  createMockSpeechResult,
  createMockMediaStream,
  createMockAudioContext,
  createMockSpeechEvent,
  createMockStorage,
  waitForAsync,
  createMockFile,
  mockPermissionGrant,
  mockClipboard,
  mockWebShare,
  expectThemeClass,
  simulateAudioPermission,
};