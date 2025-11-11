import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const buttonStyle = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${theme.surface.fillPrimary};
  background: ${theme.surface.bgElevated};
  font-size: 1.2rem;
  width: calc((100% - 0.8rem) / 3);
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 1.2rem;

  &:hover {
    background: ${theme.surface.bgElevatedHover};
  }

  &:active {
    background: ${theme.surface.bgElevatedActive};
  }
`;
