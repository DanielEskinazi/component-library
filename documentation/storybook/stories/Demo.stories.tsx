import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Demo/Welcome',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: () => (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to @mycomponents Storybook</h1>
      <p className="text-lg text-gray-600 mb-6">
        This is a demo of the component library documentation.
      </p>
      <p className="text-gray-500">
        Component stories will be displayed here once the packages are built.
      </p>
    </div>
  ),
};