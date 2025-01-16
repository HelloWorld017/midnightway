import { IconLauncher } from '@/assets/icons';
import * as styles from './BarLauncher.css';

export const BarLauncher = ({ isIdle }: { isIdle: boolean }) => {
  return <IconLauncher css={styles.launcherIconStyle(isIdle ? 'floating' : 'glass')} />;
};
