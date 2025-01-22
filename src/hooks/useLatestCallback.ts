import { useCallback } from 'react';
import { useLatestRef } from './useLatestRef';

export const useLatestCallback = <T extends (...args: never[]) => unknown>(callback: T): T => {
  const callbackRef = useLatestRef(callback);
  return useCallback((...args: Parameters<T>) => callbackRef.current(...args), []) as T;
};
