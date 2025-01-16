import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const statusBarStyle = (isIdle: boolean) => (theme: Theme) => css`
  position: relative;
  display: flex;
  background: ${isIdle ? 'transparent' : theme.colors.glass.bgBase};
  padding: ${isIdle ? '5px 15px' : '0'};
  transition: all 0.4s ease;
`;
