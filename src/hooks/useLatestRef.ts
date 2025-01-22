import { useRef } from 'react';

export const useLatestRef = <T>(value: T) => {
  const valueRef = useRef(value);
  valueRef.current = value;

  return valueRef;
};
