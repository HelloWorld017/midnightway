import { BarNotification } from './BarNotification';
import { BarPower } from './BarPower';
import * as styles from './RightBar.css';
import type { ComponentProps } from 'react';

type RightBarProps = { isIdle: boolean } & ComponentProps<typeof BarPower> &
  ComponentProps<typeof BarNotification>;

export const RightBar = (props: RightBarProps) => (
  <div css={styles.rightBarStyle(props.isIdle)}>
    <BarNotification {...props} />
    <BarPower {...props} />
  </div>
);
