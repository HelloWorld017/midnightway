import { App } from 'astal/gtk4';
import { Bar } from './components/Bar';

App.start({
  main() {
    App.get_monitors().map(monitor => <Bar monitor={monitor} />);
  },
});
