import { BarLauncher } from './BarLauncher';
import { BarWorkspace } from './BarWorkspace';
import * as styles from './LeftBar.css';
import type { ComponentProps } from 'react';

type LeftBarProps = { isIdle: boolean } & ComponentProps<typeof BarLauncher> &
  ComponentProps<typeof BarWorkspace>;

export const LeftBar = (props: LeftBarProps) => (
  <div css={styles.leftBarStyle(props.isIdle)}>
    <BarLauncher {...props} />
    <BarWorkspace {...props} />
  </div>
);
