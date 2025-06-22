import React, { useEffect, useState } from 'react';
import { ThemeManager, Theme } from '@mycomponents/utils';
import { clsx } from 'clsx';

export interface ThemeToggleProps {
  defaultTheme?: Theme;
  storageKey?: string;
  onChange?: (theme: Theme) => void;
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'switch' | 'dropdown';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  defaultTheme = 'system',
  storageKey = 'theme',
  onChange,
  className,
  showLabel = false,
  variant = 'button',
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [themeManager, setThemeManager] = useState<ThemeManager | null>(null);

  useEffect(() => {
    const manager = new ThemeManager({ defaultTheme, storageKey });
    setThemeManager(manager);
    setTheme(manager.getTheme());

    const unsubscribe = manager.onChange((newTheme) => {
      setTheme(newTheme);
      onChange?.(newTheme);
    });

    return () => {
      unsubscribe();
      manager.destroy();
    };
  }, [defaultTheme, storageKey]);

  const handleToggle = () => {
    themeManager?.toggleTheme();
  };

  const handleSelectTheme = (newTheme: Theme) => {
    themeManager?.setTheme(newTheme);
  };

  const getIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  if (variant === 'switch') {
    const resolvedTheme = themeManager?.getResolvedTheme() || 'light';
    const isDark = resolvedTheme === 'dark';

    return (
      <div className={clsx('flex items-center gap-3', className)}>
        {showLabel && (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}
        <button
          onClick={() => handleSelectTheme(isDark ? 'light' : 'dark')}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
            isDark ? 'bg-primary-600' : 'bg-gray-200'
          )}
          role="switch"
          aria-checked={isDark}
        >
          <span
            className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
              isDark ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={clsx('relative', className)}>
        <select
          value={theme}
          onChange={(e) => handleSelectTheme(e.target.value as Theme)}
          className="appearance-none px-4 py-2 pr-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={clsx(
        'p-2 rounded-lg transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        'text-gray-700 dark:text-gray-300',
        className
      )}
      aria-label={`Current theme: ${theme}. Click to toggle theme`}
    >
      <span className="flex items-center gap-2">
        {getIcon(theme)}
        {showLabel && (
          <span className="text-sm capitalize">{theme}</span>
        )}
      </span>
    </button>
  );
};