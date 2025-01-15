import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';

type StatusBarProps = {
  monitorName: string;
};

export const StatusBar = ({ monitorName }: StatusBarProps) => {
  const focusedWorkspaceId = useRepo(repo.hyprland.focusedWorkspace.id);
  const focusedWorkspaceClients = useRepo(repo.hyprland.focusedWorkspace.clients.length);
  const activeWorkspaceId = useRepo(
    repo.hyprland.monitors.$find('name', 'is', monitorName).activeWorkspace.id,
    [monitorName]
  );

  const isIdle = activeWorkspaceId !== focusedWorkspaceId || !focusedWorkspaceClients;
  return (
    <>
      {monitorName}
      {isIdle && 'Idle'}
      {focusedWorkspaceId}
    </>
  );
};
