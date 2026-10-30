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
  targetWindow = window,
}: UseClickOutsideParams) => {
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

      targetWindow?.addEventListener('click', onHandle, { capture: true });
      return () => targetWindow?.removeEventListener('click', onHandle, { capture: true });
    }

    return undefined;
  }, [targetWindow, isActive, onClickOutsideLatest]);

  return excludeRef;
};
