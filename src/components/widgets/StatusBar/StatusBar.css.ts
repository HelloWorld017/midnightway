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
