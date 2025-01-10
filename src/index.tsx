import { App } from 'astal/gtk4';
import { StatusBar } from './components/StatusBar';

App.start({
  main() {
    App.get_monitors().map(monitor => <StatusBar monitor={monitor} />);
  },
});
