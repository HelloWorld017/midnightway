import { resolve } from 'node:path';
import simplei18n from '@simplei18n/core/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const entry = mode === 'shell' ? 'index' : 'renderer';

  return {
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [simplei18n(), svgr({ include: '**/*.svg', svgrOptions: { svgo: false } })],
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
        output: { codeSplitting: false },
      },
    },
  };
});
