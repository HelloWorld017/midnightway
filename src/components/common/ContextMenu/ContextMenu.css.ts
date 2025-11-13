import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const frameStyle = (isLeftwards: boolean, isUpwards: boolean) => (theme: Theme) => css`
  position: absolute;
  top: 0;
  background: ${theme.surface.bgBase};
  padding: 0.4rem 0.6rem;
  border-radius: 0.6rem;

  ${isLeftwards ? 'right' : 'left'}: calc(100% + 1rem);
  ${isUpwards ? 'bottom' : 'top'}: 0;
`;

export const listStyle = css`
  display: flex;
  flex-direction: column;
`;

export const fallbackStyle = css`
  &::after {
    content: 'Loading';
  }
`;

export const rootStyle = css`
  position: fixed;
`;

export const itemStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.2rem;
  letter-spacing: -0.04em;
  white-space: nowrap;
`;

export const submenuStyle = (theme: Theme) => css`
  position: relative;
  ${itemStyle(theme)};
`;

export const sectionStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 0.6rem;
  line-height: 1rem;
  letter-spacing: -0.04em;
  white-space: nowrap;
  margin-bottom: 0.2rem;
`;
