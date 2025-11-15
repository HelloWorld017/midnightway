/** @jsxImportSource astal/gtk4 */

import '@/config/init';

import { App } from 'astal/gtk4';
import { MdApp } from './components/astal/MdApp';
import { eachMonitor } from './components/astal/utils/eachMonitor';

App.start({
  main() {
    eachMonitor(monitor => <MdApp monitor={monitor} />);
  },
});
