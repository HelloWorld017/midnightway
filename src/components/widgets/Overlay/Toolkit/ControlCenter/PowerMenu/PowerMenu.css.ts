import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const rootStyle = css`
  position: relative;
`;

export const backdropStyle = (theme: Theme) => css`
  position: absolute;
  inset: 0;
  background: ${theme.surface.bgBackdrop};
`;

export const powerButtonStyle = (theme: Theme) => css`
  display: flex;
  padding: 1rem;
  margin-top: auto;
  margin-left: auto;
  gap: 0.6rem;
  border-radius: 1.6rem;

  font-size: 1.6rem;
  color: ${theme.surface.fillPrimary};
  background: ${theme.surface.bgElevated};
  transition: ${transition(theme, ['background'])};

  &:hover {
    background: ${theme.surface.bgElevatedHover};
  }

  &:active {
    background: ${theme.surface.bgElevatedActive};
  }
`;
