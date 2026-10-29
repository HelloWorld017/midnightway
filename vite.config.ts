import { resolve } from 'node:path';
import simplei18n from '@simplei18n/core/vite';
import { defineConfig, withFilter } from 'vite';
import svgr from 'vite-plugin-svgr';
import swc from '@rollup/plugin-swc';

export default defineConfig(({ mode }) => {
  const entry = mode === 'shell' ? 'index' : 'renderer';

  return {
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },
    oxc: {
      jsx: { runtime: 'automatic', importSource: '@emotion/react' },
      target: 'es2022',
    },
    build: {
      target: 'es2022',
      emptyOutDir: entry === 'renderer',
      minify: false,
      lib: {
        entry: resolve(import.meta.dirname, `src/${entry}.tsx`),
        formats: ['es'],
        fileName: () => `${entry}.js`,
      },
      rolldownOptions: {
        external: /^(?:gi:\/\/|resource:\/\/|file:\/\/|cairo$|console$|gettext$|system$)/,
        transform: {
          decorator: {
            emitDecoratorMetadata: true,
          },
        },
        output: { codeSplitting: false },
      },
    },
    plugins: [
      simplei18n(),
      svgr({ include: '**/*.svg', svgrOptions: { svgo: false } }),
      withFilter(
        swc({
          swc: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                decorators: true,
                decoratorsBeforeExport: true
              },
              transform: { decoratorVersion: '2023-11' },
            },
          },
        }),
        { transform: { code: /(?:^|\s)@[a-zA-Z]/ } },
      ),
    ],
  };
});
