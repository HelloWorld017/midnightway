import { bind } from 'astal/binding';
import type { Binding } from 'astal';
import type { Subscribable } from 'astal/binding';

type Selector = <T>(binding: Binding<T>) => T;

export const derive = <T>(deriveFn: (selector: Selector) => T): Binding<T> => {
  const subscriptions = new Set<(value: T) => void>();
  const dependencies = new Set<Binding<unknown>>();
  const cleanups = new Set<() => void>();

  const onCleanup = () => {
    cleanups.forEach(cleanup => cleanup());
    dependencies.clear();
  };

  const addDependency = (binding: Binding<unknown>) => {
    if (!dependencies.has(binding) && subscriptions.size > 0) {
      cleanups.add(binding.subscribe(onUpdate));
    }

    dependencies.add(binding);
  };

  const selector = <TSelecting>(binding: Binding<TSelecting>) => {
    addDependency(binding);
    return binding.get();
  };

  const onUpdate = () => {
    const nextValue = deriveFn(selector);
    subscriptions.forEach(callback => callback(nextValue));
  };

  const subscribable: Subscribable<T> = {
    get: () => deriveFn(selector),
    subscribe: (callback: (value: T) => void) => {
      subscriptions.add(callback);
      deriveFn(selector);

      return () => {
        subscriptions.delete(callback);
        if (subscriptions.size === 0) {
          onCleanup();
        }
      };
    },
  };

  return bind(subscribable);
};
