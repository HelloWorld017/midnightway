import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const containerStyle = css`
  position: absolute;
  top: 4rem;
  right: 1rem;
  width: min(30rem, calc(100vw - 2rem));
  max-height: calc(100vh - 5rem);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  z-index: 1;
`;

export const transitionStyle = css`
  overflow: hidden;
  transform-origin: top right;
`;

export const bubbleStyle = (theme: Theme) => css`
  padding-bottom: 0.8rem;
  overflow-wrap: anywhere;

  > div {
    background: ${theme.surface.bgBase};
    border: 1px solid ${theme.surface.fillLine};
  }
`;
