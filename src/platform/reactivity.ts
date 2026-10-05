import { Accessor, createState } from 'ags';

export type WritableAccessor<T> = Accessor<T> & { set(value: T): void };

export interface Subscribable<T = unknown> {
  get(): T;
  subscribe(callback: (value: T) => void): () => void;
}

export interface Connectable {
  connect(signal: string, callback: (...args: unknown[]) => void): number;
  disconnect(id: number): void;
}

export const writable = <T>(initial: T): WritableAccessor<T> => {
  const [value, setValue] = createState(initial);
  return Object.assign(value, { set: (next: T) => setValue(() => next) });
};

export const subscribeValue = <T>(value: Accessor<T>, callback: (value: T) => void): (() => void) =>
  value.subscribe(() => callback(value.peek()));

export const readValue = <T>(value: Accessor<T> | Subscribable<T>): T =>
  value instanceof Accessor ? value.peek() : value.get();

export const subscribe = <T>(
  value: Accessor<T> | Subscribable<T>,
  callback: (value: T) => void
): (() => void) =>
  value instanceof Accessor ? subscribeValue(value, callback) : value.subscribe(callback);
