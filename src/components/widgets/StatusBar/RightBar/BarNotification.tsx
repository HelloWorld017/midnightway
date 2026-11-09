import { IconBell } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import { useToolkitPopup } from '../hooks/useToolkitPopup';
import * as styles from './BarNotification.css';

export const BarNotification = () => {
  const notificationLength = useRepo(repo.notification.notifications.length);
  const onClick = useToolkitPopup('notifications');
  return (
    <button
      css={styles.notificationIconStyle(!!notificationLength)}
      type="button"
      aria-label="Notifications"
      onClick={onClick}
    >
      <IconBell />
    </button>
  );
};
