export const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && (typeof value === 'object' || typeof value === 'function');

export const isFiniteNumber = (value: unknown): value is number => Number.isFinite(value);
