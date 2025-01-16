import { Global, ThemeProvider } from '@emotion/react';
import { createRoot } from 'react-dom/client';
import { match } from 'ts-pattern';
import { bridgeRenderer } from './bridge/renderer';
import { StatusBar } from './components/widgets/StatusBar';
import { DEFAULT_THEME } from './constants/theme';
import { globalStyle } from './utils/css/global';
import type { InitParams } from './bridge/types';

type AppProps = { init: InitParams };
const App = ({ init }: AppProps) => (
  <ThemeProvider theme={DEFAULT_THEME}>
    <Global styles={[globalStyle]} />
    {match(init)
      .with({ kind: 'status-bar' }, init => <StatusBar monitorName={init.params.monitor} />)
      .with({ kind: 'dock' }, () => null)
      .otherwise(() => null)}
  </ThemeProvider>
);

void bridgeRenderer.initParams().then(init => {
  createRoot(document.querySelector('main')!).render(<App init={init} />);
});
