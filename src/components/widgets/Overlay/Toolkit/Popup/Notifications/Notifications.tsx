import { NotificationSection } from '../../Notification/Notification';
import * as styles from '../index.css';

export const Notifications = ({ width }: { width: string }) => (
  <div css={styles.popupStyle(width)}>
    <NotificationSection />
  </div>
);
