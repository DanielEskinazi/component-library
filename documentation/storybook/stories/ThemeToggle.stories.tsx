import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '@mycomponents/react-tailwind';
import { useState } from 'react';
import { Theme } from '@mycomponents/utils';

const meta = {
  title: 'Utilities/Theme Toggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Theme switching component with support for light, dark, and system themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultTheme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'Default theme',
    },
    onChange: { action: 'themeChanged' },
    variant: {
      control: 'select',
      options: ['button', 'switch', 'dropdown'],
      description: 'Toggle UI variant',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show theme label',
    },
    storageKey: {
      control: 'text',
      description: 'LocalStorage key for persistence',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: {
    variant: 'button',
    showLabel: false,
  },
};

export const ButtonWithLabel: Story = {
  args: {
    variant: 'button',
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button variant with theme label.',
      },
    },
  },
};

export const Switch: Story = {
  args: {
    variant: 'switch',
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle switch for light/dark theme only.',
      },
    },
  },
};

export const Dropdown: Story = {
  args: {
    variant: 'dropdown',
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown selector for all theme options.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Button Variant</h3>
        <div className="flex items-center gap-4">
          <ThemeToggle variant="button" />
          <ThemeToggle variant="button" showLabel={true} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Switch Variant</h3>
        <div className="flex items-center gap-4">
          <ThemeToggle variant="switch" />
          <ThemeToggle variant="switch" showLabel={true} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Dropdown Variant</h3>
        <ThemeToggle variant="dropdown" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available theme toggle variants.',
      },
    },
  },
};

export const ThemedContent: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('light');

    return (
      <div className="space-y-6 p-8 rounded-lg bg-white dark:bg-gray-800 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Themed Content
          </h2>
          <ThemeToggle onChange={setTheme} variant="button" />
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          This content adapts to the selected theme. The background, text colors,
          and other elements change based on whether light or dark mode is active.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Card 1
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This card changes appearance with theme.
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Card 2
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Another themed card example.
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Current theme: <span className="font-medium">{theme}</span>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of content that responds to theme changes.',
      },
    },
  },
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <ThemeToggle
        variant="button"
        className="!p-3 !bg-purple-500 hover:!bg-purple-600 !text-white !rounded-full"
      />
      
      <ThemeToggle
        variant="switch"
        className="scale-125"
      />
      
      <ThemeToggle
        variant="dropdown"
        className="!bg-gradient-to-r from-blue-500 to-purple-500 !text-white !border-0"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom styled theme toggles.',
      },
    },
  },
};

export const PersistentTheme: Story = {
  render: () => {
    const [storageKey] = useState(`theme-demo-${Date.now()}`);

    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600 mb-4">
          This theme toggle persists to localStorage with key: <code className="bg-gray-100 px-2 py-1 rounded">{storageKey}</code>
        </p>
        
        <ThemeToggle
          variant="dropdown"
          storageKey={storageKey}
          defaultTheme="system"
        />
        
        <p className="text-xs text-gray-500 mt-4">
          Try changing the theme and refreshing the page!
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme selection persists across page reloads.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    variant: 'button',
    showLabel: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800">
        <h1 className="text-lg font-semibold">Mobile App</h1>
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile-optimized theme toggle in app header.',
      },
    },
  },
};