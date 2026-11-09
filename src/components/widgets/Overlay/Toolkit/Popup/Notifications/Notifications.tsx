import { NotificationSection } from '../../Notification/Notification';
import * as styles from '../popup.css';

export const Notifications = () => (
  <div css={styles.popupStyle('36rem')}>
    <NotificationSection />
  </div>
);
