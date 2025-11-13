import { useState } from 'react';
import { useLatestCallback } from './useLatestCallback';

export const useRefMap = <TKey, TElement = HTMLElement>() => {
  const [refMap] = useState(() => new Map<TKey, TElement>());
  const refCallback = useLatestCallback((key: TKey) => (element: TElement) => {
    refMap.set(key, element);
    return () => {
      refMap.delete(key);
    };
  });

  return [refMap, refCallback] as const;
};
