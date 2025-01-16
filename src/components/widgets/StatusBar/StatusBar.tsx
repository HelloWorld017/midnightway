import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import { Clock } from './Clock';
import { LeftBar } from './LeftBar';
import * as styles from './StatusBar.css';

type StatusBarProps = {
  monitorName: string;
};

export const StatusBar = ({ monitorName }: StatusBarProps) => {
  const focusedWorkspaceId = useRepo(repo.hyprland.focusedWorkspace.id);
  const focusedWorkspaceClients = useRepo(repo.hyprland.focusedWorkspace.clients.length);
  const activeWorkspace = useRepo(
    repo.hyprland.monitors.$find('name', 'is', monitorName).activeWorkspace.$pick('id', 'name'),
    [monitorName]
  );

  const isIdle = activeWorkspace?.id !== focusedWorkspaceId || !focusedWorkspaceClients;

  return (
    <div css={styles.statusBarStyle(isIdle)}>
      <LeftBar activeWorkspace={activeWorkspace} isIdle={isIdle} />
      <Clock isIdle={isIdle} />
    </div>
  );
};
