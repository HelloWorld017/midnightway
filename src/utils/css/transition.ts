import { DEFAULT_EASING, SNAPPY_EASING } from '@/constants/theme';
import { match } from 'ts-pattern';
import type { Theme } from '@emotion/react';
import type CSS from 'csstype';

const TRANSITION_KEY = {
  'visibility': 'opacity',
  'opacity': 'opacity',
  'left': 'size',
  'top': 'size',
  'width': 'size',
  'height': 'size',
  'padding': 'size',
  'margin': 'size',
  'min-height': 'size',
  'transform': 'size',
  'grid-template-rows': 'size',
  'grid-template-columns': 'size',
  'flex-basis': 'size',
  'gap': 'size',
  'background': 'background',
  'color': 'color',
  'border-color': 'color',
  'border-radius': 'size',
} satisfies Partial<Record<keyof CSS.PropertiesHyphen, keyof Theme['easings']>>;

type TransitionOptions = {
  multiplier: number;
  easing?: 'default' | 'snappy';
  delay: number | number[];
};

type TransitionBuilder = {
  (theme: Theme, keys: (keyof typeof TRANSITION_KEY)[]): string;
  multiplier: (value: number) => TransitionBuilder;
  easing: (value: NonNullable<TransitionOptions['easing']>) => TransitionBuilder;
  delay: (value: TransitionOptions['delay']) => TransitionBuilder;
};

const createTransition = (options: TransitionOptions): TransitionBuilder =>
  Object.assign(
    (theme: Theme, keys: (keyof typeof TRANSITION_KEY)[]) =>
      keys
        .map((key, index) => {
          const { duration, easing } = theme.easings[TRANSITION_KEY[key]];
          const delay =
            typeof options.delay === 'number' ? options.delay : (options.delay[index] ?? 0);

          const curve = match(options.easing)
            .with('snappy', () => SNAPPY_EASING)
            .with('default', () => DEFAULT_EASING)
            .otherwise(() => easing);

          return `${key} ${duration * options.multiplier}s ${curve} ${delay}s`;
        })
        .join(', '),
    {
      multiplier: (multiplier: number) => createTransition({ ...options, multiplier }),
      easing: (easing: NonNullable<TransitionOptions['easing']>) =>
        createTransition({ ...options, easing }),
      delay: (delay: TransitionOptions['delay']) => createTransition({ ...options, delay }),
    },
  );

export const transition = createTransition({ multiplier: 1, delay: 0 });
