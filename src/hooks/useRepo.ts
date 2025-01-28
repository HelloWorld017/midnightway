import { useCallback, useEffect, useState } from 'react';
import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { getRepositoryProxyDescriptor } from '@/utils/repositoryProxy';
import type { RepositoryProxy } from '@/utils/repositoryProxy';

const subscriptions = new Map<string, (nextValue: unknown) => void>();

export const useRepo = <T>(repo: RepositoryProxy<T>, deps: unknown[] = []) => {
  const [value, setValue] = useState<T | null>(null);
  const descriptor = getRepositoryProxyDescriptor(repo);
  useEffect(() => {
    let id: string | null = null;
    void bridgeRenderer.subscribe({ descriptor }).then(result => {
      id = result.id;
      setValue(result.value as T);
      subscriptions.set(id, nextValue => {
        setValue(nextValue as T);
      });
    });

    return () => {
      if (id) {
        void bridgeRenderer.unsubscribe({ id });
        subscriptions.delete(id);
      }
    };
  }, deps);

  return value;
};

export const usePollRepo = <T>(repo: RepositoryProxy<T>, interval: number) => {
  const [value, setValue] = useState<T | null>(null);
  const descriptor = getRepositoryProxyDescriptor(repo);
  useEffect(() => {
    const onPoll = () => {
      bridgeRenderer
        .invoke({ descriptor, returning: true })
        .then(result => setValue(result as T))
        .catch(() => {});
    };

    onPoll();
    const intervalId = setInterval(onPoll, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return value;
};

export const useInvokeRepo = () => {
  const invokeRepo = useCallback(
    <T>(invocation: RepositoryProxy<T>, returning: boolean = false) =>
      bridgeRenderer.invoke({
        descriptor: getRepositoryProxyDescriptor(invocation),
        returning,
      }) as Promise<T | null>,
    []
  );

  return invokeRepo;
};

registerImplementations({
  onUpdate({ id, value }) {
    subscriptions.get(id)?.(value);
  },
});
