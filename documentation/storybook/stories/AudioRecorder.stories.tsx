import type { Meta, StoryObj } from '@storybook/react';
import { AudioRecorder } from '@mycomponents/react-tailwind';
import { useState } from 'react';
import { AudioData } from '@mycomponents/audio-recorder-core';

const meta = {
  title: 'Speech & Audio/Audio Recorder',
  component: AudioRecorder,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Audio recording component with real-time waveform visualization, level monitoring, and playback controls.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onRecordingComplete: { action: 'recordingComplete' },
    onError: { action: 'error' },
    onLevelUpdate: { action: 'levelUpdate' },
    showWaveform: {
      control: 'boolean',
      description: 'Show waveform visualization',
    },
    showTimer: {
      control: 'boolean',
      description: 'Show recording timer',
    },
    showDownload: {
      control: 'boolean',
      description: 'Show download button',
    },
    maxDuration: {
      control: 'number',
      description: 'Maximum recording duration in seconds',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AudioRecorder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showWaveform: true,
    showTimer: true,
    showDownload: true,
  },
};

export const SimpleRecorder: Story = {
  args: {
    showWaveform: false,
    showTimer: true,
    showDownload: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal UI without waveform visualization.',
      },
    },
  },
};

export const WithMaxDuration: Story = {
  args: {
    maxDuration: 30,
    showWaveform: true,
    showTimer: true,
    showDownload: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Recording limited to 30 seconds maximum.',
      },
    },
  },
};

export const WaveformOnly: Story = {
  args: {
    showWaveform: true,
    showTimer: false,
    showDownload: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on waveform visualization without other controls.',
      },
    },
  },
};

export const RecordingWorkflow: Story = {
  render: () => {
    const [recordings, setRecordings] = useState<AudioData[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    const handleRecordingComplete = (audioData: AudioData) => {
      setRecordings([...recordings, audioData]);
      setIsRecording(false);
    };

    return (
      <div className="space-y-6 w-full max-w-2xl">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Audio Recorder</h3>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            showWaveform={true}
            showTimer={true}
            showDownload={false}
          />
        </div>

        {recordings.length > 0 && (
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Recordings ({recordings.length})
            </h3>
            <div className="space-y-3">
              {recordings.map((recording, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Recording {index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <audio
                    controls
                    src={recording.url}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete recording workflow with multiple recordings management.',
      },
    },
  },
};

export const LiveMonitoring: Story = {
  render: () => {
    const [level, setLevel] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    return (
      <div className="space-y-4">
        <AudioRecorder
          onLevelUpdate={setLevel}
          onRecordingComplete={() => setIsRecording(false)}
          showWaveform={true}
          showTimer={true}
        />
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Audio Level Monitor</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-16">Level:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${level * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-12 text-right">
                {Math.round(level * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Loud</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-time audio level monitoring during recording.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-2xl shadow-xl',
    showWaveform: true,
    showTimer: true,
    showDownload: true,
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-100">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Custom styled audio recorder with gradient background.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    showWaveform: true,
    showTimer: true,
    showDownload: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile-optimized audio recorder interface.',
      },
    },
  },
};