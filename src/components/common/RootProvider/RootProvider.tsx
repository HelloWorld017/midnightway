import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

type RootContextValue = {
  window: Window & typeof globalThis;
  document: Document;
};

const RootContext = createContext<RootContextValue | null>(null);

type RootProviderProps = {
  window: Window;
  children: ReactNode;
};

export const RootProvider = ({ window, children }: RootProviderProps) => {
  const value = useMemo<RootContextValue>(
    () => ({ window: window as Window & typeof globalThis, document: window.document }),
    [window],
  );

  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    window.addEventListener('contextmenu', onContextMenu, true);
    return () => window.removeEventListener('contextmenu', onContextMenu, true);
  }, [window]);

  return <RootContext value={value}>{children}</RootContext>;
};

export const useRootProvider = () => {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useRootProvider must be used within RootProvider');
  }

  return context;
};
