import { createRoot } from 'react-dom/client';
import { match } from 'ts-pattern';
import { bridgeRenderer } from './bridge/renderer';
import { StatusBar } from './components/widgets/StatusBar';
import type { InitParams } from './bridge/types';

type AppProps = { init: InitParams };
const App = ({ init }: AppProps) =>
  match(init)
    .with({ kind: 'status-bar' }, init => <StatusBar monitorName={init.params.monitor} />)
    .with({ kind: 'dock' }, () => null)
    .otherwise(() => null);

document.write('<main></main>');
void bridgeRenderer.initParams().then(init => {
  createRoot(document.querySelector('main')!).render(<App init={init} />);
});
