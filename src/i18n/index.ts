import { config } from '@/config';
import { enUS as dateLocaleEnUS } from 'date-fns/locale/en-US';
import { ko as dateLocaleKoKR } from 'date-fns/locale/ko';
import type { LocaleKey } from '@simplei18n/core';
import type { Locale as DateLocale } from 'date-fns';

export type LocaleCode = 'en-US' | 'ko-KR';

export const translationLocales = {
  'en-US': 'en_US',
  'ko-KR': 'ko_KR',
} satisfies Record<LocaleCode, LocaleKey>;

const dateLocales = {
  'en-US': dateLocaleEnUS,
  'ko-KR': dateLocaleKoKR,
} satisfies Record<LocaleCode, DateLocale>;

export const locale = () => ({
  locale: config().locale,
  date: dateLocales[config().locale],
});
