import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const containerStyle = (theme: Theme) => css`
  position: absolute;
  bottom: 4.8rem;
  right: 1.6rem;

  display: flex;
  flex-direction: column-reverse;
  gap: 0.02rem;
  padding: 0.8rem;
  min-width: 16rem;

  background: ${theme.surface.bgOverlay};
  border-radius: 1.2rem;
  border: 1px solid ${theme.surface.fillLine};
`;

export const itemStyle = (theme: Theme) => css`
  cursor: pointer;
  display: flex;
  gap: 1.2rem;
  padding: 0.4rem 0.8rem;
  color: ${theme.surface.fillPrimary};
  border-radius: 0.6rem;
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
  font-size: 1.2rem;
  flex: 0 0 auto;
`;

export const labelStyle = (theme: Theme) => css`
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2rem;
  letter-spacing: -0.02em;
`;

export const dividerStyle = (theme: Theme) => css`
  margin: 0.4rem 0.8rem;
  border-radius: 1px;
  height: 1px;
  background: ${theme.surface.fillLine};
`;
