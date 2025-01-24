type AnyFunction = (...args: never[]) => unknown;

export const debounce = <F extends AnyFunction>(fn: F, delayInMs: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...params: Parameters<F>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => fn(...params), delayInMs);
  };
};
