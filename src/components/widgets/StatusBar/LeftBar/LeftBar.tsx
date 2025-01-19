import { BarLauncher } from './BarLauncher';
import { BarMusicPlayer } from './BarMusicPlayer';
import { BarWorkspace } from './BarWorkspace';
import * as styles from './LeftBar.css';
import type { ComponentProps } from 'react';

type LeftBarProps = { isIdle: boolean } & ComponentProps<typeof BarWorkspace> &
  ComponentProps<typeof BarMusicPlayer>;

export const LeftBar = (props: LeftBarProps) => (
  <div css={styles.leftBarStyle(props.isIdle)}>
    <BarLauncher />
    <BarWorkspace {...props} />
    <BarMusicPlayer {...props} />
  </div>
);
