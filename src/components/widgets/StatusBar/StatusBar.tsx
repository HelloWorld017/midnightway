import { useEffect, useMemo, useState } from 'react';
import { registerImplementations } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { config } from '@/config';
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

  const overlayItems = useRepo(repo.overlay.overlayItems);
  const isToolkitOpen = useMemo(
    () => !!overlayItems?.find(item => item.kind === 'toolkit'),
    [overlayItems]
  );

  const [isHidden, setIsHidden] = useState(config().bar.autohide);
  const isIdle = activeWorkspace?.id !== focusedWorkspaceId || !focusedWorkspaceClients;

  const surface: SurfaceKind = isIdle ? 'overlay' : 'glass';

  useEffect(
    () =>
      registerImplementations({
        onHiddenChange({ isHidden }) {
          setIsHidden(isHidden);
        },
      }),
    []
  );

  return (
    <>
      <SurfaceProvider surface={surface}>
        <div css={styles.statusBarStyle(isIdle, isHidden && !isIdle && !isToolkitOpen)}>
          <LeftBar activeWorkspace={activeWorkspace} isIdle={isIdle} />
          <Clock isIdle={isIdle} />
          <RightBar isIdle={isIdle} />
        </div>
      </SurfaceProvider>
    </>
  );
};
