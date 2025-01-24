import { enUS as dateLocaleEnUS } from 'date-fns/locale/en-US';
import { ko as dateLocaleKoKR } from 'date-fns/locale/ko';
import { config } from '@/config';
import { translationsEnUS } from './en-US';
import { translationsKoKR } from './ko-KR';
import type { Locale as DateLocale } from 'date-fns';

export type LocaleCode = 'en-US' | 'ko-KR';

const translations = {
  'en-US': translationsEnUS,
  'ko-KR': translationsKoKR,
} satisfies Record<LocaleCode, Record<string, unknown>>;

const dateLocales = {
  'en-US': dateLocaleEnUS,
  'ko-KR': dateLocaleKoKR,
} satisfies Record<LocaleCode, DateLocale>;

export const locale = () => ({
  locale: config().locale,
  translation: translations[config().locale],
  date: dateLocales[config().locale],
});
