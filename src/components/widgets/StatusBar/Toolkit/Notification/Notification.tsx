import { animated, useTransition as useSpringTransition } from '@react-spring/web';
import { useTranslation } from 'react-i18next';
import { repo } from '@/bridge/repository';
import { PlaybackStatus } from '@/constants/gir';
import { useRefMap } from '@/hooks/useRefMap';
import { useInvokeRepo, usePollRepo, useRepo } from '@/hooks/useRepo';
import { sleep } from '@/utils/promise';
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
  const notifications = useRepo(
    repo.notification.notifications.$pickArray(
      'id',
      'appName',
      'time',
      'summary',
      'body',
      'image',
      'actions',
      'category'
    )
  );

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

  const [refMap, refCallback] = useRefMap<number, HTMLDivElement>();
  const transitions = useSpringTransition(notifications ?? [], {
    keys: item => item.id,
    from: { x: -30, opacity: 0, height: 0 },
    enter: item => async next => {
      await next({ x: 0, opacity: 1, height: refMap.get(item.id)?.offsetHeight ?? 'auto' });
    },
    leave: () => async next => {
      await Promise.all([next({ x: 30, opacity: 0 }), sleep(150).then(() => next({ height: 0 }))]);
    },
    trail: 50,
  });

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
      <div css={styles.notificationListStyle}>
        <div css={styles.noItemsStyle(!notifications?.length)}>
          {t('notification.no-notification')}
        </div>
        {transitions((style, item) => (
          <animated.div style={style}>
            <div css={styles.notificationItemStyle} ref={refCallback(item.id)}>
              <NotificationItem item={item} />
            </div>
          </animated.div>
        ))}
      </div>
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
