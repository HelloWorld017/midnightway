import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import i18next from 'i18next';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { match } from 'ts-pattern';
import { bridgeRenderer, registerImplementations } from './bridge/renderer';
import { ThemeProvider } from './components/common/ThemeProvider';
import { Overlay } from './components/widgets/Overlay';
import { StatusBar } from './components/widgets/StatusBar';
import { initConfigByValue } from './config';
import { locale } from './i18n';
import { globalStyle } from './utils/css/global';
import type { InitParams } from './bridge/types';
import type { Root } from 'react-dom/client';

type AppProps = { init: InitParams };
const App = ({ init }: AppProps) => (
  <ThemeProvider>
    <Global styles={[globalStyle]} />
    {match(init)
      .with({ kind: 'status-bar' }, init => <StatusBar monitorName={init.params.monitor} />)
      .with({ kind: 'overlay' }, () => <Overlay />)
      .with({ kind: 'dock' }, () => null)
      .otherwise(() => null)}
  </ThemeProvider>
);

// Initialize debug
window.$debug = (...args) => void bridgeRenderer.debug(args);

// Initialize bridge / initParams
const init = await bridgeRenderer.initParams();
initConfigByValue(init.config);

// Initialize i18n
await i18next.use(initReactI18next).init({
  resources: {
    [locale().locale]: locale().translation,
  },
  lng: locale().locale,
});

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
      </CacheProvider>
    );
  },
  zygoteRelease({ id }) {
    children.get(id)?.unmount();
    children.delete(id);
  },
});
