# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a multi-platform component library built with a domain-based monorepo architecture using pnpm workspaces and Turborepo. The library provides web speech APIs, audio recording, theming, clipboard, and sharing functionality across multiple platforms (React, Vue, Svelte, React Native) with various styling options.

## Package Manager and Tools

- **Package Manager**: pnpm (required) - manages workspace dependencies with `workspace:*` protocol
- **Monorepo Tool**: Turborepo for build orchestration and caching
- **Build Tool**: tsup for TypeScript bundling with dual ESM/CJS outputs
- **Documentation**: Storybook 7 for interactive component documentation

## Essential Commands

### Development
```bash
pnpm install           # Install all dependencies
pnpm run dev          # Start development mode for all packages
pnpm run storybook    # Start Storybook at http://localhost:6006
```

### Building and Testing
```bash
pnpm run build        # Build all packages with dependency ordering
pnpm run test         # Run tests across all packages
pnpm run lint         # Lint all packages
pnpm run type-check   # TypeScript type checking
pnpm run format       # Format code with Prettier
```

### Shared Configurations
- **Build**: `configs/tsup.config.base.js` - Shared tsup configuration
- **TypeScript**: `tsconfig.base.json` - Base TypeScript configuration  
- **ESLint**: `.eslintrc.base.js` - Shared linting rules

### Package-Specific Development
```bash
# Build specific package
cd packages/core/audio && pnpm run build

# Work on specific React components
cd packages/web/react/tailwind && pnpm run dev

# Test individual package
cd packages/core/ui && pnpm run test
```

## Architecture Overview

### Domain-Based Package Structure

The repository uses domain-based organization instead of flat component packages to handle hundreds of components efficiently:

**Core Packages** (Platform-agnostic logic):
- `@mycomponents/audio-core` - Speech recognition, TTS, audio recording (Web Speech API)
- `@mycomponents/ui-core` - Theming, clipboard, sharing utilities
- `@mycomponents/utils` - Browser detection, DOM utilities, event handling

**Platform Packages** (UI implementations):
- `@mycomponents/react-tailwind` - React components with Tailwind CSS
- Platform packages organized by `web/`, `mobile/` with sub-platforms

### Import Patterns

The library supports multiple import patterns for flexibility:

```typescript
// Individual imports (backward compatible)
import { AudioRecorder, ThemeToggle } from '@mycomponents/react-tailwind';

// Domain-grouped imports
import { Audio, UI } from '@mycomponents/react-tailwind';

// Core functionality only
import { AudioRecorder as CoreRecorder } from '@mycomponents/audio-core';
```

### Workspace Dependencies

Packages use `workspace:*` protocol for internal dependencies:
```json
{
  "dependencies": {
    "@mycomponents/audio-core": "workspace:*",
    "@mycomponents/ui-core": "workspace:*"
  }
}
```

### Build Configuration

All packages use consistent tsup configuration:
- Dual format output (ESM + CJS)
- TypeScript declaration files
- Source maps enabled
- Tree-shaking optimization

## Component Development Patterns

### Core Package Structure
Each domain core package follows this pattern:
```
src/
├── feature-name/
│   ├── providers/     # Platform-specific implementations
│   ├── types.ts       # TypeScript interfaces
│   ├── utils.ts       # Helper functions
│   └── index.ts       # Main export
└── index.ts           # Domain exports
```

### Platform Component Structure
React components are organized by domain within platform packages:
```
src/
├── audio/             # Audio domain components
│   ├── AudioRecorder.tsx
│   ├── SpeechToText.tsx
│   ├── TextToSpeech.tsx
│   └── index.ts       # Domain exports
├── ui/                # UI domain components
│   └── index.ts
└── index.ts           # Combined exports
```

### Provider Pattern
Core packages use provider pattern for platform abstraction:
- Web Speech API provider for browsers
- Mock provider for testing/SSR
- Future: Native providers for React Native

## Storybook Integration

- Main Storybook package: `documentation/storybook`
- Stories organized by component, not domain (for user discovery)
- Interactive demos with real browser APIs (microphone, speakers, clipboard)
- MDX documentation with installation and usage examples

## Scalability Approach

The domain-based architecture solves the "component explosion" problem:
- **Traditional flat structure**: 100 components = 100+ packages
- **Domain structure**: 100 components = ~10-15 domain packages
- Maintains logical organization while keeping package count manageable
- Ready for enterprise-scale component libraries

## Web APIs Integration

Components integrate with browser APIs requiring permissions:
- **Speech Recognition**: Requires microphone access
- **Audio Recording**: Uses MediaRecorder API with waveform visualization
- **Text-to-Speech**: Web Speech Synthesis API
- **Clipboard**: Navigator clipboard API with fallbacks
- **Sharing**: Web Share API with social media fallbacks

## MCP Integration

This project leverages Model Context Protocol (MCP) for AI assistance:

**Available MCP Servers:**
- **Playwright MCP**: Browser automation and testing capabilities for end-to-end testing of web components
- **GitHub MCP**: Repository operations, PRs, issues, code search

**Usage Pattern:**
- Configure MCP servers in project-specific `.mcp.json` files
- Use MCP tools with appropriate prefixes (`mcp__playwright__`, `mcp__github__`, etc.)
- Prefer MCP tools over CLI commands for better integration, especially for browser testing of interactive components

## Workspace Management

When adding new components:
1. Determine the appropriate domain (audio, ui, data, etc.)
2. Add to existing core domain package or create new domain
3. Implement platform-specific components in web/mobile packages
4. Update Storybook with interactive demos
5. Test both individual and domain import patterns

The architecture prioritizes maintainability and discoverability over package count optimization.