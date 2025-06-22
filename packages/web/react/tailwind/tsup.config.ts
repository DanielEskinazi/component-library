import { createTsupConfig } from '../../../../configs/tsup.config.base.js';

export default createTsupConfig({
  external: ['react', 'react-dom'],
});