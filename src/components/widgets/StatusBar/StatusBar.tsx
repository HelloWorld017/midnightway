import { useMemo } from 'react';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';

type StatusBarProps = {
  monitorName: string;
};

export const StatusBar = ({ monitorName }: StatusBarProps) => {
  const focusedWorkspace = useRepo(repo.hyprland.focusedWorkspace, 'id');
  const focusedWorkspaceClients = useRepo(repo.hyprland.focusedWorkspace.clients, 'length');
  const monitors = useRepo(repo.hyprland.monitors);
  const monitor = useMemo(
    () => monitors?.find(({ name }) => name === monitorName),
    [monitors, monitorName]
  );

  const isIdle =
    monitor?.activeWorkspace.id !== focusedWorkspace?.id || !focusedWorkspaceClients?.length;

  return (
    <>
      {monitorName}
      {isIdle && 'Idle'}
      {focusedWorkspace?.id}
    </>
  );
};
