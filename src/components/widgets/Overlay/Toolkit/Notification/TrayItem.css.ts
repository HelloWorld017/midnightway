import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const trayStyle = (theme: Theme) => css`
  display: flex;
  padding: 0.4rem 0.6rem;
  max-width: 10rem;
  border-radius: 0.6rem;
  background: ${theme.surface.bgElevated};
`;

export const textStyle = (theme: Theme) => css`
  display: block;
  min-width: 0;
  overflow: hidden;

  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.title};
  font-weight: 500;
  font-size: 0.7rem;
  line-height: 0.8rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
