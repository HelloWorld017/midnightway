import { bind, derive } from 'astal';
import { App, Astal } from 'astal/gtk4';
import Hyprland from 'gi://AstalHyprland';
import { bindHigher } from '@/utils/binding';
import { cx } from '@/utils/css';
import { LeftBar } from './LeftBar';
import * as styles from './StatusBar.css';
import type { Gdk } from 'astal/gtk4';

const { Exclusivity, WindowAnchor } = Astal;

type StatusBarProps = {
  monitor: Gdk.Monitor;
};

export const StatusBar = ({ monitor }: StatusBarProps) => {
  const hyprland = Hyprland.get_default();
  const $focusedWorkspace = bind(hyprland, 'focusedWorkspace');
  const $focusedWorkspaceClients = bindHigher($focusedWorkspace, 'clients');
  const $monitor = bind(hyprland, 'monitors').as(
    monitors => monitors.find(({ name }) => name === monitor.connector)!
  );

  const $isIdle = derive(
    [$monitor, $focusedWorkspace, $focusedWorkspaceClients],
    (monitor, focusedWorkspace, focusedWorkspaceClients) =>
      monitor.activeWorkspace.id !== focusedWorkspace.id ||
      focusedWorkspaceClients.length === 0
  );

  return (
    <window
      visible
      cssClasses={cx(
        { isIdle: $isIdle },
        { isIdle: styles.statusBarIdleStyle },
        styles.statusBarStyle
      )}
      gdkmonitor={monitor}
      exclusivity={Exclusivity.EXCLUSIVE}
      anchor={WindowAnchor.TOP | WindowAnchor.LEFT | WindowAnchor.RIGHT}
      application={App}
    >
      <centerbox>
        <LeftBar $monitor={$monitor} $isIdle={$isIdle} />
      </centerbox>
    </window>
  );
};
