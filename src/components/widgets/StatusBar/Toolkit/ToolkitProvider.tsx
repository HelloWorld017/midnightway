import { useEffect, useRef, useState } from 'react';
import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { buildContext } from '@/utils/context/buildContext';

type ToolkitPosition = { x: number; anchor: 'left' | 'center' | 'right' };
export type ToolkitKind = 'control-center' | 'calendar' | 'notification' | 'performance';
const useToolkitContext = () => {
  const [toolkitKind, setToolkitKind] = useState<ToolkitKind | null>(null);
  const [toolkitWindow, setToolkitWindow] = useState<WindowProxy | null>(null);
  const [toolkitPosition, setToolkitPosition] = useState<ToolkitPosition>({ x: 0, anchor: 'left' });
  const toolkitInnerPortalRef = useRef<HTMLDivElement | null>(null);

  const requestToolkitWindow = useLatestCallback(async () => {
    if (toolkitWindow !== null) {
      return toolkitWindow;
    }

    await bridgeRenderer.prepareOpenToolkit();
    setTimeout(() => {
      setToolkitWindow(window.open('about:blank', ''));
    }, 100);
  });

  const openToolkit = useLatestCallback(async (kind: ToolkitKind, position: ToolkitPosition) => {
    if (!toolkitWindow) {
      await requestToolkitWindow();
    }

    setToolkitKind(kind);
    setToolkitPosition(position);
  });

  const closeToolkit = useLatestCallback(() => {
    setToolkitKind(null);
  });

  const toggleToolkit = useLatestCallback((kind: ToolkitKind, position: ToolkitPosition) => {
    if (toolkitKind === kind) {
      return closeToolkit();
    }

    return openToolkit(kind, position);
  });

  useEffect(() => {
    if (toolkitKind === null && toolkitWindow !== null) {
      void bridgeRenderer.closeToolkit();
      setToolkitWindow(null);
    }
  }, [toolkitKind, toolkitWindow]);

  useEffect(
    () =>
      registerImplementations({
        onToolkitCloseRequest() {
          closeToolkit();
        },
      }),
    []
  );

  return {
    toolkitKind,
    toolkitPosition,
    toolkitWindow,
    toolkitInnerPortalRef,
    openToolkit,
    closeToolkit,
    toggleToolkit,
    setToolkitKind,
  };
};

export const [ToolkitProvider, useToolkit] = buildContext(useToolkitContext);
