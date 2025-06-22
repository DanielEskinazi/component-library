import type { Meta, StoryObj } from '@storybook/react';
import { SpeechToText } from '@mycomponents/react-tailwind';
import { useState } from 'react';

const meta = {
  title: 'Speech & Audio/Speech to Text',
  component: SpeechToText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Real-time speech recognition component with support for continuous transcription, multiple languages, and interim results.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onTranscript: { action: 'transcript' },
    onError: { action: 'error' },
    onStateChange: { action: 'stateChange' },
    continuous: {
      control: 'boolean',
      description: 'Enable continuous recognition',
    },
    interimResults: {
      control: 'boolean',
      description: 'Show interim results while speaking',
    },
    lang: {
      control: 'select',
      options: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'],
      description: 'Recognition language',
    },
    showTranscript: {
      control: 'boolean',
      description: 'Show transcript UI',
    },
    autoStart: {
      control: 'boolean',
      description: 'Start recording automatically',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SpeechToText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showTranscript: true,
    continuous: false,
    interimResults: true,
  },
};

export const ContinuousRecording: Story = {
  args: {
    continuous: true,
    interimResults: true,
    showTranscript: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Continuous recording mode keeps listening until manually stopped.',
      },
    },
  },
};

export const MultiLanguage: Story = {
  args: {
    lang: 'es-ES',
    showTranscript: true,
    interimResults: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Speech recognition in Spanish. Try speaking in Spanish!',
      },
    },
  },
};

export const AutoStart: Story = {
  args: {
    autoStart: true,
    continuous: true,
    showTranscript: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Automatically starts recording when component mounts.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'bg-gray-100 p-6 rounded-xl shadow-lg',
    showTranscript: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom styling with Tailwind classes.',
      },
    },
  },
};

export const WithTranscriptHandler: Story = {
  render: () => {
    const [transcript, setTranscript] = useState('');
    const [wordCount, setWordCount] = useState(0);

    const handleTranscript = (text: string) => {
      setTranscript(text);
      setWordCount(text.split(' ').filter(word => word.length > 0).length);
    };

    return (
      <div className="space-y-4">
        <SpeechToText
          onTranscript={handleTranscript}
          continuous={true}
          showTranscript={false}
        />
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Transcript Analysis</h3>
          <p className="text-sm text-gray-600 mb-1">Word count: {wordCount}</p>
          <p className="text-sm">{transcript || 'Start speaking...'}</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of handling transcript updates with custom UI.',
      },
    },
  },
};

export const ErrorHandling: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);

    return (
      <div className="space-y-4">
        <SpeechToText
          onError={(err) => setError(err.message)}
          showTranscript={true}
        />
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">Error: {error}</p>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of error handling and display.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    showTranscript: true,
    continuous: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view of the speech recognition component.',
      },
    },
  },
};