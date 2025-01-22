declare global {
  type Simplify<T> = { [K in keyof T]: T[K] } & {};
  type Otherwise<T> = T & Record<never, never>;
}

export {};
