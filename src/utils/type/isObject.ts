export const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && (typeof value === 'object' || typeof value === 'function');
