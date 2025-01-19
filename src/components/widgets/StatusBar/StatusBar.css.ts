import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const statusBarStyle = (isIdle: boolean) => (theme: Theme) => css`
  position: relative;
  display: flex;
  justify-content: space-between;
  background: ${isIdle ? 'transparent' : theme.colors.glass.bgBase};
  padding: ${isIdle ? '0.5rem 1.5rem' : '0'};
  transition: all 0.4s ease;
`;
