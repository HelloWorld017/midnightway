import { IconNotification } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './BarNotification.css';
import type { SurfaceKind } from '@/constants/theme';

export const BarPower = ({ isIdle }: { isIdle: boolean }) => {
  const surface: SurfaceKind = isIdle ? 'floating' : 'glass';
  const hasNotification = useRepo(repo.notification);
  return <IconNotification css={styles.notificationIconStyle(surface)} />;
};
