import { format } from 'date-fns';
import { useMemo, useRef } from 'react';
import { useNow } from '@/hooks/useNow';
import { locale } from '@/i18n';
import * as styles from './Clock.css';
import { useToolkit } from './Toolkit';

export const Clock = ({ isIdle }: { isIdle: boolean }) => {
  const now = useNow();
  const time = useMemo(() => format(now, 'HH:mm:ss', { locale: locale().date }), [now]);
  const date = useMemo(() => format(now, 'MMM do (EEE)', { locale: locale().date }), [now]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const toggleToolkit = useToolkit(state => state.toggleToolkit);
  const openCalendar = () => {
    const rect = buttonRef.current!.getBoundingClientRect();
    void toggleToolkit('calendar', { x: rect.x + rect.width / 2 });
  };

  return (
    <button css={styles.clockStyle(isIdle)} type="button" ref={buttonRef} onClick={openCalendar}>
      <span css={styles.clockTextStyle(true)}>{time}</span>
      <span css={styles.clockDividerStyle} />
      <span css={styles.clockTextStyle(false)}>{date}</span>
    </button>
  );
};
