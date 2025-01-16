import { IconPower } from '@/assets/icons';
import * as styles from './BarPower.css';
import type { SurfaceKind } from '@/constants/theme';

export const BarPower = ({ isIdle }: { isIdle: boolean }) => {
  const surface: SurfaceKind = isIdle ? 'floating' : 'glass';
  return <IconPower css={styles.powerIconStyle(surface)} />;
};
