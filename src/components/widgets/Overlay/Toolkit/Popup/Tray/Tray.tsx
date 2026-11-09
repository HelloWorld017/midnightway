import { repo } from '@/bridge/repository';
import { usePollRepo } from '@/hooks/useRepo';
import { useI18n } from '@simplei18n/core/react';
import * as notificationStyles from '../../Notification/Notification.css';
import { TrayItem } from '../../Notification/TrayItem';
import * as styles from '../popup.css';

export const Tray = () => {
  const items = usePollRepo(repo.tray.$invokeMethod('get_items').$pickArray('itemId'), 1000);
  const { t } = useI18n();
  return (
    <div css={styles.popupStyle('30rem')}>
      <div css={notificationStyles.sectionHeaderStyle}>
        <h2 css={notificationStyles.sectionTitleStyle}>{t(t.notification.tray)}</h2>
      </div>
      {items?.length ? (
        <div css={notificationStyles.trayListStyle}>
          {items.map(({ itemId }) => (
            <TrayItem key={itemId} id={itemId} />
          ))}
        </div>
      ) : (
        <div css={styles.emptyStyle}>No tray items.</div>
      )}
    </div>
  );
};
