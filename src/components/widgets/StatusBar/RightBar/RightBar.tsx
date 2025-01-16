import { BarPower } from './BarPower';
import * as styles from './RightBar.css';
import type { ComponentProps } from 'react';

type RightBarProps = { isIdle: boolean } & ComponentProps<typeof BarPower>;

export const RightBar = (props: RightBarProps) => (
  <div css={styles.rightBarStyle(props.isIdle)}>
    <BarPower {...props} />
  </div>
);
