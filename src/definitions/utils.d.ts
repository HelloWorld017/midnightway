declare global {
  type Otherwise<T> = T & Record<never, never>;
  type Simplify<T> = { [K in keyof T]: T[K] } & {};
  type UnionToIntersection<U> = Simplify<
    (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never
  >;
}

export {};
