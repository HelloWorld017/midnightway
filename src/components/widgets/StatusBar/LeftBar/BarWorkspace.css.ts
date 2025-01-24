import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const workspaceStyle = css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  max-width: 30rem;
`;

export const iconStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  flex: 0 0 auto;
  font-size: 1.8rem;
`;

export const iconFallbackStyle = (theme: Theme) => css`
  color: ${theme.surface.fillHighlightText};
  font-family: ${theme.fonts.number};
  font-weight: 500;
  font-size: 1rem;
  line-height: 1rem;

  background: ${theme.surface.fillHighlight};
  flex: 0 0 auto;
  min-width: 1.8rem;
  min-height: 1.8rem;
  border-radius: 0.5rem;
`;

export const clientAnimateContainerStyle = css`
  flex: 1 1 0;
`;

export const clientContainerStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  max-width: 20rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const clientLabelStyle = (theme: Theme) => css`
  font-family: ${theme.fonts.title};
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.6rem;
  letter-spacing: -0.04em;
  white-space: nowrap;
`;
