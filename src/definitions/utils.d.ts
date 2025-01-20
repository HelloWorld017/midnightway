declare global {
  type Simplify<T> = { [K in keyof T]: T[K] } & {};
}

export {};
