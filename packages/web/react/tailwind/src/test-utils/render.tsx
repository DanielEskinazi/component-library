/**
 * Custom render function for React Testing Library
 * Provides common providers and utilities for component testing
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Theme Provider for testing components that use themes
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div data-theme="light" className="theme-light">
      {children}
    </div>
  );
};

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };