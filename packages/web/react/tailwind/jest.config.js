const baseConfig = require('../../../../configs/jest.config.base.js');

module.exports = {
  ...baseConfig,
  displayName: '@mycomponents/react-tailwind',
  rootDir: '.',
  
  // Additional setup for React Testing Library
  setupFilesAfterEnv: [
    '<rootDir>/../../../../configs/jest.setup.js',
    '<rootDir>/src/test-utils/setup.ts',
  ],
  
  // Module name mapping for workspace dependencies
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@mycomponents/audio-core$': '<rootDir>/../../../core/audio/src',
    '^@mycomponents/ui-core$': '<rootDir>/../../../core/ui/src',
    '^@mycomponents/utils$': '<rootDir>/../../../core/utils/src',
  },
};