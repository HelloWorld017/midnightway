import { IconPower } from '@/assets/icons';
import { useToolkitPopup } from '../hooks/useToolkitPopup';
import * as styles from './BarPower.css';

export const BarPower = () => {
  const onClick = useToolkitPopup('power-menu');
  return (
    <button type="button" aria-label="Power menu" onClick={onClick}>
      <IconPower css={styles.powerIconStyle} />
    </button>
  );
};
