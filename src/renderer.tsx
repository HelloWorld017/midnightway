import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import { createI18nResource, I18nProvider } from '@simplei18n/core/react';
import { createRoot } from 'react-dom/client';
import { match } from 'ts-pattern';
import { bridgeRenderer, registerImplementations } from './bridge/renderer';
import { ThemeProvider } from './components/common/ThemeProvider';
import { Overlay } from './components/widgets/Overlay';
import { StatusBar } from './components/widgets/StatusBar';
import { initConfigByValue } from './config';
import { translationLocales } from './i18n';
import locales from './i18n/generated';
import { globalStyle } from './utils/css/global';
import type { InitParams } from './bridge/types';
import type { Root } from 'react-dom/client';

type AppProps = { init: InitParams };
const i18nResource = createI18nResource(locales);

const App = ({ init }: AppProps) => (
  <I18nProvider lang={translationLocales[init.config.locale]} resource={i18nResource}>
    <ThemeProvider>
      <Global styles={[globalStyle]} />
      {match(init)
        .with({ kind: 'status-bar' }, init => <StatusBar monitorName={init.params.monitor} />)
        .with({ kind: 'overlay' }, () => <Overlay />)
        .with({ kind: 'dock' }, () => null)
        .otherwise(() => null)}
    </ThemeProvider>
  </I18nProvider>
);

// Initialize debug
window.$debug = (...args) => void bridgeRenderer.debug(args);

// Initialize bridge / initParams
const init = await bridgeRenderer.initParams();
initConfigByValue(init.config);

// Run
createRoot(document.querySelector('main')!).render(<App init={init} />);

// Register Zygote
// > To reduce parse overhead, as it is the critical path when creating overlay.
const children = new Map<string, Root>();
registerImplementations({
  zygoteFork({ id, initParams }) {
    const childWindow = window.open(`about:blank?${id}`, '');
    if (!childWindow) {
      return;
    }

    const root = createRoot(childWindow.document.body);
    const cache = createCache({
      key: id,
      container: childWindow.document.head,
    });

    children.set(id, root);
    root.render(
      <CacheProvider value={cache}>
        <App init={initParams} />
      </CacheProvider>,
    );
  },
  zygoteRelease({ id }) {
    children.get(id)?.unmount();
    children.delete(id);
  },
});
