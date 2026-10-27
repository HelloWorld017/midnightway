import { repo } from '@/bridge/repository';
import { PlaybackStatus } from '@/constants/gir';
import { useInvokeRepo, usePollRepo, useRepo } from '@/hooks/useRepo';
import { defineI18n } from '@simplei18n/core';
import { useI18n } from '@simplei18n/core/react';
import { MediaItem } from './MediaItem';
import * as styles from './Notification.css';
import { NotificationList } from './NotificationList';
import { TrayItem } from './TrayItem';
import { useNotifications } from './hooks/useNotifications';

defineI18n(
  yaml => yaml`
  # scope: notification
  tray: 'System Tray'
  media: 'Playing Media'
  notification: 'Notification'
  noNotification: 'No notifications.'
  clearAll: 'Clear All'
`,
);

export const TraySection = () => {
  const { t } = useI18n();
  const trayItems = usePollRepo(repo.tray.$invokeMethod('get_items').$pickArray('itemId'), 1000);

  if (!trayItems?.length) {
    return null;
  }

  return (
    <div css={styles.sectionStyle}>
      <div css={styles.sectionHeaderStyle}>
        <h2 css={styles.sectionTitleStyle}>{t(t.notification.tray)}</h2>
      </div>
      <div css={styles.trayListStyle}>
        {trayItems?.map(({ itemId }) => (
          <TrayItem id={itemId} key={itemId} />
        ))}
      </div>
    </div>
  );
};

export const MediaSection = () => {
  const { t } = useI18n();
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
        'canSeek',
      ),
  );

  if (!player) {
    return null;
  }

  return (
    <div css={styles.sectionStyle}>
      <div css={styles.sectionHeaderStyle}>
        <h2 css={styles.sectionTitleStyle}>{t(t.notification.media)}</h2>
      </div>
      <MediaItem player={player} />
    </div>
  );
};

export const NotificationSection = () => {
  const { t } = useI18n();
  const notifications = useNotifications();

  const invoke = useInvokeRepo();
  const onClearAll = () => {
    notifications?.forEach(notification => {
      invoke(
        repo.notification
          .$invokeMethod('get_notification', notification.id)
          .$invokeMethod('dismiss'),
      ).catch(() => {});
    });
  };

  return (
    <div css={styles.sectionStyle}>
      <div css={styles.sectionHeaderStyle}>
        <h2 css={styles.sectionTitleStyle}>{t(t.notification.notification)}</h2>
        <button
          css={styles.notificationClearAllStyle(!!notifications?.length)}
          type="button"
          onClick={onClearAll}
        >
          {t(t.notification.clearAll)}
        </button>
      </div>
      <NotificationList notifications={notifications ?? []}>
        <div css={styles.noItemsStyle(!notifications?.length)}>
          {t(t.notification.noNotification)}
        </div>
      </NotificationList>
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
