import { BarNotification } from './BarNotification';
import { BarPower } from './BarPower';
import { BarStatus } from './BarStatus';
import { BarTray } from './BarTray';
import * as styles from './RightBar.css';

type RightBarProps = { isIdle: boolean };

export const RightBar = (props: RightBarProps) => (
  <div css={styles.rightBarStyle(props.isIdle)}>
    <BarTray />
    <BarStatus />
    <BarNotification />
    <BarPower />
  </div>
);
