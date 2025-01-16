import { IconMusic } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { Collapsible } from '@/components/common/Collapsible';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './BarMusicPlayer.css';
import type { SurfaceKind } from '@/constants/theme';

const enum PlaybackStatus {
  PLAYING = 0,
  PAUSED = 1,
  STOPPED = 2,
}

export const BarMusicPlayer = ({ isIdle }: { isIdle: boolean }) => {
  const surface: SurfaceKind = isIdle ? 'floating' : 'glass';
  const player = useRepo(
    repo.musicPlayer.players
      .$find('playbackStatus', 'is', PlaybackStatus.PLAYING)
      .$pick('artist', 'title')
  );

  return (
    <Collapsible
      css={styles.musicCollapsibleStyle(!!player)}
      orientation="horizontal"
      isVisible={!!player}
    >
      <div css={styles.musicStyle}>
        <IconMusic css={styles.musicIconStyle(surface)} />
        <div css={styles.musicColumnsStyle}>
          <div css={styles.musicHeaderStyle}>
            <h1 css={styles.musicHeaderTitleStyle(surface)}>{player?.title}</h1>
            <Collapsible orientation="horizontal" isVisible={!isIdle}>
              <div css={styles.musicHeaderArtistContainerStyle(surface)}>
                <span css={styles.musicHeaderArtistStyle(surface, !isIdle)}>{player?.artist}</span>
              </div>
            </Collapsible>
          </div>
          <Collapsible orientation="vertical" isVisible={isIdle}>
            <span css={styles.musicArtistStyle(surface, isIdle)}>{player?.artist}</span>
          </Collapsible>
        </div>
      </div>
    </Collapsible>
  );
};
