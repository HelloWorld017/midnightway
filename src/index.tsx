/** @jsxImportSource astal/gtk4 */

import '@/config/init';

import { App } from 'astal/gtk4';
import { MdStatusBar } from './components/astal/MdStatusBar';
import { eachMonitor } from './components/astal/utils/eachMonitor';

App.start({
  main() {
    eachMonitor(monitor => <MdStatusBar monitor={monitor} />);
  },
});
