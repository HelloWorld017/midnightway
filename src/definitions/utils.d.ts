declare global {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  type Any = any;
  type Otherwise<T> = T & Record<never, never>;
  type PossiblyPromise<T> = Promise<T> | T;
  type Simplify<T> = { [K in keyof T]: T[K] } & {};
  type UnionToIntersection<U> = Simplify<
    (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never
  >;
}

export {};
