type AstalRef<T> = {
  (value: T): void;
  current: T;
};

export const ref = <T>(initialValue: T): AstalRef<T> => {
  let currentValue = initialValue;
  const ref = (nextValue: T) => {
    currentValue = nextValue;
  };

  return Object.defineProperty(ref as AstalRef<T>, 'current', {
    enumerable: true,
    get: () => currentValue,
    set: ref,
  });
};
