/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/typescript',
        'getting-started/platform-guide',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        {
          type: 'category',
          label: 'Speech & Audio',
          items: [
            'components/speech-to-text/overview',
            'components/speech-to-text/api',
            'components/speech-to-text/examples',
            'components/text-to-speech/overview',
            'components/text-to-speech/api',
            'components/text-to-speech/examples',
            'components/audio-recorder/overview',
            'components/audio-recorder/api',
            'components/audio-recorder/examples',
          ],
        },
        {
          type: 'category',
          label: 'Utilities',
          items: [
            'components/copy-to-clipboard/overview',
            'components/copy-to-clipboard/api',
            'components/copy-to-clipboard/examples',
            'components/theme-toggle/overview',
            'components/theme-toggle/api',
            'components/theme-toggle/examples',
            'components/share-button/overview',
            'components/share-button/api',
            'components/share-button/examples',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/theming',
        'guides/styling',
        'guides/accessibility',
        'guides/ssr',
        'guides/performance',
        'guides/migration',
        'guides/contributing',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/core-packages',
        'api-reference/react-components',
        'api-reference/utilities',
        'api-reference/types',
      ],
    },
  ],
};

module.exports = sidebars;