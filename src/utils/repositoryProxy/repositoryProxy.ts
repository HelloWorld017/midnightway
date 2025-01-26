declare const SymbolType: unique symbol;
declare const SymbolRootType: unique symbol;
declare const SymbolInvokeType: unique symbol;
const SymbolProxyDescriptor = Symbol.for('RepositoryProxy::descriptor');

export type RepositoryProxyFilterPredicate = 'is';
export type RepositoryProxyFilter = {
  key: string;
  predicate: RepositoryProxyFilterPredicate;
  value: unknown;
};

export type RepositoryProxyMethods<T, TRoot = unknown> = {
  $pick: <TKey extends keyof T & string>(
    ...key: TKey[]
  ) => RepositoryProxySelectable<Pick<T, TKey>, TRoot>;
  $filter: (
    key: keyof (T & unknown[])[number] & string,
    predicate: RepositoryProxyFilterPredicate,
    value: unknown
  ) => RepositoryProxySelectable<T, TRoot>;
  $find: (
    key: keyof (T & unknown[])[number] & string,
    predicate: RepositoryProxyFilterPredicate,
    value: unknown
  ) => RepositoryProxySelectable<(T & unknown[])[number], TRoot>;
  $invoke: T extends (...args: infer TArgs) => infer TReturnValue
    ? (...args: TArgs) => RepositoryInvocation<TReturnValue, TRoot>
    : unknown;
};

export type RepositoryInvocation<T, TRoot = unknown> = Omit<
  RepositoryProxy<T, TRoot>,
  typeof SymbolType
> & {
  [SymbolInvokeType]?: T;
  returnValue: RepositoryProxySelectable<T, T>;
};

export type RepositoryProxy<T, TRoot = unknown> = {
  [SymbolType]?: T;
  [SymbolRootType]?: TRoot;
  [SymbolProxyDescriptor]: RepositoryProxyDescriptor;
  toString(): string;
};

export type RepositoryProxyDescriptor = RepositoryProxyDescriptorItem[];
export type RepositoryProxyDescriptorItem =
  | string
  | { pick: string[] }
  | { filter: RepositoryProxyFilter }
  | { find: RepositoryProxyFilter }
  | { invoke: unknown[] };

export type RepositoryProxyFinalized<T, TRoot = unknown> = RepositoryProxy<T, TRoot> & {
  [K in keyof RepositoryProxyMethods<T, TRoot>]: never;
};

export type RepositoryProxySelectable<T, TRoot = unknown> = RepositoryProxy<T, TRoot> &
  RepositoryProxyMethods<T, TRoot> &
  (T extends object
    ? { [K in keyof T & string]: RepositoryProxySelectable<T[K], TRoot> }
    : RepositoryProxyFinalized<T, TRoot>);

export const createRepositoryProxy = <T, TRoot = unknown>(descriptor: RepositoryProxyDescriptor) =>
  new Proxy<RepositoryProxySelectable<T, TRoot>>(
    {
      [SymbolProxyDescriptor]: descriptor,
      $pick: (...pick) => createRepositoryProxy([...descriptor, { pick }]),
      $filter: (key, predicate, value) =>
        createRepositoryProxy([...descriptor, { filter: { key, predicate, value } }]),
      $find: (key, predicate, value) =>
        createRepositoryProxy([...descriptor, { find: { key, predicate, value } }]),
      $invoke: (...invoke: unknown[]) =>
        ({
          [SymbolProxyDescriptor]: [...descriptor, { invoke }],
          returnValue: createRepositoryProxy([]),
        }) satisfies RepositoryInvocation<unknown, unknown>,
      toString: () =>
        descriptor.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join('/'),
    } as RepositoryProxySelectable<T, TRoot>,
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

export const getRepositoryProxyDescriptor = (proxy: {
  [SymbolProxyDescriptor]: RepositoryProxyDescriptor;
}) => proxy[SymbolProxyDescriptor];
