import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const toolkitGlobalStyle = css`
  :root {
    font-size: 16px;
  }
`;

export const toolkitStyle = (theme: Theme) => css`
  position: absolute;
  top: 0;
  width: 32rem;
  height: 32rem;

  display: flex;
  gap: 1.6rem;
  padding: 1.6rem;
  border-radius: 2.4rem;
  background: ${theme.surface.bgBase};
  transition: ${transition(theme, ['left', 'width'])};
`;

export const asideStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  gap: 0.6rem;
  padding: 0.6rem;
  border-radius: 1.2rem;
  background: ${theme.surface.bgOverlay};
`;

export const asideItemStyle = (isActive: boolean) => (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${isActive ? theme.surface.fillHighlight : 'transparent'};
  color: ${isActive ? theme.surface.fillHighlightText : theme.surface.fillPrimary};
  font-size: 1.2rem;
  padding: 0.8rem;
  border-radius: 0.8rem;

  transition: ${transition(theme, ['background', 'color'])};
`;

export const contentStyle = css`
  flex: 1 1 0;
  overflow: auto;
`;
