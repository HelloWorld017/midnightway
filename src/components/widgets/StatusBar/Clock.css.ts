import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const clockStyle = (isIdle: boolean) => css`
  position: absolute;
  top: 50%;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-shadow: 0 1px 4px rgba(0, 0, 0, ${isIdle ? 0.5 : 0});
  transform: translate(-50%, -50%);
`;

export const clockTextStyle = (isChanging: boolean) => (theme: Theme) => css`
  display: flex;
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 400;
  font-size: 1.3rem;
  line-height: 1.6rem;
  letter-spacing: -0.04em;

  ${isChanging &&
  css`
    font-variant-numeric: tabular-nums;
  `};
`;

export const clockDividerStyle = (theme: Theme) => css`
  background: ${theme.surface.fillSecondary};
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 0.3rem;
`;
