import { useTranslation } from 'react-i18next';
import { repo } from '@/bridge/repository';
import { useNow } from '@/hooks/useNow';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './ControlCenterHeader.css';

const useDuration = (startedAt?: number) => {
  const now = useNow();

  let duration = now - (startedAt ?? now);

  const hours = Math.floor(duration / (60 * 60 * 1000));
  duration -= hours * 60 * 60 * 1000;

  const minutes = Math.floor(duration / (60 * 1000));
  duration -= minutes * 60 * 1000;

  const seconds = Math.round(duration / 1000);
  return { hours, minutes, seconds };
};

export const ControlCenterHeader = () => {
  const { t } = useTranslation();
  const user = useRepo(repo.user.$pick('userName', 'sessionStartedAt'));
  const duration = useDuration(user?.sessionStartedAt);

  return (
    <header css={styles.headerStyle}>
      <div css={styles.headerContentStyle}>
        <h1 css={styles.headerTitleStyle}>{user?.userName}</h1>
        <span css={styles.headerDescriptionStyle}>
          {t('control-center.session-duration', duration)}
        </span>
      </div>
    </header>
  );
};
