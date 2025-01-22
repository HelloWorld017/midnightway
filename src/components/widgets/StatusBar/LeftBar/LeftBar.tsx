import * as commonStyles from '../StatusBar.css';
import { BarLauncher } from './BarLauncher';
import { BarMusicPlayer } from './BarMusicPlayer';
import { BarWeather } from './BarWeather';
import { BarWorkspace } from './BarWorkspace';
import type { ComponentProps } from 'react';

type LeftBarProps = { isIdle: boolean } & ComponentProps<typeof BarWorkspace> &
  ComponentProps<typeof BarMusicPlayer>;

export const LeftBar = (props: LeftBarProps) => (
  <div css={commonStyles.barStyle(props.isIdle)}>
    <BarLauncher />
    <BarWorkspace {...props} />
    <BarMusicPlayer {...props} />
    <BarWeather {...props} />
  </div>
);
