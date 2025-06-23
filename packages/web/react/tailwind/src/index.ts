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
export * as Data from './data';
export * as Media from './media';
export * as Input from './input';
export * as Communication from './communication';
export * as Game from './game';
export * as AI from './ai';
export * as Animation from './animation';
export * as ThreeD from './3d';
export * as Network from './network';
export * as Device from './device';