import { join } from 'node:path';
import { defineConfig } from '@rspack/cli';
import { type SwcLoaderOptions } from '@rspack/core';

export default defineConfig({
  entry: {
    index: './src/index.tsx',
    renderer: './src/renderer.tsx',
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
                importSource: '@emotion/react',
                development: false,
                refresh: false,
              },
            },
          },
        } satisfies SwcLoaderOptions,
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
      },
    ],
  },

  resolve: {
    alias: {
      '@': join(process.cwd(), 'src'),
    },
    fallback: {
      path: 'path-browserify',
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.wasm'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
  },

  // prettier-ignore
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

  experiments: {
    outputModule: true,
  },
});
