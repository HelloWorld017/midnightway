import { useEffect, useState } from 'react';

export const useNow = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const onTimeout = () => {
      const updatedNow = Date.now();
      setNow(updatedNow);

      const timeToNextSecond = Math.floor(updatedNow / 1000) * 1000 + 1000 - updatedNow;
      timeoutId = setTimeout(onTimeout, Math.min(timeToNextSecond, 500));
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
