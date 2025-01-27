import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const statusListStyle = css`
  display: flex;
  gap: 1.6rem;
`;

export const statusItemStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-size: 1.3rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  line-height: 1.6rem;
  letter-spacing: -0.04em;
`;

export const statusIconStyle = css`
  display: flex;
  font-size: 1.6rem;
`;
