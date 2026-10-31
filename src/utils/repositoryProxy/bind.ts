import { subscribeProperty } from '@/utils/binding';
import { isObject } from '@/utils/type';
import { throttle } from 'es-toolkit';
import { applyDescriptor, applyDescriptorItem, bindDescriptorItem } from './operations';
import { getRepositoryProxyDescriptor } from './repositoryProxy';
import type { RepositoryProxy, RepositoryProxyDescriptor } from './repositoryProxy';
import type { Connectable, Subscribable } from '@/utils/binding';

const isConnectable = (value: unknown): value is Connectable =>
  isObject(value) && 'connect' in value && typeof value.connect === 'function';

export const bindRepositoryProxy = <T, TRoot = Record<string, unknown>>(
  proxy: RepositoryProxy<T, TRoot>,
  repositoryImpl: TRoot,
) => {
  const [, ...descriptor] = getRepositoryProxyDescriptor(proxy);
  const get = () => applyDescriptor<T>(descriptor, repositoryImpl);

  const bindDescriptor = (
    obj: unknown,
    callback: () => void,
    [descriptorItem, ...next]: RepositoryProxyDescriptor,
  ): (() => void) => {
    if (!descriptorItem) {
      return () => {};
    }

    let cleanupChild = bindDescriptor(applyDescriptorItem(obj, descriptorItem), callback, next);
    const cleanupSelf = bindDescriptorItem(
      obj,
      descriptorItem,
      (object, key) => {
        if (!isConnectable(object)) {
          return () => {};
        }

        return subscribeProperty(object, key, () => {
          callback();
          cleanupChild?.();
          cleanupChild = bindDescriptor(applyDescriptorItem(obj, descriptorItem), callback, next);
        });
      },
      (object, descriptor) => bindDescriptor(object, callback, descriptor),
    );

    return () => {
      cleanupChild?.();
      cleanupSelf();
    };
  };

  return {
    get,
    subscribe: (callback: (value: T) => void) => {
      const update = throttle(() => callback(get()), 100, { edges: ['trailing'] });
      const cleanup = bindDescriptor(repositoryImpl, update, descriptor);
      return () => {
        cleanup();
        update.cancel();
      };
    },
  } satisfies Subscribable<T>;
};
