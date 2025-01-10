import { join } from 'node:path';
import { defineConfig } from '@farmfe/core';

export default defineConfig({
  compilation: {
    input: {
      index: './src/index.tsx',
    },
    output: {
      path: './dist',
      publicPath: './',
      targetEnv: 'library',
    },
    script: {
      target: 'es2022',
    },
    external: [
      '^cairo$',
      '^console$',
      '^gettext$',
      '^system$',
      '^file://.*',
      '^gi://.*',
      '^resource://.*',
    ],
    resolve: {
      alias: {
        '@/': join(process.cwd(), 'src'),
      },
    },
    minify: process.env.BUILD_MODE !== 'development',
  },
  plugins: [
    [
      '@farmfe/plugin-react',
      {
        importSource: 'astal/gtk4',
        development: false,
        refresh: false,
      },
    ],
  ],
});
