import type { Meta, StoryObj } from '@storybook/react';
import { ShareButton } from '@mycomponents/react-tailwind';
import { useState } from 'react';

const meta = {
  title: 'Utilities/Share Button',
  component: ShareButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Share content using native Web Share API with social media fallbacks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Share title',
    },
    text: {
      control: 'text',
      description: 'Share text/description',
    },
    url: {
      control: 'text',
      description: 'URL to share',
    },
    variant: {
      control: 'select',
      options: ['button', 'icon', 'menu'],
      description: 'Button variant',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show button label',
    },
    platforms: {
      control: 'check',
      options: ['native', 'twitter', 'facebook', 'linkedin', 'whatsapp', 'telegram', 'email'],
      description: 'Available share platforms',
    },
    onShare: { action: 'shared' },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Check out this awesome component library!',
    text: 'A comprehensive multi-platform component library with great documentation.',
    url: 'https://mycomponents.dev',
    variant: 'button',
    showLabel: true,
  },
};

export const IconButton: Story = {
  args: {
    title: 'Amazing Article',
    text: 'You should read this!',
    variant: 'icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact icon-only share button.',
      },
    },
  },
};

export const MenuVariant: Story = {
  args: {
    title: 'Share this content',
    text: 'Great content worth sharing',
    variant: 'menu',
    platforms: ['twitter', 'facebook', 'linkedin', 'whatsapp', 'email'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu layout with all platform options visible.',
      },
    },
  },
};

export const CustomPlatforms: Story = {
  args: {
    title: 'Limited sharing options',
    text: 'Only specific platforms available',
    platforms: ['twitter', 'email'],
    variant: 'button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Restricted to specific sharing platforms.',
      },
    },
  },
};

export const BlogPost: Story = {
  render: () => {
    const [shared, setShared] = useState(false);

    return (
      <article className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-2">
          Building Better Components
        </h1>
        <p className="text-gray-600 mb-4">Published on {new Date().toLocaleDateString()}</p>
        
        <p className="text-gray-700 mb-6">
          Learn how to create reusable, accessible components that work across
          multiple platforms and frameworks...
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <ShareButton
              title="Building Better Components"
              text="Great article about component development"
              url={window.location.href}
              variant="icon"
              onShare={(platform, success) => {
                if (success) setShared(true);
              }}
            />
            {shared && (
              <span className="text-sm text-green-600 animate-fade-in">
                Thanks for sharing!
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>1.2k views</span>
          </div>
        </div>
      </article>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Share button integrated in a blog post layout.',
      },
    },
  },
};

export const ProductCard: Story = {
  render: () => (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg">
      <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500"></div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Premium Component Pack</h3>
        <p className="text-gray-600 mb-4">
          Get access to 50+ premium components with lifetime updates.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">$49</span>
          <ShareButton
            title="Premium Component Pack - 50% Off!"
            text="Amazing deal on premium UI components"
            url="https://mycomponents.dev/premium"
            variant="button"
            showLabel={false}
            className="!px-3 !py-2 !text-sm"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Share button in an e-commerce product card.',
      },
    },
  },
};

export const SocialProof: Story = {
  render: () => {
    const [shareCount, setShareCount] = useState(42);
    
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Loved by developers worldwide</h2>
        <p className="text-gray-600">
          Join thousands of developers using our components
        </p>
        
        <div className="inline-flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <ShareButton
            title="I'm using @mycomponents for my next project!"
            text="Check out this amazing component library"
            url="https://mycomponents.dev"
            variant="button"
            onShare={(platform, success) => {
              if (success) setShareCount(count => count + 1);
            }}
          />
          
          <div className="text-left">
            <div className="text-2xl font-bold text-primary-600">{shareCount}</div>
            <div className="text-xs text-gray-500">Shares today</div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Share button with social proof counter.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Button Variants</h3>
        <div className="flex items-center gap-4">
          <ShareButton
            title="Share this"
            variant="button"
            showLabel={true}
          />
          <ShareButton
            title="Share this"
            variant="button"
            showLabel={false}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Icon Variant</h3>
        <ShareButton
          title="Share this"
          variant="icon"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Menu Variant</h3>
        <ShareButton
          title="Share this"
          variant="menu"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All share button variants in one view.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    title: 'Mobile sharing experience',
    text: 'Optimized for mobile devices',
    variant: 'icon',
  },
  decorators: [
    (Story) => (
      <div className="w-full p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mobile Content</h2>
          <Story />
        </div>
        <p className="text-gray-600 text-sm">
          This content is optimized for mobile sharing with native share sheet support.
        </p>
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile-optimized share button with native share sheet.',
      },
    },
  },
};