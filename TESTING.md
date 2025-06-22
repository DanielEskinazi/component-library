# Testing Guide

## Overview

This component library has a comprehensive testing infrastructure designed for enterprise-scale development. The testing system supports the domain-based monorepo architecture and provides extensive browser API mocking for components that use speech, audio, clipboard, and sharing APIs.

## Quick Start

### Running Tests

```bash
# Run all tests across all packages
pnpm run test

# Run tests for a specific package
cd packages/core/audio
pnpm run test

# Run tests in watch mode (for development)
pnpm run test -- --watch

# Run tests with coverage
pnpm run test -- --coverage
```

### Test Status

✅ **Packages with Working Tests:**
- `@mycomponents/utils` - 3/3 tests passing
- `@mycomponents/audio-core` - 3/3 tests passing  
- `@mycomponents/ui-core` - 30/30 tests passing
- `@mycomponents/react-tailwind` - 3/3 tests passing

🎯 **Total: 39/39 tests passing**

## Testing Architecture

### Core Infrastructure

**Jest Configuration:**
- TypeScript support with ts-jest
- JSDOM environment for browser simulation
- Shared configuration across all packages
- Coverage reporting and thresholds

**React Testing Library:**
- Component testing with user interactions
- Accessibility-focused testing utilities
- Custom render functions with theme providers

**Web API Mocking:**
- Speech Recognition API (microphone, transcription)
- MediaRecorder API (audio recording, waveform)
- Clipboard API (copy/paste functionality)
- Web Share API (native sharing)
- AudioContext (audio level monitoring)
- Local/Session Storage (theme persistence)

### Package Structure

```
configs/
├── jest.config.base.js     # Shared Jest configuration
├── jest.setup.js           # Global mocks and utilities
└── test-utils.js           # Common testing helpers

packages/
├── core/
│   ├── audio/
│   │   ├── jest.config.js
│   │   └── src/__tests__/
│   ├── ui/
│   │   ├── jest.config.js
│   │   └── src/__tests__/
│   └── utils/
│       ├── jest.config.js
│       └── src/__tests__/
└── web/react/tailwind/
    ├── jest.config.js
    ├── src/__tests__/
    └── src/test-utils/      # React-specific utilities
```

## Writing Tests

### Basic Component Test

```tsx
// src/__tests__/MyComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    
    const element = screen.getByRole('button');
    expect(element).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const mockCallback = jest.fn();
    render(<MyComponent onClick={mockCallback} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockCallback).toHaveBeenCalled();
  });
});
```

### Testing Audio Components

```tsx
// Testing speech recognition
import { createMockSpeechResult } from '@test-utils';

it('should handle speech recognition', async () => {
  render(<SpeechToText onTranscript={mockOnTranscript} />);
  
  // Simulate speech result
  const mockResult = createMockSpeechResult('hello world', true);
  // Test implementation would trigger this result
  
  expect(mockOnTranscript).toHaveBeenCalledWith('hello world');
});
```

### Testing Clipboard Operations

```tsx
// Testing clipboard functionality
import { mockClipboard } from '@test-utils';

it('should copy text to clipboard', async () => {
  render(<CopyButton text="test content" />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test content');
});
```

### Testing Theme Management

```tsx
// Testing theme changes
import { createMockStorage } from '@test-utils';

it('should toggle themes', () => {
  const mockStorage = createMockStorage();
  Object.defineProperty(global, 'localStorage', { value: mockStorage });
  
  render(<ThemeToggle />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(mockStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
});
```

## Testing Utilities

### Available Test Utils

```javascript
// From @test-utils
import {
  createMockSpeechResult,      // Mock speech recognition results
  createMockMediaStream,       // Mock audio streams
  createMockAudioContext,      // Mock Web Audio API
  createMockStorage,           // Mock localStorage/sessionStorage
  mockClipboard,               // Mock clipboard operations
  mockWebShare,                // Mock Web Share API
  simulateAudioPermission,     // Mock microphone permissions
  expectThemeClass,            // Theme testing helper
  waitForAsync,                // Async operation helper
} from '@test-utils';
```

### React Testing Utilities

```tsx
// From src/test-utils (React packages)
import { render, screen, fireEvent, waitFor } from '../test-utils';

// Custom render with providers
render(<Component />, {
  wrapper: ({ children }) => (
    <ThemeProvider theme="light">
      {children}
    </ThemeProvider>
  )
});
```

## Configuration Files

### Package-Level Jest Config

```javascript
// packages/*/jest.config.js
const baseConfig = require('../../../configs/jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: '@mycomponents/package-name',
  rootDir: '.',
  
  // Package-specific overrides
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@mycomponents/audio-core$': '<rootDir>/../../../core/audio/src',
  },
};
```

### Global Setup

```javascript
// configs/jest.setup.js
// Comprehensive Web API mocking
global.SpeechRecognition = class MockSpeechRecognition { /* ... */ };
global.speechSynthesis = { /* ... */ };
global.MediaRecorder = class MockMediaRecorder { /* ... */ };
global.navigator.clipboard = mockClipboard;
// ... and more
```

## Best Practices

### 1. Test Structure

```tsx
describe('ComponentName', () => {
  // Group related tests
  describe('rendering', () => {
    it('should render with default props', () => {});
    it('should render with custom props', () => {});
  });

  describe('user interactions', () => {
    it('should handle click events', () => {});
    it('should handle keyboard events', () => {});
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', () => {});
  });
});
```

### 2. Async Testing

```tsx
// For API-dependent components
it('should handle async operations', async () => {
  render(<AsyncComponent />);
  
  // Wait for async operation
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
  
  // Or use findBy queries (built-in async)
  const element = await screen.findByText('Loaded');
  expect(element).toBeInTheDocument();
});
```

### 3. Custom Hooks Testing

```tsx
import { renderHook, act } from '@testing-library/react';

it('should manage theme state', () => {
  const { result } = renderHook(() => useTheme());
  
  act(() => {
    result.current.setTheme('dark');
  });
  
  expect(result.current.theme).toBe('dark');
});
```

### 4. Error Boundaries

```tsx
it('should handle component errors', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

## Browser API Testing

### Speech Recognition

```tsx
// Mock speech recognition events
const mockRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  onresult: null,
  onerror: null,
};

// Simulate speech result
if (mockRecognition.onresult) {
  mockRecognition.onresult({
    results: [[{ transcript: 'hello', confidence: 0.9 }]],
  });
}
```

### MediaRecorder

```tsx
// Mock audio recording
const mockRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: null,
};

// Simulate recorded data
if (mockRecorder.ondataavailable) {
  mockRecorder.ondataavailable({
    data: new Blob(['audio data'], { type: 'audio/webm' }),
  });
}
```

### Permissions

```tsx
// Mock permission requests
navigator.permissions = {
  query: jest.fn(() => Promise.resolve({ state: 'granted' })),
};

// Mock getUserMedia
navigator.mediaDevices.getUserMedia = jest.fn(() =>
  Promise.resolve(mockMediaStream)
);
```

## Debugging Tests

### Common Issues

1. **Module Resolution Errors**
   ```bash
   # Check module mapping in jest.config.js
   moduleNameMapper: {
     '^@mycomponents/(.*)$': '<rootDir>/../../../$1/src',
   }
   ```

2. **Mock Setup Issues**
   ```javascript
   // Ensure mocks are reset between tests
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

3. **Async Timing Issues**
   ```tsx
   // Use proper async utilities
   await waitFor(() => {
     expect(screen.getByText('Expected')).toBeInTheDocument();
   });
   ```

### Debug Commands

```bash
# Run specific test file
pnpm run test -- Component.test.tsx

# Run tests matching pattern
pnpm run test -- --testNamePattern="should handle"

# Debug with verbose output
pnpm run test -- --verbose

# Watch mode for development
pnpm run test -- --watch --testPathPattern="Component"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm run test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Coverage Thresholds

```javascript
// jest.config.base.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

## Advanced Testing

### Visual Regression (Future)

```bash
# With Playwright (configured in .mcp.json)
npx playwright test --project=visual

# Storybook visual testing
pnpm run test-storybook
```

### Performance Testing

```tsx
import { Profiler } from 'react';

it('should render efficiently', () => {
  const onRender = jest.fn();
  
  render(
    <Profiler id="test" onRender={onRender}>
      <ExpensiveComponent />
    </Profiler>
  );
  
  expect(onRender).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(String),
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
    expect.any(Set)
  );
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Contributing

When adding new tests:

1. **Follow naming conventions**: `ComponentName.test.tsx`
2. **Use descriptive test names**: `should handle user interaction when disabled`
3. **Group related tests**: Use `describe` blocks
4. **Test edge cases**: Error states, empty data, loading states
5. **Mock external dependencies**: APIs, timers, file system
6. **Verify cleanup**: No memory leaks, event listeners removed

## Support

For testing-related questions:
- Check this guide first
- Look at existing test examples in the codebase
- Review Jest and React Testing Library documentation
- Create an issue for testing infrastructure problems

The testing infrastructure is designed to scale with the component library and support enterprise development practices. All components should have comprehensive test coverage including happy paths, error cases, and accessibility requirements.