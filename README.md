# @mycomponents - Multi-Platform Component Library

A comprehensive component library that works across web and mobile platforms, with support for multiple styling libraries and excellent documentation.

## 🚀 Features

- **Multi-Platform Support**: Web (React, Vue, Svelte, Vanilla JS) and Mobile (React Native)
- **Multiple Styling Options**: Tailwind CSS, Material-UI, Styled Components, Native Base, or unstyled
- **TypeScript First**: Full type definitions for excellent DX
- **Tree-Shakeable**: Only import what you need
- **SSR Compatible**: Works with Next.js, Nuxt, and other SSR frameworks
- **Comprehensive Documentation**: Storybook + Docusaurus
- **Zero Configuration**: Works out of the box with sensible defaults

## 📦 Packages

### Core Packages
- `@mycomponents/speech-to-text-core` - Speech recognition functionality
- `@mycomponents/text-to-speech-core` - Text-to-speech synthesis
- `@mycomponents/audio-recorder-core` - Audio recording with waveform analysis
- `@mycomponents/utils` - Shared utilities and helpers

### Web Components
- `@mycomponents/react-tailwind` - React components styled with Tailwind CSS
- `@mycomponents/react-unstyled` - Headless React components
- `@mycomponents/react-mui` - React components with Material-UI
- `@mycomponents/vue-tailwind` - Vue 3 components with Tailwind CSS
- `@mycomponents/vanilla` - Pure JavaScript implementations

### Mobile Components
- `@mycomponents/react-native-unstyled` - Core React Native components
- `@mycomponents/react-native-base` - React Native with Native Base styling

## 🏃 Quick Start

### Installation

```bash
# Install specific components
npm install @mycomponents/speech-to-text-core @mycomponents/react-tailwind

# Or use the CLI
npx @mycomponents/cli add speech-to-text --platform=react --style=tailwind
```

### Basic Usage

```tsx
import { SpeechToText, TextToSpeech, AudioRecorder } from '@mycomponents/react-tailwind';

function App() {
  return (
    <div>
      <SpeechToText 
        onTranscript={(text) => console.log(text)}
        continuous={true}
      />
      
      <TextToSpeech 
        text="Hello, world!"
        autoSpeak={true}
      />
      
      <AudioRecorder
        onRecordingComplete={(audioData) => console.log(audioData)}
        showWaveform={true}
      />
    </div>
  );
}
```

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/component-library.git
cd component-library

# Install dependencies
npm install

# Build all packages
npm run build

# Start development
npm run dev
```

### Available Scripts

- `npm run dev` - Start development mode
- `npm run build` - Build all packages
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run storybook` - Start Storybook
- `npm run docs` - Start documentation site
- `npm run create-component` - Scaffold a new component

## 📚 Documentation

- **Storybook**: Interactive component playground - `npm run storybook`
- **Docusaurus**: Full documentation site - `npm run docs`
- **API Reference**: Auto-generated from TypeScript definitions

## 🧩 Component Features

### Speech-to-Text
- Real-time transcription
- Multiple language support
- Interim results
- Custom grammars
- Error handling with fallbacks

### Text-to-Speech  
- Voice selection
- Speed and pitch control
- Pause/resume functionality
- SSML support
- Queue management

### Audio Recorder
- Real-time waveform visualization
- Multiple format support
- Pause/resume recording
- Audio level monitoring
- Automatic silence detection

### Copy to Clipboard
- Fallback for older browsers
- Success animations
- Custom tooltips
- Rich text support

### Theme Toggle
- Light/Dark/System modes
- Persistent storage
- Custom themes
- CSS variables integration

### Share Button
- Native Web Share API
- Social media fallbacks
- Custom share targets
- Analytics integration

## 🏗️ Architecture

```
my-components/
├── packages/
│   ├── core/                    # Platform-agnostic business logic
│   ├── web/                     # Web implementations
│   ├── mobile/                  # Mobile implementations
│   └── universal/               # Cross-platform components
├── documentation/
│   ├── storybook/              # Component playground
│   └── docusaurus/             # Documentation site
├── examples/                    # Example applications
├── playground/                  # Development playground
└── tools/                      # CLI and build tools
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name]

## 🙏 Acknowledgments

Built with:
- [Turborepo](https://turbo.build/) for monorepo management
- [tsup](https://tsup.egoist.dev/) for building
- [Storybook](https://storybook.js.org/) for component development
- [Docusaurus](https://docusaurus.io/) for documentation