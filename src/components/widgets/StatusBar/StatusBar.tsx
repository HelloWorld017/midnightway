import { registerImplementations } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { RenderArea } from '@/components/common/RenderArea';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { config } from '@/config';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRepo } from '@/hooks/useRepo';
import { useEffect, useMemo, useState } from 'react';
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
    [monitorName],
  );

  const overlayItems = useRepo(repo.overlay.overlayItems);
  const isToolkitOpen = useMemo(
    () => !!overlayItems?.find(item => item.kind === 'toolkit'),
    [overlayItems],
  );

  const [isHidden, setIsHidden] = useState(config().bar.autohide);
  const isIdle = activeWorkspace?.id !== focusedWorkspaceId || !focusedWorkspaceClients;
  const isIdleDebounced = useDebouncedValue(isIdle, { delay: 200 });

  const surface: SurfaceKind = isIdle ? 'overlay' : 'glass';
  const isBarHidden = isHidden && !isIdle && !isToolkitOpen;
  const isBarHiddenDebounced = useDebouncedValue(isBarHidden, { delay: 100 });

  useEffect(
    () =>
      registerImplementations({
        onHiddenChange({ isHidden: nextIsHidden }) {
          setIsHidden(nextIsHidden);
        },
      }),
    [],
  );

  return (
    <>
      <SurfaceProvider surface={surface}>
        {config().bar.autohide && (
          <RenderArea
            kind="input"
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 1 }}
          />
        )}
        <RenderArea
          css={styles.statusBarStyle(isIdle, isBarHidden)}
          kind={
            !isIdle && !isIdleDebounced && !(isBarHidden && isBarHiddenDebounced)
              ? 'default'
              : 'clip'
          }
        >
          <LeftBar activeWorkspace={activeWorkspace} isIdle={isIdle} />
          <Clock isIdle={isIdle} />
          <RightBar isIdle={isIdle} />
        </RenderArea>
      </SurfaceProvider>
    </>
  );
};
