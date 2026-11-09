import { RenderArea } from '@/components/common/RenderArea';
import { useNow } from '@/hooks/useNow';
import { locale } from '@/i18n';
import { format } from 'date-fns';
import { useMemo } from 'react';
import * as styles from './Clock.css';
import { useToolkitPopup } from './hooks/useToolkitPopup';

export const Clock = ({ isIdle }: { isIdle: boolean }) => {
  const now = useNow();
  const time = useMemo(() => format(now, 'HH:mm:ss', { locale: locale().date }), [now]);
  const date = useMemo(() => format(now, 'MMM do (EEE)', { locale: locale().date }), [now]);

  const openCalendar = useToolkitPopup('main');

  return (
    <RenderArea css={styles.clockStyle(isIdle)} kind={isIdle ? 'input' : 'clip'}>
      <button css={styles.clockButtonStyle} type="button" onClick={openCalendar}>
        <span css={styles.clockTextStyle(true)}>{time}</span>
        <span css={styles.clockDividerStyle} />
        <span css={styles.clockTextStyle(false)}>{date}</span>
      </button>
    </RenderArea>
  );
};
