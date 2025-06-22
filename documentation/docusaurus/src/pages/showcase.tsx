import React from 'react';
import Layout from '@theme/Layout';
import { 
  SpeechToText, 
  TextToSpeech, 
  AudioRecorder,
  CopyToClipboard,
  ThemeToggle,
  ShareButton
} from '@mycomponents/react-tailwind';

function ComponentCard({ 
  title, 
  description, 
  category,
  children 
}: { 
  title: string; 
  description: string;
  category: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 rounded-full">
            {category}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Showcase(): JSX.Element {
  return (
    <Layout
      title="Component Showcase"
      description="Interactive showcase of all @mycomponents">
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Component Showcase</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore all our components in action. Each component is fully interactive
              - try them out!
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ComponentCard
              title="Speech to Text"
              description="Convert speech to text in real-time with support for multiple languages."
              category="Speech & Audio"
            >
              <SpeechToText showTranscript={true} />
            </ComponentCard>

            <ComponentCard
              title="Text to Speech"
              description="Natural text-to-speech synthesis with voice selection and playback controls."
              category="Speech & Audio"
            >
              <TextToSpeech 
                text="Hello! This is a text-to-speech demonstration. Click the speak button to hear this message."
                showControls={true}
                showVoiceSelector={true}
              />
            </ComponentCard>

            <ComponentCard
              title="Audio Recorder"
              description="Record audio with real-time waveform visualization and playback."
              category="Speech & Audio"
            >
              <AudioRecorder 
                showWaveform={true}
                showTimer={true}
                showDownload={true}
              />
            </ComponentCard>

            <ComponentCard
              title="Copy to Clipboard"
              description="Copy text to clipboard with visual feedback and browser fallbacks."
              category="Utilities"
            >
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm">
                  npm install @mycomponents/react-tailwind
                </div>
                <CopyToClipboard 
                  text="npm install @mycomponents/react-tailwind"
                  showTooltip={true}
                />
              </div>
            </ComponentCard>

            <ComponentCard
              title="Theme Toggle"
              description="Switch between light, dark, and system theme preferences."
              category="Utilities"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Button variant:</span>
                  <ThemeToggle variant="button" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Switch variant:</span>
                  <ThemeToggle variant="switch" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dropdown variant:</span>
                  <ThemeToggle variant="dropdown" />
                </div>
              </div>
            </ComponentCard>

            <ComponentCard
              title="Share Button"
              description="Share content using native Web Share API with social media fallbacks."
              category="Utilities"
            >
              <div className="space-y-4">
                <ShareButton
                  title="Check out @mycomponents!"
                  text="Amazing component library for web and mobile"
                  url="https://mycomponents.dev"
                  variant="button"
                  showLabel={true}
                />
                <ShareButton
                  title="Check out @mycomponents!"
                  text="Amazing component library for web and mobile"
                  url="https://mycomponents.dev"
                  variant="menu"
                />
              </div>
            </ComponentCard>
          </div>

          <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Install @mycomponents and start building amazing UIs today.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/docs/getting-started/installation"
                className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors no-underline"
              >
                Get Started
              </a>
              <a
                href="https://github.com/mycomponents/component-library"
                className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors no-underline"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}