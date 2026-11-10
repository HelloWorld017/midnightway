import { repo } from '@/bridge/repository';
import { usePollRepo } from '@/hooks/useRepo';
import { useI18n } from '@simplei18n/core/react';
import * as notificationStyles from '../../Notification/Notification.css';
import { TrayItem } from '../../Notification/TrayItem';
import * as styles from '../index.css';

export const Tray = ({ width }: { width: string }) => {
  const items = usePollRepo(repo.tray.$invokeMethod('get_items').$pickArray('itemId'), 1000);
  const { t } = useI18n();
  return (
    <div css={styles.popupStyle(width)}>
      <div css={notificationStyles.sectionHeaderStyle}>
        <h2 css={notificationStyles.sectionTitleStyle}>{t(t.notification.tray)}</h2>
      </div>
      {items?.length ? (
        <ul css={styles.trayListStyle}>
          {items.map(({ itemId }) => (
            <li key={itemId}>
              <TrayItem id={itemId} css={styles.trayItemStyle} />
            </li>
          ))}
        </ul>
      ) : (
        <div css={styles.emptyStyle}>No tray items.</div>
      )}
    </div>
  );
};
