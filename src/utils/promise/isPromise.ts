export const isPromise = <T>(value: T): value is T & Promise<Exclude<T, Promise<unknown>>> =>
  !!value && (typeof value === 'object' || typeof value === 'function') && 'then' in value;
