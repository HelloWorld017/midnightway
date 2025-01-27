import { IconNotification } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './BarNotification.css';

export const BarNotification = () => {
  const notificationLength = useRepo(repo.notification.notifd.notifications.length);
  return (
    <div css={styles.notificationIconStyle(!!notificationLength)}>
      <IconNotification />
    </div>
  );
};
