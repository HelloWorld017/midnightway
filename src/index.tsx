import '@/config/init';
import app from 'ags/gtk4/app';
import { MdApp } from './components/astal/MdApp';
import { eachMonitor } from './components/astal/utils/eachMonitor';

app.start({
  instanceName: 'midnightway',
  main() {
    eachMonitor(monitor => MdApp({ monitor }));
  },
});
