import { join } from 'node:path';
import { defineConfig } from '@rspack/cli';
import type { SwcLoaderOptions } from '@rspack/core';

const getSwcLoaderOptions = (meta: Record<string, string>): SwcLoaderOptions => ({
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
      constModules: {
        globals: { '#meta': meta },
      },
    },
  },
});

export default defineConfig({
  entry: {
    index: {
      import: './src/index.tsx',
      layer: 'index',
    },
    renderer: {
      import: './src/renderer.tsx',
      layer: 'renderer',
    },
  },

  target: false,
  output: {
    clean: true,
    module: true,
    chunkFormat: 'module',
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
        issuerLayer: 'index',
        options: getSwcLoaderOptions({ IS_RENDERER: 'false' }),
        parser: {
          importMeta: false,
        },
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        type: 'javascript/auto',
        issuerLayer: 'renderer',
        options: getSwcLoaderOptions({ IS_RENDERER: 'true' }),
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
    '#meta',
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
    layers: true,
    outputModule: true,
    topLevelAwait: true,
  },
});
