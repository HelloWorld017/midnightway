import { format } from 'date-fns';
import { useMemo, useRef } from 'react';
import { useNow } from '@/hooks/useNow';
import * as styles from './Clock.css';
import { useToolkit } from './Toolkit';
import { Calendar } from './Toolkit/Calendar';

export const Clock = ({ isIdle }: { isIdle: boolean }) => {
  const now = useNow();
  const time = useMemo(() => format(now, 'HH:mm:ss'), [now]);
  const date = useMemo(() => format(now, 'MMM dd, EEE'), [now]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const toggleToolkit = useToolkit(state => state.toggleToolkit);
  const openCalendar = () => {
    const rect = buttonRef.current!.getBoundingClientRect();
    void toggleToolkit('calendar', <Calendar />, { x: rect.x + rect.width / 2 - 150, width: 300 });
  };

  return (
    <button css={styles.clockStyle(isIdle)} type="button" ref={buttonRef} onClick={openCalendar}>
      <span css={styles.clockTextStyle(true)}>{time}</span>
      <span css={styles.clockDividerStyle} />
      <span css={styles.clockTextStyle(false)}>{date}</span>
    </button>
  );
};
