import { useEffect, useState } from 'react';
import { registerImplementations } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { config } from '@/config';
import { useRepo } from '@/hooks/useRepo';
import { Clock } from './Clock';
import { LeftBar } from './LeftBar';
import { RightBar } from './RightBar/RightBar';
import * as styles from './StatusBar.css';
import { Toolkit, ToolkitProvider, useToolkit } from './Toolkit';
import type { SurfaceKind } from '@/constants/theme';

type StatusBarProps = {
  monitorName: string;
};

const StatusBarContents = ({ monitorName }: StatusBarProps) => {
  const focusedWorkspaceId = useRepo(repo.hyprland.focusedWorkspace.id);
  const focusedWorkspaceClients = useRepo(repo.hyprland.focusedWorkspace.clients.length);
  const activeWorkspace = useRepo(
    repo.hyprland.monitors.$find('name', 'is', monitorName).activeWorkspace.$pick('id', 'name'),
    [monitorName]
  );

  const [isHidden, setIsHidden] = useState(config().bar.autohide);
  const isToolkitOpen = useToolkit(state => !!state.toolkitKind);
  const isIdle = activeWorkspace?.id !== focusedWorkspaceId || !focusedWorkspaceClients;

  const surface: SurfaceKind = isIdle ? 'overlay' : 'glass';

  useEffect(
    () =>
      registerImplementations({
        onHiddenChange(isHidden) {
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
      <Toolkit />
    </>
  );
};

export const StatusBar = (props: StatusBarProps) => (
  <ToolkitProvider>
    <StatusBarContents {...props} />
  </ToolkitProvider>
);
