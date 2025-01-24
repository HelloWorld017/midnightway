import { Global } from '@emotion/react';
import i18next from 'i18next';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { match } from 'ts-pattern';
import { bridgeRenderer } from './bridge/renderer';
import { ThemeProvider } from './components/common/ThemeProvider';
import { StatusBar } from './components/widgets/StatusBar';
import { initConfigByValue } from './config';
import { locale } from './i18n';
import { globalStyle } from './utils/css/global';
import type { InitParams } from './bridge/types';

type AppProps = { init: InitParams };
const App = ({ init }: AppProps) => (
  <ThemeProvider>
    <Global styles={[globalStyle]} />
    {match(init)
      .with({ kind: 'status-bar' }, init => <StatusBar monitorName={init.params.monitor} />)
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
