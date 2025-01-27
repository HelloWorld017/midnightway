import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (isActive) {
      const onHandle = (e: MouseEvent) => {
        if (excludeRef.current?.contains(e.currentTarget as HTMLElement)) {
          return;
        }

        e.preventDefault();
        onClickOutside();
      };

      targetWindow?.addEventListener('click', onHandle, { capture: true });
      return () => targetWindow?.removeEventListener('click', onHandle, { capture: true });
    }
  }, [targetWindow, isActive]);

  return excludeRef;
};
