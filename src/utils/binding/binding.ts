import { bind, Variable } from 'astal';
import type { Connectable, Subscribable } from 'astal/binding';

export const bindHigher = <const TLower, TKey extends keyof TLower>(
  binding: Subscribable<TLower & Connectable>,
  prop: TKey
): Variable<TLower[TKey]> => {
  const derived = new Variable(binding.get()[prop]);

  let unsubscribeHigher: (() => void) | null = null;
  const unsubscribe = binding.subscribe(() => {
    unsubscribeHigher?.();
    derived.set(binding.get()[prop]);
    unsubscribeHigher = bind(binding.get(), prop).subscribe(nextValue =>
      derived.set(nextValue)
    );
  });

  derived.onDropped(() => {
    unsubscribeHigher?.();
    unsubscribe();
  });

  return derived;
};
