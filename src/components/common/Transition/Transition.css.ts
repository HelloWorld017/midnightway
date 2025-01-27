import { css, keyframes } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

const enterKeyframe = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const defaultEnterStyle = (theme: Theme) => css`
  animation-name: ${enterKeyframe};
  animation-duration: ${theme.easings.opacity.duration}s;
  animation-timing-function: ${theme.easings.opacity.easing};
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

export const defaultLeaveStyle = (theme: Theme) => css`
  position: absolute;
  inset: 0;

  transition: ${transition(theme, ['opacity'])};
  opacity: 0;
`;
