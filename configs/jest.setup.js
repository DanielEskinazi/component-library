/**
 * Global Jest setup file for all packages
 * Configures testing environment and global mocks
 */

// Mock Web APIs that are not available in jsdom
global.SpeechRecognition = global.SpeechRecognition || class MockSpeechRecognition {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.lang = 'en-US';
    this.onstart = null;
    this.onend = null;
    this.onresult = null;
    this.onerror = null;
    this.onspeechstart = null;
    this.onspeechend = null;
    this.onaudiostart = null;
    this.onaudioend = null;
    this.onsoundstart = null;
    this.onsoundend = null;
    this.onnomatch = null;
  }
  
  start() {
    setTimeout(() => {
      if (this.onstart) this.onstart();
    }, 10);
  }
  
  stop() {
    setTimeout(() => {
      if (this.onend) this.onend();
    }, 10);
  }
  
  abort() {
    this.stop();
  }
};

global.speechSynthesis = global.speechSynthesis || {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => [
    {
      voiceURI: 'test-voice',
      name: 'Test Voice',
      lang: 'en-US',
      localService: true,
      default: true,
    },
  ]),
  speaking: false,
  pending: false,
  paused: false,
  onvoiceschanged: null,
};

global.SpeechSynthesisUtterance = global.SpeechSynthesisUtterance || class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text || '';
    this.lang = 'en-US';
    this.voice = null;
    this.volume = 1;
    this.rate = 1;
    this.pitch = 1;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onmark = null;
    this.onboundary = null;
  }
};

// Mock MediaRecorder API
global.MediaRecorder = global.MediaRecorder || class MockMediaRecorder {
  constructor(stream, options = {}) {
    this.stream = stream;
    this.options = options;
    this.state = 'inactive';
    this.mimeType = options.mimeType || 'audio/webm';
    this.ondataavailable = null;
    this.onstart = null;
    this.onstop = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
  }
  
  start(timeslice) {
    this.state = 'recording';
    setTimeout(() => {
      if (this.onstart) this.onstart();
    }, 10);
  }
  
  stop() {
    this.state = 'inactive';
    setTimeout(() => {
      if (this.ondataavailable) {
        this.ondataavailable({
          data: new Blob(['mock audio data'], { type: this.mimeType }),
        });
      }
      if (this.onstop) this.onstop();
    }, 10);
  }
  
  pause() {
    this.state = 'paused';
    setTimeout(() => {
      if (this.onpause) this.onpause();
    }, 10);
  }
  
  resume() {
    this.state = 'recording';
    setTimeout(() => {
      if (this.onresume) this.onresume();
    }, 10);
  }
  
  static isTypeSupported(mimeType) {
    return ['audio/webm', 'audio/mp4', 'audio/wav'].includes(mimeType);
  }
};

// Mock getUserMedia
global.navigator.mediaDevices = global.navigator.mediaDevices || {};
global.navigator.mediaDevices.getUserMedia = global.navigator.mediaDevices.getUserMedia || jest.fn(() =>
  Promise.resolve({
    getTracks: () => [{
      stop: jest.fn(),
      kind: 'audio',
      label: 'Mock microphone',
    }],
    getAudioTracks: () => [{
      stop: jest.fn(),
      kind: 'audio',
      label: 'Mock microphone',
    }],
  })
);

// Mock Clipboard API
global.navigator.clipboard = global.navigator.clipboard || {
  writeText: jest.fn(() => Promise.resolve()),
  readText: jest.fn(() => Promise.resolve('mock clipboard text')),
  write: jest.fn(() => Promise.resolve()),
  read: jest.fn(() => Promise.resolve()),
};

// Mock Web Share API
global.navigator.share = global.navigator.share || jest.fn(() => Promise.resolve());
global.navigator.canShare = global.navigator.canShare || jest.fn(() => true);

// Mock Audio Context
global.AudioContext = global.AudioContext || class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.sampleRate = 44100;
    this.currentTime = 0;
  }
  
  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteFrequencyData: jest.fn(),
      getByteTimeDomainData: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  
  createMediaStreamSource() {
    return {
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
  
  close() {
    this.state = 'closed';
    return Promise.resolve();
  }
};

global.webkitAudioContext = global.webkitAudioContext || global.AudioContext;

// Mock matchMedia
global.matchMedia = global.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Note: window.location mocking removed due to JSDOM conflicts
// Individual tests can mock window.location as needed

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Global test utilities
global.waitFor = (callback, options = {}) => {
  const { timeout = 1000, interval = 50 } = options;
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
        reject(new Error('Timeout waiting for condition'));
        return;
      }
      
      setTimeout(check, interval);
    };
    
    check();
  });
};

// Import jest-dom matchers
require('@testing-library/jest-dom');

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});