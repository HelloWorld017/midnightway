import { Accessor, createState } from 'ags';
import { readFileAsync } from 'ags/file';
import { createPoll } from 'ags/time';
import { isObject } from '../type';

export type Subscribable<T = unknown> = {
  get(): T;
  subscribe(callback: (value: T) => void): () => void;
};

export type Connectable = {
  connect(signal: string, callback: (...args: unknown[]) => void): number;
  disconnect(id: number): void;
};

type AstalRef<T> = {
  (value: T): void;
  current: T;
};

export const ref = <T>(initialValue: T): AstalRef<T> => {
  let currentValue = initialValue;
  const ref = (nextValue: T) => {
    currentValue = nextValue;
  };

  return Object.defineProperty(ref as AstalRef<T>, 'current', {
    enumerable: true,
    get: () => currentValue,
    set: ref,
  });
};

export const writable = <T>(initial: T): Accessor<T> & { set(value: T): void } => {
  const [value, setValue] = createState(initial);
  return Object.assign(value, { set: (next: T) => setValue(() => next) });
};

export const poll = <T>(initial: T, interval: number, update: (previous: T) => Promise<T>) =>
  createPoll(initial, interval, async previous => {
    try {
      return await update(previous);
    } catch (error) {
      console.error(error);
      return previous;
    }
  });

export const subscribeProperty = (object: Connectable, key: string, callback: () => void) => {
  const property = key
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase();
  const id = object.connect(`notify::${property}`, callback);
  return () => object.disconnect(id);
};

const isSubscribable = (value: unknown): value is Subscribable | Accessor<unknown> =>
  isObject(value) && 'subscribe' in value && typeof value.subscribe === 'function';

const isVariable = (value: unknown): value is { set(value: unknown): void } =>
  isSubscribable(value) && 'set' in value && typeof value.set === 'function';

type RemoveSubscribable<T> = T extends Accessor<infer TInner> | Subscribable<infer TInner>
  ? TInner
  : T;

type ConnectablizedController<T extends object> = Pick<Connectable, 'connect' | 'disconnect'> & {
  set(key: keyof T, value: RemoveSubscribable<T[keyof T]>): void;
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
          value.subscribe(() => {
            const current = value instanceof Accessor ? value.peek() : value.get();
            subscriptions.get(key)?.forEach(callback => {
              callback(current);
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
        return value instanceof Accessor ? value.peek() : value.get();
      }

      return value;
    },

    has(target, key) {
      return Reflect.has(target, key) || Reflect.has(controller, key);
    },
  });
};

export const bindFile = <T>(
  path: string | null,
  transform: (content: string) => T,
  interval: number
): Accessor<T | null> => {
  if (!path) {
    return writable<T | null>(null);
  }

  return poll<T | null>(null, interval, async previous =>
    readFileAsync(path)
      .then(transform)
      .catch(() => previous)
  );
};
