import { createContext, useContext, useMemo } from 'react';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { useCreateSignal, useSignal } from '@/hooks/useSignal';
import type { Signal } from '@/hooks/useSignal';
import type { ReactNode } from 'react';

export const buildContext = <T,>(useContextValue: () => T) => {
  const Context = createContext<Signal<T>>(null as never);
  const Provider = ({ children }: { children: ReactNode }) => {
    const contextValue = useContextValue();
    const contextSignal = useCreateSignal(contextValue);
    return <Context value={contextSignal}>{children}</Context>;
  };

  Provider.displayName = `${useContextValue.name?.slice(4) ?? ''}Provider`;

  const useSelectedContext = <TSelected,>(selector: (value: T) => TSelected) => {
    const contextSignal = useContext(Context);
    const latestSelector = useLatestCallback(selector);
    const selectedSignal = useMemo<Signal<TSelected>>(
      () => ({
        get: () => latestSelector(contextSignal.get()),
        subscribe: onUpdate => contextSignal.subscribe(value => onUpdate(latestSelector(value))),
      }),
      [contextSignal, latestSelector]
    );

    return useSignal(selectedSignal);
  };

  return [Provider, useSelectedContext] as const;
};
