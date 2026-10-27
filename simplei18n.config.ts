import { defineConfig } from '@simplei18n/core';

export default defineConfig({
  target: {
    include: ['./src/**/*.ts', './src/**/*.tsx'],
    outDir: './src/i18n/generated',
    eager: ['en_US', 'ko_KR'],
  },
  locales: ['en_US', 'ko_KR'],
  defaultLocale: 'en_US',
});
