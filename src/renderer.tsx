import { Global } from '@emotion/react';
import { createRoot } from 'react-dom/client';
import { match } from 'ts-pattern';
import { bridgeRenderer } from './bridge/renderer';
import { ThemeProvider } from './components/common/ThemeProvider';
import { StatusBar } from './components/widgets/StatusBar';
import { initConfigByValue } from './config';
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

const init = await bridgeRenderer.initParams();
initConfigByValue(init.config);
createRoot(document.querySelector('main')!).render(<App init={init} />);
