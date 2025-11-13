import { useState } from 'react';
import { useLatestCallback } from './useLatestCallback';
import type { Ref, RefCallback } from 'react';

export const useMergedRef = <T>(...refs: Ref<T>[]): RefCallback<T> => {
  const [cleanups] = useState<Map<RefCallback<T>, () => void>>(() => new Map());

  const ref = useLatestCallback((value: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        const cleanup = ref(value);
        if (typeof cleanup === 'function') {
          cleanups.set(ref, cleanup);
        }
        return;
      }

      if (ref) {
        ref.current = value;
      }
    });

    return () => {
      refs.forEach(ref => {
        if (typeof ref === 'function') {
          const cleanup = cleanups.get(ref);
          if (cleanup) {
            cleanup();
            cleanups.delete(ref);
            return;
          }

          ref(null);
          return;
        }

        if (ref) {
          ref.current = null;
        }
      });
    };
  });

  return ref;
};
