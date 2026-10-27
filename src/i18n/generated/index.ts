import { defineLocales } from '@simplei18n/core';
import defaultEnUS from "./_locales/en_US.i18n.yaml";
import defaultKoKR from "./_locales/ko_KR.i18n.yaml";

export default defineLocales({
  locales: {
    en_US: defaultEnUS,
    ko_KR: defaultKoKR,
  },
  defaultLocale: "en_US",
});
