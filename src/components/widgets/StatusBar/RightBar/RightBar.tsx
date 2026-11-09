import { RenderArea } from '@/components/common/RenderArea';
import * as commonStyles from '../index.css';
import { BarNotification } from './BarNotification';
import { BarPower } from './BarPower';
import { BarStatus } from './BarStatus';
import { BarTray } from './BarTray';

type RightBarProps = { isIdle: boolean };

export const RightBar = (props: RightBarProps) => (
  <RenderArea
    css={commonStyles.barStyle(props.isIdle)}
    input={props.isIdle}
    blur={false}
    radius="1.5rem"
  >
    <BarTray />
    <BarStatus />
    <BarNotification />
    <BarPower />
  </RenderArea>
);
