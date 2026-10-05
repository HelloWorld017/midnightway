import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [svgr({ include: '**/*.svg', svgrOptions: { svgo: false } })],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@emotion/react',
    target: 'es2022',
  },
  build: {
    target: 'es2022',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/renderer.tsx'),
      formats: ['es'],
      fileName: () => 'renderer.js',
    },
    rollupOptions: {
      external: /^(?:gi:\/\/|resource:\/\/|file:\/\/|cairo$|console$|gettext$|system$)/,
      output: { inlineDynamicImports: true },
    },
  },
});
