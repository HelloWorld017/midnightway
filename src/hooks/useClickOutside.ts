import { useRootProvider } from '@/components/common/RootProvider';
import { useEffect, useRef } from 'react';
import { useLatestCallback } from './useLatestCallback';

type UseClickOutsideParams = {
  isActive: boolean;
  onClickOutside: () => void;
  targetWindow?: Window | null;
};

export const useClickOutside = <T extends HTMLElement>({
  isActive,
  onClickOutside,
  targetWindow,
}: UseClickOutsideParams) => {
  const { window } = useRootProvider();
  const resolvedWindow = targetWindow === undefined ? window : targetWindow;
  const excludeRef = useRef<T | null>(null);
  const onClickOutsideLatest = useLatestCallback(onClickOutside);

  useEffect(() => {
    if (isActive) {
      const onHandle = (e: MouseEvent) => {
        if (excludeRef.current?.contains(e.currentTarget as HTMLElement)) {
          return;
        }

        e.preventDefault();
        onClickOutsideLatest();
      };

      resolvedWindow?.addEventListener('click', onHandle, { capture: true });
      return () => resolvedWindow?.removeEventListener('click', onHandle, { capture: true });
    }

    return undefined;
  }, [resolvedWindow, isActive, onClickOutsideLatest]);

  return excludeRef;
};
