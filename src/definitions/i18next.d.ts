import type { translationsEnUS } from '@/i18n/en-US';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof translationsEnUS;
  }
}

export {};
