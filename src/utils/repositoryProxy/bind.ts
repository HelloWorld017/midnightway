import { bind } from 'astal';
import { isObject } from '@/utils/type/isObject';
import { applyDescriptorItem } from './operations';
import { getRepositoryProxyDescriptor } from './repositoryProxy';
import type { RepositoryProxy, RepositoryProxyDescriptor } from './repositoryProxy';
import type { Connectable, Subscribable } from 'astal/binding';

const isConnectable = (value: unknown): value is Connectable =>
  isObject(value) && 'connect' in value && typeof value.connect === 'function';

export const bindRepositoryProxy = <T>(
  proxy: RepositoryProxy<T>,
  repositoryImpl: Record<string, unknown>
) => {
  const [, ...descriptor] = getRepositoryProxyDescriptor(proxy);
  const get = (): T =>
    descriptor.reduce<unknown>(
      (obj, descriptorItem) => applyDescriptorItem(obj, descriptorItem),
      repositoryImpl
    ) as never;

  const doBind = (
    obj: unknown,
    callback: () => void,
    [descriptorItem, ...next]: RepositoryProxyDescriptor
  ): (() => void) => {
    if (!descriptorItem) {
      return () => {};
    }

    const currentValue = applyDescriptorItem(obj, descriptorItem);
    if (typeof descriptorItem !== 'string' || !isConnectable(obj)) {
      return doBind(currentValue, callback, next);
    }

    let cleanupChild = doBind(currentValue, callback, next);
    const cleanupSelf = bind(obj, descriptorItem).subscribe((nextValue: unknown) => {
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
      doBind(repositoryImpl, () => callback(get()), descriptor),
  } satisfies Subscribable<T>;
};
