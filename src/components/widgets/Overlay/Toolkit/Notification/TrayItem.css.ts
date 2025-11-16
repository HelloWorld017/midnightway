import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const trayStyle = (theme: Theme) => css`
  display: flex;
  padding: 0.6rem 0.8rem;
  max-width: 12rem;
  border-radius: 0.8rem;
  background: ${theme.surface.bgElevated};
`;

export const textStyle = (theme: Theme) => css`
  display: block;
  min-width: 0;
  overflow: hidden;

  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.title};
  font-weight: 500;
  font-size: 0.8rem;
  line-height: 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
