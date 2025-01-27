import type { Theme } from '@emotion/react';
import type CSS from 'csstype';

const TRANSITION_KEY = {
  'visibility': 'opacity',
  'opacity': 'opacity',
  'left': 'size',
  'width': 'size',
  'height': 'size',
  'padding': 'size',
  'margin': 'size',
  'min-height': 'size',
  'transform': 'size',
  'grid-template-rows': 'size',
  'grid-template-columns': 'size',
  'flex-basis': 'size',
  'background': 'background',
  'color': 'color',
  'border-color': 'color',
} satisfies Partial<Record<keyof CSS.PropertiesHyphen, keyof Theme['easings']>>;

export const transition = (
  theme: Theme,
  keys: (keyof typeof TRANSITION_KEY)[],
  delaySeconds: number | number[] = 0
) =>
  keys
    .map((key, index) =>
      [
        key,
        `${theme.easings[TRANSITION_KEY[key]].duration}s`,
        theme.easings[TRANSITION_KEY[key]].easing,
        typeof delaySeconds === 'number' ? `${delaySeconds}s` : `${delaySeconds[index] ?? 0}`,
      ].join(' ')
    )
    .join(', ');
