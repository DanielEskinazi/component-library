// Individual component exports (backward compatibility)
export * from './audio/AudioRecorder';
export * from './audio/SpeechToText';
export * from './audio/TextToSpeech';
export * from './ui/CopyToClipboard';
export * from './ui/ThemeToggle';
export * from './ui/ShareButton';

// Domain-grouped exports
export * as Audio from './audio';
export * as UI from './ui';