import { repo } from '@/bridge/repository';
import { useNow } from '@/hooks/useNow';
import { useRepo } from '@/hooks/useRepo';
import { defineI18n } from '@simplei18n/core';
import { useI18n } from '@simplei18n/core/react';
import * as styles from './ControlCenterHeader.css';

defineI18n(
  yaml => yaml`
  # scope: controlCenter
  sessionDuration: 'Session {hours}h {minutes}m {seconds}s'
`,
);

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
  const { t } = useI18n();
  const user = useRepo(repo.user.$pick('userName', 'sessionStartedAt'));
  const duration = useDuration(user?.sessionStartedAt);

  return (
    <header css={styles.headerStyle}>
      <div css={styles.headerContentStyle}>
        <h1 css={styles.headerTitleStyle}>{user?.userName}</h1>
        <span css={styles.headerDescriptionStyle}>
          {t(t.controlCenter.sessionDuration, duration)}
        </span>
      </div>
    </header>
  );
};
