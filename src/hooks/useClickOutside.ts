import { useRootProvider } from '@/components/common/RootProvider';
import { useEffect, useRef } from 'react';
import { useLatestCallback } from './useLatestCallback';

type UseClickOutsideParams = {
  isActive: boolean;
  onClickOutside: () => void;
};

export const useClickOutside = <T extends HTMLElement>({
  isActive,
  onClickOutside,
}: UseClickOutsideParams) => {
  const { window } = useRootProvider();
  const excludeRef = useRef<T | null>(null);
  const onClickOutsideLatest = useLatestCallback(onClickOutside);

  useEffect(() => {
    if (isActive) {
      const onHandle = (event: PointerEvent) => {
        if (event.target instanceof window.Node && excludeRef.current?.contains(event.target)) {
          return;
        }

        onClickOutsideLatest();
      };

      window.addEventListener('pointerdown', onHandle, { capture: true });
      return () => window.removeEventListener('pointerdown', onHandle, { capture: true });
    }

    return undefined;
  }, [window, isActive, onClickOutsideLatest]);

  return excludeRef;
};
