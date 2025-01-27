import { isObject } from '../type';
import type { Variable } from 'astal';
import type { Connectable, Subscribable } from 'astal/binding';

const isSubscribable = (value: unknown): value is Subscribable =>
  isObject(value) && 'subscribe' in value && typeof value.subscribe === 'function';

const isVariable = (value: unknown): value is Variable<unknown> =>
  isSubscribable(value) && 'set' in value && typeof value.set === 'function';

type RemoveSubscribable<T> = T extends Subscribable<infer TInner> ? TInner : T;

type ConnectablizedController<T extends object> = Pick<Connectable, 'connect' | 'disconnect'> & {
  set(key: keyof T, value: RemoveSubscribable<T[keyof T]>): void;
  refresh(key: keyof T): void;
};

type Connectablized<T extends object> = ConnectablizedController<T> & {
  readonly [K in keyof T]: RemoveSubscribable<T[K]>;
};

export const asConnectable = <const T extends object>(object: T): Simplify<Connectablized<T>> => {
  let id = 0;
  const cleanups = new Map<string, () => void>();
  const subscriptionById = new Map<number, [string, (value: unknown) => void]>();
  const subscriptions = new Map<string, Set<(value: unknown) => void>>();

  const controller: ConnectablizedController<T> = {
    connect(signal, onUpdate) {
      const key = signal.slice(8).replace(/-[a-z]/g, match => match[1].toUpperCase());
      const value: unknown = object[key as keyof T];
      if (!isSubscribable(value)) {
        return -1;
      }

      id++;
      subscriptionById.set(id, [key, onUpdate]);

      if (!subscriptions.get(key)?.add(onUpdate)) {
        subscriptions.set(key, new Set([onUpdate]));
        cleanups.set(
          key,
          value.subscribe(value => {
            subscriptions.get(key)?.forEach(callback => {
              callback(value);
            });
          })
        );
      }

      return id;
    },

    disconnect(id) {
      const subscription = subscriptionById.get(id);
      if (!subscription) {
        return;
      }

      const [key, onUpdate] = subscription;
      subscriptionById.delete(id);

      const subscriptionsOfKey = subscriptions.get(key);
      subscriptionsOfKey?.delete(onUpdate);

      if (!subscriptionsOfKey?.size) {
        cleanups.get(key)?.();
        cleanups.delete(key);
        subscriptions.delete(key);
      }
    },

    set(id, value) {
      if (isVariable(object[id])) {
        object[id].set(value);
      }
    },
  };

  return new Proxy<Connectablized<T>>(object as Connectablized<T>, {
    get(target, prop, receiver: unknown) {
      if (Object.hasOwn(controller, prop)) {
        return controller[prop as keyof ConnectablizedController<T>] as unknown;
      }

      const value = Reflect.get(target, prop, receiver) as unknown;
      if (isSubscribable(value)) {
        return value.get();
      }

      return value;
    },

    has(target, key) {
      return Reflect.has(target, key) || Reflect.has(controller, key);
    },
  });
};
