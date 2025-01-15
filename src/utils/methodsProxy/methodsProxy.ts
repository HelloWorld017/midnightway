export type MethodsProxy<T> = {
  [K in keyof T]: T[K] extends (params: infer TParams) => infer TReturn
    ? (params: TParams) => Promise<TReturn>
    : never;
};

export const createMethodsProxy = <T>(
  dispatcher: (name: string, params: unknown) => Promise<unknown>
) =>
  new Proxy<MethodsProxy<T>>({} as MethodsProxy<T>, {
    get(_target, key) {
      if (typeof key !== 'string') {
        throw new Error('Symbol keys are not supported in MethodsProxy');
      }

      return (params: unknown) => dispatcher(key, params);
    },
  });
