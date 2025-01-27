import { useCallback, useState } from 'react';
import type { RefCallback } from 'react';

export const useMeasure = () => {
  const [size, setSize] = useState<[number, number] | null>(null);
  const [observer] = useState(
    () =>
      new ResizeObserver(([state]) => {
        const size = state?.contentBoxSize[0];
        if (!size) {
          return;
        }

        setSize([size.inlineSize, size.blockSize]);
      })
  );

  const targetRef = useCallback<RefCallback<HTMLElement>>(child => {
    if (child) {
      observer.observe(child);
      return () => observer.unobserve(child);
    }
  }, []);

  return [targetRef, size] as const;
};
