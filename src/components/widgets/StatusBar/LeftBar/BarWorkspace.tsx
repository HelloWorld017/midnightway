import { derive } from 'astal';
import { bindHigher } from '@/utils/binding';
import { cx } from '@/utils/css';
import * as styles from './BarWorkspace.css';
import type { Subscribable } from 'astal/binding';
import type Hyprland from 'gi://AstalHyprland';

type BarWorkspaceProps = {
  $monitor: Subscribable<Hyprland.Monitor>;
  $isIdle: Subscribable<boolean>;
};

export const BarWorkspace = ({ $monitor, $isIdle }: BarWorkspaceProps) => {
  const $workspace = bindHigher($monitor, 'activeWorkspace');
  const $workspaceId = $workspace(workspace => workspace.name);
  const $lastClient = bindHigher($workspace, 'lastClient');
  const $lastClientTitle = $lastClient(client => client.title || client.class);
  const $surface = derive([$isIdle], isIdle => (isIdle ? 'floating' : 'glass'));
  const context = { isIdle: $isIdle, surface: $surface };

  return (
    <box cssClasses={cx(context, styles.workspaceStyle)}>
      <box cssClasses={cx(context, styles.iconStyle)}>
        <label cssClasses={cx(context, styles.iconLabelStyle)}>
          {$workspaceId}
        </label>
      </box>
      <box>
        <label cssClasses={cx(context, styles.clientLabelStyle)}>
          {$lastClientTitle}
        </label>
      </box>
    </box>
  );
};
