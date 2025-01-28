import { useTranslation } from 'react-i18next';
import { repo } from '@/bridge/repository';
import { PlaybackStatus } from '@/constants/gir';
import { usePollRepo, useRepo } from '@/hooks/useRepo';
import { MediaItem } from './MediaItem';
import * as styles from './Notification.css';
import { TrayItem } from './TrayItem';

const Tray = () => {
  const { t } = useTranslation();
  const trayItems = usePollRepo(repo.tray.$invokeMethod('get_items').$pickArray('itemId'), 1000);

  if (!trayItems?.length) {
    return null;
  }

  return (
    <div css={styles.sectionStyle}>
      <h2 css={styles.sectionTitleStyle}>{t('notification.tray')}</h2>
      <div css={styles.trayListStyle}>
        {trayItems?.map(({ itemId }) => <TrayItem id={itemId} key={itemId} />)}
      </div>
    </div>
  );
};

const Media = () => {
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
      <h2 css={styles.sectionTitleStyle}>{t('notification.media')}</h2>
      <MediaItem player={player} />
    </div>
  );
};

export const Notification = () => (
  <div>
    <Tray />
    <Media />
  </div>
);
