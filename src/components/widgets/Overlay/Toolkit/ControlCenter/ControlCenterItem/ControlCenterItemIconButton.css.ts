import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const buttonStyle = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${theme.surface.fillPrimary};
  background: ${theme.surface.bgElevated};
  font-size: 1.6rem;
  width: calc((100% - 1.2rem) / 3);
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 1.6rem;

  &:hover {
    background: ${theme.surface.bgElevatedHover};
  }

  &:active {
    background: ${theme.surface.bgElevatedActive};
  }
`;
