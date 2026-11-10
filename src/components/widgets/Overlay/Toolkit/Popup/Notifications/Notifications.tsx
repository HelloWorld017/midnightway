import { NotificationSection } from '../../Notification/Notification';
import * as indexStyles from '../index.css';
import * as styles from './Notifications.css';

export const Notifications = ({ width }: { width: string }) => (
  <div css={[indexStyles.popupStyle(width), styles.notificationsStyle]}>
    <NotificationSection />
  </div>
);
