import { createContext, useContext, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';

const ToolkitPortalContext = createContext<RefObject<HTMLDivElement | null>>({ current: null });

type ToolkitPortalProviderProps = {
  className?: string;
  children: ReactNode;
};

export const ToolkitPortalProvider = ({ className, children }: ToolkitPortalProviderProps) => {
  const toolkitInnerPortalRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <ToolkitPortalContext.Provider value={toolkitInnerPortalRef}>
        {children}
      </ToolkitPortalContext.Provider>
      <div className={className} ref={toolkitInnerPortalRef} />
    </>
  );
};

export const useToolkitPortal = () => useContext(ToolkitPortalContext);
