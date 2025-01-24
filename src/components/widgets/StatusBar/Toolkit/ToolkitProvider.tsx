import { useEffect, useState } from 'react';
import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { buildContext } from '@/utils/context/buildContext';

type ToolkitPosition = { x: number };
export type ToolkitKind = 'control-center' | 'calendar' | 'notification' | 'preference';
const useToolkitContext = () => {
  const [toolkitKind, setToolkitKind] = useState<ToolkitKind | null>(null);
  const [toolkitWindow, setToolkitWindow] = useState<WindowProxy | null>(null);
  const [toolkitPosition, setToolkitPosition] = useState<ToolkitPosition>({ x: 0 });

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
      const timeoutId = setTimeout(() => {
        void bridgeRenderer.closeToolkit();
        setToolkitWindow(null);
      }, 1000);

      return () => clearTimeout(timeoutId);
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
    openToolkit,
    closeToolkit,
    toggleToolkit,
  };
};

export const [ToolkitProvider, useToolkit] = buildContext(useToolkitContext);
