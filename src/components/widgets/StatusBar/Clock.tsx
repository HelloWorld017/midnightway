import { format } from 'date-fns';
import { useMemo } from 'react';
import { useNow } from '@/hooks/useNow';
import * as styles from './Clock.css';
import type { SurfaceKind } from '@/constants/theme';

export const Clock = ({ isIdle }: { isIdle: boolean }) => {
  const now = useNow();
  const time = useMemo(() => format(now, 'HH:mm:ss'), [now]);
  const date = useMemo(() => format(now, 'MMM dd, EEE'), [now]);
  const surface: SurfaceKind = isIdle ? 'floating' : 'glass';

  return (
    <div css={styles.clockStyle(isIdle)}>
      <span css={styles.clockTextStyle(surface, true)}>{time}</span>
      <span css={styles.clockDividerStyle(surface)} />
      <span css={styles.clockTextStyle(surface, false)}>{date}</span>
    </div>
  );
};
