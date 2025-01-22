import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const statusBarStyle = (isIdle: boolean) => (theme: Theme) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;

  display: flex;
  justify-content: space-between;
  background: ${isIdle ? 'transparent' : theme.colors.glass.bgBase};
  padding: ${isIdle ? '0.5rem 1.5rem' : '0'};
  transition: ${transition(theme, ['background', 'padding'])};
`;

export const barStyle = (isIdle: boolean) => (theme: Theme) => css`
  position: relative;
  display: flex;
  align-items: center;
  gap: 2.4rem;

  border-radius: 1.5rem;
  padding: 0 1.8rem;
  min-height: 3.2rem;

  transition: ${transition(theme, ['background', 'padding', 'min-height'])};

  ${isIdle &&
  css`
    background: ${theme.colors.floating.bgBase};
    min-height: 4.8rem;
    padding: 0 2.4rem;
  `}
`;
