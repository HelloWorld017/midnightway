declare module '@simplei18n/core' {
  import type { TranslationDescriptor } from '@simplei18n/core'

  interface I18nConfig {
    locales: "en_US" | "ko_KR";
    defaultLocale: "en_US";
  }

  interface TranslationMap {
    calendar: {
      /** {year} / {month} */
      input: TranslationDescriptor<{ interpolations: "month" | "year", tags: never }>;
    };
    controlCenter: {
      /** Network */
      network: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Connected */
      networkConnected: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Local Only */
      networkConnectedWithoutGlobal: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Connecting */
      networkConnecting: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Not Connected */
      networkDisconnected: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Disconnecting */
      networkDisconnecting: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Reboot */
      powerReboot: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Shutdown */
      powerShutdown: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Suspend */
      powerSuspend: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Session {hours}h {minutes}m {seconds}s */
      sessionDuration: TranslationDescriptor<{ interpolations: "hours" | "minutes" | "seconds", tags: never }>;
      /** Lock */
      sessionLock: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Log Off */
      sessionLogoff: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Silent Mode */
      silentMode: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Slide to {action} */
      slideTo: TranslationDescriptor<{ interpolations: "action", tags: never }>;
    };
    notification: {
      /** Clear All */
      clearAll: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Playing Media */
      media: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** No notifications. */
      noNotification: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** Notification */
      notification: TranslationDescriptor<{ interpolations: never, tags: never }>;
      /** System Tray */
      tray: TranslationDescriptor<{ interpolations: never, tags: never }>;
    };
  }
}

declare global {
  module '*.i18n.yaml' {
    import type { Locale } from '@simplei18n/core';
    const locale: Locale;
    export default locale;
  }
}

export {}
