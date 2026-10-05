import { createBinding } from 'ags';
import { throttle } from 'es-toolkit';
import GObject from 'gi://GObject';
import { isObject } from '@/utils/type';
import { applyDescriptor, applyDescriptorItem, bindDescriptorItem } from './operations';
import { getRepositoryProxyDescriptor } from './repositoryProxy';
import type { RepositoryProxy, RepositoryProxyDescriptor } from './repositoryProxy';
import type { Connectable, Subscribable } from '@/platform/reactivity';

const subscribeProperty = (object: Connectable, key: string, callback: () => void) => {
  if (object instanceof GObject.Object) {
    return createBinding(object, key as keyof GObject.Object).subscribe(callback);
  }

  const property = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  const id = object.connect(`notify::${property}`, callback);
  return () => object.disconnect(id);
};

const isConnectable = (value: unknown): value is Connectable =>
  isObject(value) && 'connect' in value && typeof value.connect === 'function';

export const bindRepositoryProxy = <T, TRoot = Record<string, unknown>>(
  proxy: RepositoryProxy<T, TRoot>,
  repositoryImpl: TRoot
) => {
  const [, ...descriptor] = getRepositoryProxyDescriptor(proxy);
  const get = () => applyDescriptor<T>(descriptor, repositoryImpl);

  const bindDescriptor = (
    obj: unknown,
    callback: () => void,
    [descriptorItem, ...next]: RepositoryProxyDescriptor
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
      (object, descriptor) => bindDescriptor(object, callback, descriptor)
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
