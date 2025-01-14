import { bind } from 'astal';
import { getRepositoryProxyPath } from './repositoryProxy';
import type { RepositoryProxy } from './repositoryProxy';
import type { Connectable, Subscribable } from 'astal/binding';

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && (typeof value === 'object' || typeof value === 'function');

const isConnectable = (value: unknown): value is Connectable =>
  isObject(value) && 'connect' in value && typeof value.connect === 'function';

export const bindRepositoryProxy = <T>(
  proxy: RepositoryProxy<T>,
  repositoryImpl: Record<string, unknown>
) => {
  const path = getRepositoryProxyPath(proxy);
  const [, ...bindPath] = path.split('/');

  const get = (): T =>
    bindPath.reduce<unknown>(
      (obj, key) => (isObject(obj) ? obj[key] : undefined),
      repositoryImpl
    ) as never;

  const doBind = (obj: unknown, callback: () => void, [key, ...next]: string[]): (() => void) => {
    if (!key) {
      return () => {};
    }

    if (!isObject(obj)) {
      return () => {};
    }

    const currentValue = obj[key];
    if (!isConnectable(obj)) {
      return doBind(currentValue, callback, next);
    }

    let cleanupChild = doBind(currentValue, callback, next);
    const cleanupSelf = bind(obj, key).subscribe((nextValue: unknown) => {
      callback();
      cleanupChild?.();
      cleanupChild = doBind(nextValue, callback, next);
    });

    return () => {
      cleanupChild?.();
      cleanupSelf();
    };
  };

  return {
    get,
    subscribe: (callback: (value: T) => void) =>
      doBind(repositoryImpl, () => callback(get()), bindPath),
  } satisfies Subscribable<T>;
};
