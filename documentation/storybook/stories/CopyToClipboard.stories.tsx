import type { Meta, StoryObj } from '@storybook/react';
import { CopyToClipboard } from '@mycomponents/react-tailwind';
import { useState } from 'react';

const meta = {
  title: 'Utilities/Copy to Clipboard',
  component: CopyToClipboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Copy text to clipboard with visual feedback and browser fallbacks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to copy to clipboard',
    },
    onCopy: { action: 'copied' },
    successDuration: {
      control: 'number',
      description: 'Duration to show success state (ms)',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show tooltip on hover',
    },
    tooltipText: {
      control: 'text',
      description: 'Tooltip text before copying',
    },
    successTooltipText: {
      control: 'text',
      description: 'Tooltip text after copying',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof CopyToClipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Hello, World! This text will be copied to your clipboard.',
    showTooltip: true,
  },
};

export const CustomButton: Story = {
  args: {
    text: 'Custom styled content to copy',
  },
  render: (args) => (
    <CopyToClipboard {...args}>
      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
        Copy Custom Text
      </button>
    </CopyToClipboard>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use custom button as trigger for copy action.',
      },
    },
  },
};

export const InlineText: Story = {
  args: {
    text: 'npm install @mycomponents/react-tailwind',
    showTooltip: true,
  },
  render: (args) => (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-mono text-sm">
      <span>{args.text}</span>
      <CopyToClipboard {...args}>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </CopyToClipboard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline copy button for code snippets or commands.',
      },
    },
  },
};

export const CodeBlock: Story = {
  render: () => {
    const codeSnippet = `import { CopyToClipboard } from '@mycomponents/react-tailwind';

function App() {
  return (
    <CopyToClipboard text="Hello, World!">
      <button>Copy Text</button>
    </CopyToClipboard>
  );
}`;

    return (
      <div className="relative">
        <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
          <code>{codeSnippet}</code>
        </pre>
        <div className="absolute top-2 right-2">
          <CopyToClipboard text={codeSnippet} showTooltip={true}>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors">
              Copy
            </button>
          </CopyToClipboard>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Code block with copy functionality.',
      },
    },
  },
};

export const MultipleItems: Story = {
  render: () => {
    const items = [
      { label: 'Email', value: 'hello@example.com' },
      { label: 'Phone', value: '+1 (555) 123-4567' },
      { label: 'Address', value: '123 Main St, City, Country' },
      { label: 'API Key', value: 'sk_test_1234567890abcdef' },
    ];

    return (
      <div className="space-y-3 w-full max-w-md">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-sm text-gray-500">{item.value}</p>
            </div>
            <CopyToClipboard
              text={item.value}
              showTooltip={true}
              tooltipText={`Copy ${item.label}`}
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple copy buttons in a list layout.',
      },
    },
  },
};

export const WithFeedback: Story = {
  render: () => {
    const [copied, setCopied] = useState(false);
    const [copyCount, setCopyCount] = useState(0);

    const handleCopy = (success: boolean) => {
      if (success) {
        setCopied(true);
        setCopyCount(count => count + 1);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <div className="text-center space-y-4">
        <CopyToClipboard
          text="Track copy events with custom feedback"
          onCopy={handleCopy}
          showTooltip={false}
        >
          <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
            Copy Text
          </button>
        </CopyToClipboard>
        
        {copied && (
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Successfully copied!
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600">
          Copied {copyCount} time{copyCount !== 1 ? 's' : ''}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom feedback UI for copy events.',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    text: `This is a very long text that might be used for copying large amounts of content. It could be a full article, a long code snippet, or any other substantial text content that users might want to copy to their clipboard. The copy functionality works the same regardless of the text length.`,
    showTooltip: true,
    tooltipText: 'Copy full text',
  },
  render: (args) => (
    <div className="max-w-md">
      <div className="p-4 bg-gray-50 rounded-lg mb-3">
        <p className="text-sm text-gray-700 line-clamp-3">{args.text}</p>
      </div>
      <CopyToClipboard {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Copying long text content with preview.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    text: 'Mobile-friendly copy button',
    showTooltip: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Touch-optimized copy button for mobile devices.',
      },
    },
  },
};