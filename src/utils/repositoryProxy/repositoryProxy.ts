declare const SymbolType: unique symbol;
const SymbolProxyDescriptor = Symbol.for('RepositoryProxy::descriptor');

export type RepositoryProxyFilterPredicate = 'is';
export type RepositoryProxyFilter = {
  key: string;
  predicate: RepositoryProxyFilterPredicate;
  value: unknown;
};

export type RepositoryProxyMethods<T> = {
  $pick: (...key: (keyof T & string)[]) => RepositoryProxySelectable<T>;
  $filter: (
    key: keyof (T & unknown[])[number] & string,
    predicate: RepositoryProxyFilterPredicate,
    value: unknown
  ) => RepositoryProxySelectable<T>;
  $find: (
    key: keyof (T & unknown[])[number] & string,
    predicate: RepositoryProxyFilterPredicate,
    value: unknown
  ) => RepositoryProxySelectable<(T & unknown[])[number]>;
};

export type RepositoryProxy<T> = {
  [SymbolType]?: T;
  [SymbolProxyDescriptor]: RepositoryProxyDescriptor;
  toString(): string;
};

export type RepositoryProxyDescriptor = RepositoryProxyDescriptorItem[];
export type RepositoryProxyDescriptorItem =
  | string
  | { pick: string[] }
  | { filter: RepositoryProxyFilter }
  | { find: RepositoryProxyFilter };

export type RepositoryProxyFinalized<T> = RepositoryProxy<T> & {
  [K in keyof RepositoryProxyMethods<T>]: never;
};

export type RepositoryProxySelectable<T> = RepositoryProxy<T> &
  RepositoryProxyMethods<T> &
  (T extends object
    ? { [K in keyof T & string]: RepositoryProxySelectable<T[K]> }
    : RepositoryProxyFinalized<T>);

export const createRepositoryProxy = <T>(descriptor: RepositoryProxyDescriptor) =>
  new Proxy<RepositoryProxySelectable<T>>(
    {
      [SymbolProxyDescriptor]: descriptor,
      $pick: (...pick) => createRepositoryProxy([...descriptor, { pick }]),
      $filter: (key, predicate, value) =>
        createRepositoryProxy([...descriptor, { filter: { key, predicate, value } }]),
      $find: (key, predicate, value) =>
        createRepositoryProxy([...descriptor, { find: { key, predicate, value } }]),
      toString: () =>
        descriptor.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join('/'),
    } as RepositoryProxySelectable<T>,
    {
      get(target, key, receiver) {
        if (key in target) {
          return Reflect.get(target, key, receiver);
        }

        if (typeof key !== 'string') {
          return undefined;
        }

        return createRepositoryProxy([...descriptor, key]);
      },
    }
  );

export const getRepositoryProxyDescriptor = (proxy: RepositoryProxy<unknown>) =>
  proxy[SymbolProxyDescriptor];
