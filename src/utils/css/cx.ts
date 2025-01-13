import { derive } from 'astal';
import type { Variable } from 'astal';
import type { Binding, Subscribable } from 'astal/binding';

type ConnectableStyle<TProp extends Record<string, unknown>> =
  | string
  | ((prop: TProp) => ConnectableStyle<TProp>)
  | Partial<{ [K in keyof TProp]: ConnectableStyle<TProp> }>
  | ConnectableStyle<TProp>[];

type NormalizedStyle<TProp> = (((prop: TProp) => string[]) | string)[];
type NormalizedProp<TProp> = {
  [K in keyof TProp]: TProp[K] extends Subscribable<infer TBound>
    ? TBound
    : TProp[K];
};

type ConnectedStyle = string[] | Binding<string[]>;

const applyStyle = <TProp>(
  styles: NormalizedStyle<TProp>,
  prop: TProp
): string[] =>
  styles.flatMap(style => (typeof style === 'string' ? style : style(prop)));

const normalizeStyle = <TProp extends Record<string, unknown>>(
  style: ConnectableStyle<TProp>
): NormalizedStyle<TProp> => {
  if (Array.isArray(style)) {
    return style.flatMap(normalizeStyle);
  }

  if (typeof style === 'string') {
    return [style];
  }

  if (typeof style === 'function') {
    return [prop => applyStyle(normalizeStyle(style(prop)), prop)];
  }

  return [
    props =>
      applyStyle(
        (Object.entries(style) as [keyof TProp, ConnectableStyle<TProp>][])
          .filter(([condition]) => props[condition])
          .flatMap(([, style]) => normalizeStyle(style)),
        props
      ),
  ];
};

const isSubscribable = (value: unknown): value is Subscribable =>
  !!value &&
  (typeof value === 'object' || typeof value === 'function') &&
  'subscribe' in value &&
  typeof value.subscribe === 'function';

const normalizeProp = <TProp>(
  prop: TProp
): NormalizedProp<TProp> | Variable<NormalizedProp<TProp>> => {
  const entries = Object.entries(prop ?? {});
  const hasBinding = entries.some(([, value]) => isSubscribable(value));
  if (!hasBinding) {
    return prop as NormalizedProp<TProp>;
  }

  const bindings = entries
    .map(([, value]) => value)
    .filter(value => isSubscribable(value));

  const normalized = derive(bindings, () =>
    Object.fromEntries(
      entries.map(([key, value]) => [
        key,
        isSubscribable(value) ? value.get() : value,
      ])
    )
  );

  return normalized as Variable<NormalizedProp<TProp>>;
};

export const cx = <const TProp extends Record<string, unknown>>(
  prop: TProp,
  ...styles: ConnectableStyle<NormalizedProp<TProp>>[]
): ConnectedStyle => {
  const normalized = normalizeStyle(styles);
  const propNormalized = normalizeProp<TProp>(prop);
  if (typeof propNormalized === 'function') {
    return propNormalized(prop => applyStyle(normalized, prop));
  }

  return applyStyle(normalized, propNormalized);
};
