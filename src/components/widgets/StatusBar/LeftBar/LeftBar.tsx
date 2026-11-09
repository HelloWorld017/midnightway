import { RenderArea } from '@/components/common/RenderArea';
import * as commonStyles from '../index.css';
import { BarLauncher } from './BarLauncher';
import { BarMusicPlayer } from './BarMusicPlayer';
import { BarWeather } from './BarWeather';
import { BarWorkspace } from './BarWorkspace';
import type { ComponentProps } from 'react';

type LeftBarProps = { isIdle: boolean } & ComponentProps<typeof BarWorkspace> &
  ComponentProps<typeof BarMusicPlayer>;

export const LeftBar = (props: LeftBarProps) => (
  <RenderArea
    css={commonStyles.barStyle(props.isIdle)}
    input={props.isIdle}
    blur={false}
    radius="1.5rem"
  >
    <BarLauncher />
    <BarWorkspace {...props} />
    <BarMusicPlayer {...props} />
    <BarWeather {...props} />
  </RenderArea>
);
