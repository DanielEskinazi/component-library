import type { Meta, StoryObj } from '@storybook/react';
import { TextToSpeech } from '@mycomponents/react-tailwind';
import { useState } from 'react';

const meta = {
  title: 'Speech & Audio/Text to Speech',
  component: TextToSpeech,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Text-to-speech synthesis component with voice selection, speed control, and playback management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to be spoken',
    },
    autoSpeak: {
      control: 'boolean',
      description: 'Automatically speak when text changes',
    },
    onStart: { action: 'started' },
    onEnd: { action: 'ended' },
    onError: { action: 'error' },
    showControls: {
      control: 'boolean',
      description: 'Show playback controls',
    },
    showVoiceSelector: {
      control: 'boolean',
      description: 'Show voice selection dropdown',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof TextToSpeech>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Welcome to the text-to-speech component. Click the speak button to hear this message.',
    showControls: true,
    showVoiceSelector: true,
  },
};

export const AutoSpeak: Story = {
  args: {
    text: 'This message will be spoken automatically when the component loads.',
    autoSpeak: true,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Automatically speaks the text when component mounts or text changes.',
      },
    },
  },
};

export const SimplePlayback: Story = {
  args: {
    text: 'Simple playback without advanced controls.',
    showControls: false,
    showVoiceSelector: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal UI with just play/stop functionality.',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    text: `This is a longer passage of text to demonstrate how the text-to-speech component handles extended content. 
    The speech synthesis will continue reading through multiple sentences, maintaining a natural pace and rhythm. 
    You can pause and resume the playback at any time, and adjust the speed and pitch to your preference. 
    This feature is particularly useful for accessibility purposes, allowing users to consume written content through audio.`,
    showControls: true,
    showVoiceSelector: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with longer text content.',
      },
    },
  },
};

export const MultiLanguage: Story = {
  render: () => {
    const [language, setLanguage] = useState('en-US');
    
    const texts: Record<string, string> = {
      'en-US': 'Hello, this is a text-to-speech demonstration in English.',
      'es-ES': 'Hola, esta es una demostración de texto a voz en español.',
      'fr-FR': 'Bonjour, ceci est une démonstration de synthèse vocale en français.',
      'de-DE': 'Hallo, dies ist eine Text-zu-Sprache-Demonstration auf Deutsch.',
      'ja-JP': 'こんにちは、これは日本語のテキスト読み上げのデモンストレーションです。',
    };

    return (
      <div className="space-y-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="en-US">English</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="ja-JP">Japanese</option>
        </select>
        <TextToSpeech
          key={language}
          text={texts[language]}
          showControls={true}
          showVoiceSelector={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Text-to-speech in multiple languages with language selector.',
      },
    },
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [text, setText] = useState('Type something here and click speak to hear it!');
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <div className="space-y-4 w-full max-w-md">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
          rows={4}
          placeholder="Enter text to speak..."
        />
        <TextToSpeech
          text={text}
          onStart={() => setIsPlaying(true)}
          onEnd={() => setIsPlaying(false)}
          showControls={true}
          showVoiceSelector={true}
        />
        {isPlaying && (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="animate-pulse w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-sm">Speaking...</span>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with editable text input.',
      },
    },
  },
};

export const AccessibilityFocus: Story = {
  args: {
    text: 'This component is designed with accessibility in mind, providing screen reader support and keyboard navigation.',
    showControls: true,
    showVoiceSelector: true,
    className: 'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of accessibility features including focus states.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    text: 'Mobile-optimized text-to-speech interface.',
    showControls: true,
    showVoiceSelector: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile view with simplified controls.',
      },
    },
  },
};