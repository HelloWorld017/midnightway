import { cx } from '@/utils/css';
import { BarWorkspace } from './BarWorkspace';
import * as styles from './LeftBar.css';
import type { Subscribable } from 'astal/binding';
import type Hyprland from 'gi://AstalHyprland';

type LeftBarProps = {
  $monitor: Subscribable<Hyprland.Monitor>;
  $isIdle: Subscribable<boolean>;
};

export const LeftBar = ({ $monitor, $isIdle }: LeftBarProps) => {
  const context = { isIdle: $isIdle };

  return (
    <box
      cssClasses={cx(context, [
        styles.leftBarStyle,
        { isIdle: styles.leftBarIdleStyle },
      ])}
    >
      <box>
        <BarWorkspace $monitor={$monitor} $isIdle={$isIdle} />
      </box>
    </box>
  );
};
