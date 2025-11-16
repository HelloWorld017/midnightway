import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const containerStyle = (theme: Theme) => css`
  position: absolute;
  bottom: 6.4rem;
  right: 2.2rem;

  display: flex;
  flex-direction: column-reverse;
  gap: 0.02rem;
  padding: 1rem;
  min-width: 22rem;

  background: ${theme.surface.bgOverlay};
  border-radius: 1.6rem;
  border: 1px solid ${theme.surface.fillLine};
`;

export const itemStyle = (theme: Theme) => css`
  cursor: pointer;
  display: flex;
  gap: 1.6rem;
  padding: 0.6rem 1rem;
  color: ${theme.surface.fillPrimary};
  border-radius: 0.8rem;
  transition: ${transition(theme, ['background'])};

  &:hover {
    background: ${theme.surface.bgElevated};
  }

  &:active {
    background: ${theme.surface.bgElevatedActive};
  }
`;

export const iconStyle = css`
  display: flex;
  font-size: 1.6rem;
  flex: 0 0 auto;
`;

export const labelStyle = (theme: Theme) => css`
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.6rem;
  letter-spacing: -0.02em;
`;

export const dividerStyle = (theme: Theme) => css`
  margin: 0.6rem 1rem;
  border-radius: 1px;
  height: 1px;
  background: ${theme.surface.fillLine};
`;
