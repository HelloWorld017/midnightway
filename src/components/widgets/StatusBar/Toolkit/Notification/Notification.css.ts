import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const sectionStyle = css`
  display: flex;
  flex-direction: column;
  padding-bottom: 1.6rem;
`;

export const sectionTitleStyle = (theme: Theme) => css`
  padding-bottom: 0.4rem;
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2rem;
`;

export const trayListStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
`;
