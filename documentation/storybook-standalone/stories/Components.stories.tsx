import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta = {
  title: 'Components/Demo',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo Speech to Text Component
const DemoSpeechToText = () => {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Speech to Text Demo</h3>
      <button
        onClick={() => setIsListening(!isListening)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isListening ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Click to simulate speech recognition
      </p>
    </div>
  );
};

// Demo Text to Speech Component
const DemoTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const text = "Hello! This is a text-to-speech demonstration.";

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Text to Speech Demo</h3>
      <p className="mb-4 text-gray-700">{text}</p>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
      >
        {isPlaying ? 'Stop' : 'Speak'}
      </button>
      <p className="mt-2 text-xs text-gray-500">
        Click to simulate text-to-speech
      </p>
    </div>
  );
};

// Demo Copy to Clipboard Component
const DemoCopyToClipboard = () => {
  const [copied, setCopied] = React.useState(false);
  const text = "npm install @mycomponents/react-tailwind";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Copy to Clipboard Demo</h3>
      <div className="p-4 bg-gray-100 rounded font-mono text-sm mb-4">
        {text}
      </div>
      <button
        onClick={handleCopy}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          copied 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export const SpeechToText: Story = {
  render: () => <DemoSpeechToText />,
};

export const TextToSpeech: Story = {
  render: () => <DemoTextToSpeech />,
};

export const CopyToClipboard: Story = {
  render: () => <DemoCopyToClipboard />,
};

export const AllComponents: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DemoSpeechToText />
      <DemoTextToSpeech />
      <DemoCopyToClipboard />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};