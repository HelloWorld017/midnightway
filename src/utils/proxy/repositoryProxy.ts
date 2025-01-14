const SymbolProxyPath = Symbol.for('RepositoryProxy::path');

export type RepositoryProxy<T> = { [SymbolProxyPath]: string } & {
  [K in keyof T]: T[K] extends object ? RepositoryProxy<T[K]> : RepositoryProxy<never>;
};

export const createRepositoryProxy = <T>(path: string) =>
  new Proxy<RepositoryProxy<T>>({ [SymbolProxyPath]: path } as RepositoryProxy<T>, {
    get(_target, key) {
      if (key === SymbolProxyPath) {
        return path;
      }

      if (typeof key !== 'string') {
        throw new Error('Symbol keys are not supported in RendererProxy');
      }

      return createRepositoryProxy(`${path}/${key}`);
    },
  });

export const getRepositoryProxyPath = (proxy: RepositoryProxy<unknown>) => proxy[SymbolProxyPath];
