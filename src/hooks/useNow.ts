import { useEffect, useState } from 'react';

export const useNow = (boundary = 1000) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const onTimeout = () => {
      const updatedNow = Date.now();
      setNow(updatedNow);

      const timeToNextBoundary =
        Math.floor(updatedNow / boundary) * boundary + boundary - updatedNow;

      timeoutId = setTimeout(onTimeout, Math.min(timeToNextBoundary, 500));
    };

    onTimeout();
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return now;
};
