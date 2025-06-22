# Component Library Documentation

## Overview

This component library provides a comprehensive set of multi-platform components with extensive documentation through Storybook and Docusaurus.

## Documentation Sites

### 1. Storybook - Interactive Component Playground

Located in `documentation/storybook/`

**Features:**
- Interactive component demos with live controls
- Multiple story variations for each component
- Accessibility testing
- Mobile viewport testing
- Dark/light theme support

**Components Documented:**
- **Speech to Text**: 8 stories including multi-language support, continuous recording, error handling
- **Text to Speech**: 8 stories with voice selection, auto-speak, interactive controls
- **Audio Recorder**: 8 stories featuring waveform visualization, live monitoring
- **Copy to Clipboard**: 8 stories with various UI patterns and feedback
- **Theme Toggle**: 9 stories showing button, switch, and dropdown variants
- **Share Button**: 9 stories with native share API and social media fallbacks

### 2. Docusaurus - Comprehensive Documentation

Located in `documentation/docusaurus/`

**Structure:**
```
docs/
├── getting-started/
│   ├── installation.mdx      # Installation guide
│   ├── quick-start.mdx       # Quick start tutorials
│   └── typescript.mdx        # TypeScript guide
├── components/
│   ├── speech-to-text/       # Component docs
│   ├── text-to-speech/
│   ├── audio-recorder/
│   └── ...
├── guides/
│   ├── theming.mdx          # Theming guide
│   ├── accessibility.mdx    # A11y best practices
│   └── ssr.mdx              # SSR support
└── api-reference/
```

**Features:**
- Live code playgrounds
- API documentation
- Platform compatibility matrix
- Interactive component showcase
- Search functionality (Algolia-ready)

### 3. Simple Demo

A standalone HTML demo is available at `simple-demo/index.html` that demonstrates all components without requiring build tools.

## Running the Documentation

### Prerequisites
- Node.js 18+
- npm 9+

### Storybook
```bash
cd documentation/storybook
npm install
npm run dev
```

Access at: http://localhost:6006

### Docusaurus
```bash
cd documentation/docusaurus
npm install
npm run dev
```

Access at: http://localhost:3000

### Simple Demo
Open `simple-demo/index.html` in your browser or serve it:
```bash
cd simple-demo
python3 -m http.server 8080
```

## Component Examples

### Speech to Text
```tsx
import { SpeechToText } from '@mycomponents/react-tailwind';

<SpeechToText 
  onTranscript={(text) => console.log(text)}
  continuous={true}
  lang="en-US"
/>
```

### Text to Speech
```tsx
import { TextToSpeech } from '@mycomponents/react-tailwind';

<TextToSpeech 
  text="Hello, world!"
  autoSpeak={true}
  showControls={true}
/>
```

### Audio Recorder
```tsx
import { AudioRecorder } from '@mycomponents/react-tailwind';

<AudioRecorder 
  onRecordingComplete={(audioData) => console.log(audioData)}
  showWaveform={true}
  showTimer={true}
/>
```

## Development Workflow

1. **Component Development**: Create/modify components in `packages/`
2. **Story Creation**: Add Storybook stories for new components
3. **Documentation**: Update Docusaurus docs with examples and API details
4. **Testing**: Use Storybook for visual testing and interaction testing
5. **Publishing**: Use changeset for version management

## Key Features

- **TypeScript First**: Full type definitions
- **Multi-Platform**: Web (React, Vue, Svelte) and Mobile (React Native)
- **Multiple Styling**: Tailwind CSS, Material-UI, Styled Components, or unstyled
- **Tree-Shakeable**: Import only what you need
- **SSR Compatible**: Works with Next.js, Nuxt, etc.
- **Accessible**: WCAG 2.1 compliant components

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.