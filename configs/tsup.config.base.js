import { defineConfig } from 'tsup';

/**
 * Shared tsup configuration for all packages
 * Individual packages can extend this configuration
 */
export const createTsupConfig = (options = {}) => {
  return defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: false,
    treeshake: true,
    splitting: false,
    ...options,
  });
};

export default createTsupConfig();