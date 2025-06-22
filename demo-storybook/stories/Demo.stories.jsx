import React from 'react';

export default {
  title: 'Demo/Components',
  parameters: {
    layout: 'centered',
  },
};

// Simple demo components
const Button = ({ children, variant = 'primary', onClick }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const BasicButton = () => (
  <div className="space-x-4">
    <Button>Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="danger">Danger</Button>
  </div>
);

export const SpeechToTextDemo = () => {
  const [isListening, setIsListening] = React.useState(false);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-md">
      <h3 className="text-lg font-semibold mb-4">Speech to Text</h3>
      <Button 
        variant={isListening ? 'danger' : 'primary'}
        onClick={() => setIsListening(!isListening)}
      >
        {isListening ? '🔴 Stop Recording' : '🎤 Start Recording'}
      </Button>
      <p className="mt-4 text-sm text-gray-600">
        {isListening ? 'Listening...' : 'Click to start speech recognition'}
      </p>
    </div>
  );
};

export const TextToSpeechDemo = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-md">
      <h3 className="text-lg font-semibold mb-4">Text to Speech</h3>
      <p className="mb-4">Welcome to the component library demo!</p>
      <Button 
        variant="primary"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </Button>
    </div>
  );
};

export const CopyToClipboardDemo = () => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-md">
      <h3 className="text-lg font-semibold mb-4">Copy to Clipboard</h3>
      <div className="p-3 bg-gray-100 rounded mb-4 font-mono text-sm">
        npm install @mycomponents/react
      </div>
      <Button 
        variant={copied ? 'primary' : 'secondary'}
        onClick={handleCopy}
      >
        {copied ? '✓ Copied!' : '📋 Copy'}
      </Button>
    </div>
  );
};