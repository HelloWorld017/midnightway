import { App } from 'astal/gtk4';
import { StatusBar } from './components/StatusBar';

App.start({
  main() {
    import.meta.CSS_PATHS.forEach(cssFile => {
      App.apply_css(`./dist/${cssFile}`);
    });
    App.get_monitors().map(monitor => <StatusBar monitor={monitor} />);
  },
});
