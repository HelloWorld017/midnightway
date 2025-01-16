import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const rightBarStyle = (isIdle: boolean) => (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 2.4rem;

  padding: 0 2.4rem;
  min-height: 3.2rem;
  transition: all 0.4s ease;

  ${isIdle &&
  css`
    background: ${theme.colors.floating.bgBase};
    min-height: 4.8rem;
    padding: 0 2.4rem;
    border-radius: 1.5rem;
  `}
`;
