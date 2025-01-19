import { IconNotification } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './BarNotification.css';

export const BarNotification = () => {
  const notificationLength = useRepo(repo.notification.notifications.length);
  return <IconNotification css={styles.notificationIconStyle(!!notificationLength)} />;
};
