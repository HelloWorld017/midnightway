import { useTranslation } from 'react-i18next';
import { repo } from '@/bridge/repository';
import { PlaybackStatus } from '@/constants/gir';
import { useInvokeRepo, usePollRepo, useRepo } from '@/hooks/useRepo';
import { MediaItem } from './MediaItem';
import * as styles from './Notification.css';
import { NotificationItem } from './NotificationItem';
import { TrayItem } from './TrayItem';

const TraySection = () => {
  const { t } = useTranslation();
  const trayItems = usePollRepo(repo.tray.$invokeMethod('get_items').$pickArray('itemId'), 1000);

  if (!trayItems?.length) {
    return null;
  }

  return (
    <div css={styles.sectionStyle}>
      <div css={styles.sectionHeaderStyle}>
        <h2 css={styles.sectionTitleStyle}>{t('notification.tray')}</h2>
      </div>
      <div css={styles.trayListStyle}>
        {trayItems?.map(({ itemId }) => <TrayItem id={itemId} key={itemId} />)}
      </div>
    </div>
  );
};

const MediaSection = () => {
  const { t } = useTranslation();
  const player = useRepo(
    repo.musicPlayer.players
      .$find('playbackStatus', 'in', [PlaybackStatus.PLAYING, PlaybackStatus.PAUSED])
      .$pick(
        'busName',
        'title',
        'artist',
        'artUrl',
        'coverArt',
        'position',
        'length',
        'playbackStatus',
        'canPlay',
        'canPause',
        'canGoNext',
        'canGoPrevious',
        'canSeek'
      )
  );

  if (!player) {
    return null;
  }

  return (
    <div css={styles.sectionStyle}>
      <div css={styles.sectionHeaderStyle}>
        <h2 css={styles.sectionTitleStyle}>{t('notification.media')}</h2>
      </div>
      <MediaItem player={player} />
    </div>
  );
};

const NotificationSection = () => {
  const { t } = useTranslation();
  const notifications = useRepo(repo.notification.notifications.$pickArray('id'));
  const invoke = useInvokeRepo();
  const onClearAll = () => {
    notifications?.forEach(notification => {
      invoke(
        repo.notification
          .$invokeMethod('get_notification', notification.id)
          .$invokeMethod('dismiss')
      ).catch(() => {});
    });
  };

  return (
    <div css={styles.sectionStyle}>
      <div css={styles.sectionHeaderStyle}>
        <h2 css={styles.sectionTitleStyle}>{t('notification.notification')}</h2>
        <button
          css={styles.notificationClearAllStyle(!!notifications?.length)}
          type="button"
          onClick={onClearAll}
        >
          {t('notification.clear-all')}
        </button>
      </div>
      {notifications?.length ? (
        <div css={styles.notificationListStyle}>
          {notifications.map(({ id }) => (
            <NotificationItem id={id} />
          ))}
        </div>
      ) : (
        <div css={styles.noItemsStyle}>{t('notification.no-notification')}</div>
      )}
    </div>
  );
};

export const Notification = () => (
  <div css={styles.containerStyle}>
    <TraySection />
    <MediaSection />
    <NotificationSection />
  </div>
);
