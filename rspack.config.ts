import { join } from 'node:path';
import { defineConfig } from '@rspack/cli';
import { CopyRspackPlugin, type SwcLoaderOptions } from '@rspack/core';

export default defineConfig({
  entry: {
    index: './src/index.tsx',
  },

  output: {
    clean: true,
    filename: '[name].js',
    library: {
      type: 'module',
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        type: 'javascript/auto',
        options: {
          jsc: {
            target: 'es2022',
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
                importSource: 'astal/gtk4',
                development: false,
                refresh: false,
              },
            },
          },
        } satisfies SwcLoaderOptions,
      },
    ],
  },

  resolve: {
    alias: {
      '@': join(process.cwd(), 'src'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.wasm'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
  },

  externals: [
    'cairo',
    'console',
    'gettext',
    'system',
    /^file:\/\//,
    /^gi:\/\//,
    /^resource:\/\//,
  ],

  externalsType: 'module-import',

  plugins: [
    new CopyRspackPlugin({
      patterns: [
        { from: join(process.cwd(), 'src/assets/icons'), to: 'icons' },
      ],
    }),
  ],

  experiments: {
    outputModule: true,
  },
});
