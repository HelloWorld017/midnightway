import { IconMusic } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { Collapsible } from '@/components/common/Collapsible';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './BarMusicPlayer.css';

const enum PlaybackStatus {
  PLAYING = 0,
  PAUSED = 1,
  STOPPED = 2,
}

export const BarMusicPlayer = ({ isIdle }: { isIdle: boolean }) => {
  const player = useRepo(
    repo.musicPlayer.players
      .$find('playbackStatus', 'is', PlaybackStatus.PLAYING)
      .$pick('artist', 'title')
  );

  const hasArtist = !!player?.artist;

  return (
    <Collapsible
      css={styles.musicCollapsibleStyle(!!player)}
      orientation="horizontal"
      isVisible={!!player}
    >
      <div css={styles.musicStyle}>
        <IconMusic css={styles.musicIconStyle} />
        <div css={styles.musicColumnStyle}>
          <div css={styles.musicHeaderStyle}>
            <h1 css={styles.musicHeaderTitleStyle}>{player?.title}</h1>
            <Collapsible orientation="horizontal" isVisible={!isIdle && hasArtist}>
              <div css={styles.musicHeaderArtistContainerStyle}>
                <span css={styles.musicHeaderArtistStyle(!isIdle && hasArtist)}>
                  {player?.artist}
                </span>
              </div>
            </Collapsible>
          </div>
          <Collapsible orientation="vertical" isVisible={isIdle && hasArtist}>
            <span css={styles.musicArtistStyle(isIdle && hasArtist)}>{player?.artist}</span>
          </Collapsible>
        </div>
      </div>
    </Collapsible>
  );
};
