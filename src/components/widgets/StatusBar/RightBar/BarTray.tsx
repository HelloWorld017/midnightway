import { IconStatusTray } from '@/assets/icons';
import { useToolkitPopup } from '../hooks/useToolkitPopup';
import * as styles from './BarTray.css';

export const BarTray = () => {
  const onClick = useToolkitPopup('tray');
  return (
    <button type="button" aria-label="System tray" onClick={onClick}>
      <IconStatusTray css={styles.trayIconStyle} />
    </button>
  );
};
