import { bind } from 'astal';
import { throttle } from 'es-toolkit';
import { repositoryImpl } from '@/repository';
import { isObject } from '@/utils/type';
import { applyDescriptorItem, bindDescriptorItem } from './operations';
import { getRepositoryProxyDescriptor } from './repositoryProxy';
import type { RepositoryProxy, RepositoryProxyDescriptor } from './repositoryProxy';
import type { Connectable, Subscribable } from 'astal/binding';

const isConnectable = (value: unknown): value is Connectable =>
  isObject(value) && 'connect' in value && typeof value.connect === 'function';

export const applyDescriptor = <T>(
  descriptor: RepositoryProxyDescriptor,
  repository: unknown = repositoryImpl
) =>
  descriptor.reduce<unknown>(
    (obj, descriptorItem) => applyDescriptorItem(obj, descriptorItem),
    repository
  ) as T;

export const bindRepositoryProxy = <T, TRoot = Record<string, unknown>>(
  proxy: RepositoryProxy<T, TRoot>,
  repositoryImpl: TRoot
) => {
  const [, ...descriptor] = getRepositoryProxyDescriptor(proxy);
  const get = () => applyDescriptor<T>(descriptor, repositoryImpl);

  const doBind = (
    obj: unknown,
    callback: () => void,
    [descriptorItem, ...next]: RepositoryProxyDescriptor
  ): (() => void) => {
    if (!descriptorItem) {
      return () => {};
    }

    let cleanupChild = doBind(applyDescriptorItem(obj, descriptorItem), callback, next);
    const cleanupSelf = bindDescriptorItem(obj, descriptorItem, (object, key) => {
      if (!isConnectable(object)) {
        return () => {};
      }

      return bind(object, key).subscribe(() => {
        callback();
        cleanupChild?.();
        cleanupChild = doBind(applyDescriptorItem(obj, descriptorItem), callback, next);
      });
    });

    return () => {
      cleanupChild?.();
      cleanupSelf();
    };
  };

  return {
    get,
    subscribe: (callback: (value: T) => void) =>
      doBind(
        repositoryImpl,
        throttle(() => callback(get()), 100, { edges: ['trailing'] }),
        descriptor
      ),
  } satisfies Subscribable<T>;
};
