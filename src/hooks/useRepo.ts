import { useCallback, useEffect, useState } from 'react';
import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { getRepositoryProxyDescriptor } from '@/utils/repositoryProxy';
import type { RepositoryInvocation, RepositoryProxy } from '@/utils/repositoryProxy';

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

export const useInvokeRepo = <T, TReturnValue>() => {
  const invokeRepo = useCallback(
    (invocation: RepositoryInvocation<T>, returnValue?: RepositoryProxy<TReturnValue, T>) =>
      bridgeRenderer.invoke({
        descriptor: getRepositoryProxyDescriptor(invocation),
        returnValue: returnValue ? getRepositoryProxyDescriptor(returnValue) : null,
      }),
    []
  );

  return invokeRepo;
};

registerImplementations({
  onUpdate({ id, value }) {
    subscriptions.get(id)?.(value);
  },
});
