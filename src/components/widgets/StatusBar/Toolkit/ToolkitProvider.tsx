import { useEffect, useState } from 'react';
import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { buildContext } from '@/utils/context/buildContext';
import type { ReactNode } from 'react';

type ToolkitPosition = { x: number; width: number };
const useToolkitContext = () => {
  const [toolkitKind, setToolkitKind] = useState<string | null>(null);
  const [toolkitWindow, setToolkitWindow] = useState<WindowProxy | null>(null);
  const [toolkitPosition, setToolkitPosition] = useState<ToolkitPosition>({ x: 0, width: 300 });
  const [toolkitElement, setToolkitElement] = useState<ReactNode | null>(null);
  const requestToolkitWindow = useLatestCallback(async () => {
    if (toolkitWindow !== null) {
      return toolkitWindow;
    }

    await bridgeRenderer.prepareOpenToolkit();
    setTimeout(() => {
      setToolkitWindow(window.open('about:blank', ''));
    }, 100);
  });

  const openToolkit = useLatestCallback(
    async (kind: string, element: ReactNode, position: ToolkitPosition) => {
      if (!toolkitWindow) {
        await requestToolkitWindow();
      }

      setToolkitKind(kind);
      setToolkitPosition(position);
      setToolkitElement(element);
    }
  );

  const closeToolkit = useLatestCallback(() => {
    setToolkitKind(null);
    setToolkitElement(null);
  });

  const toggleToolkit = useLatestCallback(
    (kind: string, element: ReactNode, position: ToolkitPosition) => {
      if (toolkitKind === kind) {
        return closeToolkit();
      }

      return openToolkit(kind, element, position);
    }
  );

  useEffect(() => {
    if (toolkitElement === null && toolkitWindow !== null) {
      const timeoutId = setTimeout(() => {
        void bridgeRenderer.closeToolkit();
        setToolkitWindow(null);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [toolkitElement, toolkitWindow]);

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
    toolkitWindow,
    toolkitElement,
    toolkitPosition,
    openToolkit,
    closeToolkit,
    toggleToolkit,
  };
};

export const [ToolkitProvider, useToolkit] = buildContext(useToolkitContext);
