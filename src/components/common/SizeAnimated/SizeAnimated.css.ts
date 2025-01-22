import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const sizeAnimatedStyle = (theme: Theme) => css`
  position: relative;
  overflow: hidden;
  transition: ${transition(theme, ['width', 'height'])};
`;

export const sizeAnimatedChildrenStyle = css`
  position: absolute;
  top: 0;
  left: 0;
`;
