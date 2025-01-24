import * as commonStyles from '../index.css';
import { BarNotification } from './BarNotification';
import { BarPower } from './BarPower';
import { BarStatus } from './BarStatus';
import { BarTray } from './BarTray';

type RightBarProps = { isIdle: boolean };

export const RightBar = (props: RightBarProps) => (
  <div css={commonStyles.barStyle(props.isIdle)}>
    <BarTray />
    <BarStatus />
    <BarNotification />
    <BarPower />
  </div>
);
