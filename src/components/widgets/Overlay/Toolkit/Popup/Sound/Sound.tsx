import { IconVolume2, IconVolumeX } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useInvokeRepo, useRepo } from '@/hooks/useRepo';
import { z } from 'zod';
import { ControlCenterItem } from '../../ControlCenter/ControlCenterItem';
import { MediaSection } from '../../Notification/Notification';
import * as styles from '../popup.css';

const volumeItem = {
  id: z.string().brand('Id').parse('popup-volume'),
  kind: 'volume-slider',
} as const;

export const Sound = () => {
  const muted = useRepo(repo.sound.defaultSpeaker.mute);
  const invoke = useInvokeRepo();
  return (
    <div css={styles.popupStyle('30rem')}>
      <MediaSection />
      <div css={styles.soundControlsStyle}>
        <button
          css={styles.soundMuteStyle}
          type="button"
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={() => void invoke(repo.sound.defaultSpeaker.$invokeMethod('set_mute', !muted))}
        >
          {muted ? <IconVolumeX /> : <IconVolume2 />}
        </button>
        <ControlCenterItem item={volumeItem} />
      </div>
    </div>
  );
};
