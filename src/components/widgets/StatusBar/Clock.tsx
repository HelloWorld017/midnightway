import { format } from 'date-fns';
import { useMemo } from 'react';
import { useNow } from '@/hooks/useNow';
import * as styles from './Clock.css';

export const Clock = ({ isIdle }: { isIdle: boolean }) => {
  const now = useNow();
  const time = useMemo(() => format(now, 'HH:mm:ss'), [now]);
  const date = useMemo(() => format(now, 'MMM dd, EEE'), [now]);

  return (
    <div css={styles.clockStyle(isIdle)}>
      <span css={styles.clockTextStyle(true)}>{time}</span>
      <span css={styles.clockDividerStyle} />
      <span css={styles.clockTextStyle(false)}>{date}</span>
    </div>
  );
};
