import { App } from 'astal/gtk4';
import { StatusBar } from './components/widgets/StatusBar';

App.start({
  main() {
    App.add_icons('./icons');
    App.get_monitors().map(monitor => <StatusBar monitor={monitor} />);
  },
});
