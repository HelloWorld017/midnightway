import { useEffect, useState } from 'react';
import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { getRepositoryProxyPath } from '@/utils/proxy';
import type { RepositoryProxy } from '@/utils/proxy';

const subscriptions = new Map<string, (nextValue: unknown) => void>();

export const useRepo = <T, TKey extends keyof T & string>(
  repo: RepositoryProxy<T>,
  ...pick: TKey[]
) => {
  const path = getRepositoryProxyPath(repo);

  const [value, setValue] = useState<Pick<T, TKey> | null>(null);
  useEffect(() => {
    let id: string | null = null;
    void bridgeRenderer.subscribe({ path, pick: pick.length ? pick : null }).then(result => {
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
  }, [path]);

  return value;
};

registerImplementations({
  update({ id, value }) {
    subscriptions.get(id)?.(value);
  },
});
