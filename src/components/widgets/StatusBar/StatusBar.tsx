import { repo } from '@/bridge/repository';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { useRepo } from '@/hooks/useRepo';
import { Clock } from './Clock';
import { LeftBar } from './LeftBar';
import { RightBar } from './RightBar/RightBar';
import * as styles from './StatusBar.css';
import type { SurfaceKind } from '@/constants/theme';

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
  const surface: SurfaceKind = isIdle ? 'floating' : 'glass';

  return (
    <SurfaceProvider surface={surface}>
      <div css={styles.statusBarStyle(isIdle)}>
        <LeftBar activeWorkspace={activeWorkspace} isIdle={isIdle} />
        <Clock isIdle={isIdle} />
        <RightBar isIdle={isIdle} />
      </div>
    </SurfaceProvider>
  );
};
