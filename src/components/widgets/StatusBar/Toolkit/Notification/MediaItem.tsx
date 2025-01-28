import { debounce, throttle } from 'es-toolkit';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconFastForward,
  IconRewind,
  IconNotificationMusicPause,
  IconNotificationMusicPlay,
  IconAudioLines,
} from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { PlaybackStatus } from '@/constants/gir';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { useInvokeRepo } from '@/hooks/useRepo';
import * as styles from './MediaItem.css';
import type { BridgeRepository } from '@/bridge/types';

type MediaItemProps = {
  player: Pick<
    BridgeRepository['musicPlayer']['players'][number],
    | 'busName'
    | 'title'
    | 'artist'
    | 'position'
    | 'length'
    | 'playbackStatus'
    | 'artUrl'
    | 'coverArt'
    | 'canPlay'
    | 'canPause'
    | 'canGoNext'
    | 'canGoPrevious'
    | 'canSeek'
  >;
};

const useProgress = ({ player }: MediaItemProps) => {
  const invoke = useInvokeRepo();
  const canGetProgressUpdate = useRef(false);
  const [progressDraft, setProgressDraft] = useState<number | null>(null);
  useEffect(() => {
    if (canGetProgressUpdate.current) {
      setProgressDraft(null);
    }
  }, [player.position]);

  const onProgressChangeUpdate = useLatestCallback(async (title: string, position: number) => {
    canGetProgressUpdate.current = true;

    const currentPlayer = await invoke(
      repo.musicPlayer.players.$find('busName', 'is', player.busName).$pick('title', 'canSeek'),
      true
    );

    if (currentPlayer?.title !== title) {
      return;
    }

    await invoke(
      repo.musicPlayer.players
        .$find('busName', 'is', player.busName)
        .$invokeMethod('set_position', position)
    );
  });

  const onProgressChangeUpdateThrottled = useMemo(
    () => throttle(onProgressChangeUpdate, 500),
    [onProgressChangeUpdate]
  );

  const onProgressChange = useLatestCallback((value: number) => {
    canGetProgressUpdate.current = false;
    setProgressDraft(value);
    onProgressChangeUpdateThrottled(player.title, value);
  });

  return {
    progress: progressDraft ?? player.position,
    onProgressChange,
  };
};

export const MediaItem = ({ player }: MediaItemProps) => {
  const { progress, onProgressChange } = useProgress({ player });
  const invoke = useInvokeRepo();
  const [onClickPrevious, onClickNext, onClickPlayPause] = useMemo(
    () =>
      (['previous', 'next', 'play_pause'] as const).map(action =>
        debounce(() => {
          invoke(
            repo.musicPlayer.players.$find('busName', 'is', player.busName).$invokeMethod(action)
          ).catch(() => {});
        }, 750)
      ),
    [player.busName]
  );

  return (
    <div css={styles.containerStyle} style={{ '--cover-art': `url("${player.artUrl}")` }}>
      <div css={styles.bodyStyle}>
        <div css={styles.contentsStyle}>
          <IconAudioLines css={styles.iconStyle} />
          <div css={styles.textContentsStyle}>
            <h2 css={styles.titleStyle}>{player.title}</h2>
            <span css={styles.artistStyle}>{player.artist}</span>
          </div>
        </div>
        <button css={styles.playPauseStyle} type="button" onClick={onClickPlayPause}>
          {(player.playbackStatus as PlaybackStatus) === PlaybackStatus.PLAYING ? (
            <IconNotificationMusicPause />
          ) : (
            <IconNotificationMusicPlay />
          )}
        </button>
      </div>
      <div css={styles.controllerStyle}>
        {player.canSeek && (
          <input
            css={styles.inputStyle}
            type="range"
            min={0}
            max={player.length}
            value={progress}
            onChange={e => onProgressChange(e.currentTarget.valueAsNumber)}
          />
        )}
        <button
          css={styles.prevNextIconStyle(player.canGoPrevious)}
          type="button"
          onClick={onClickPrevious}
        >
          <IconRewind />
        </button>
        <button
          css={styles.prevNextIconStyle(player.canGoNext)}
          type="button"
          onClick={onClickNext}
        >
          <IconFastForward />
        </button>
      </div>
    </div>
  );
};
