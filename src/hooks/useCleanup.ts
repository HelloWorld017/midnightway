import { useEffect } from 'react';
import { useLatestRef } from './useLatestRef';

export const useCleanup = (callback: () => void) => {
  const latestCallbackRef = useLatestRef(callback);
  useEffect(
    () => () => {
      latestCallbackRef.current();
    },
    []
  );
};
