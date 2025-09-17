import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const weatherCollapsibleStyle = (isVisible: boolean) => (theme: Theme) => css`
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  margin-left: ${isVisible ? 0 : -2.4}rem;
  transition: ${transition(theme, ['opacity', 'visibility', 'margin'])};
`;

export const weatherStyle = css`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 15rem;
`;

export const weatherIconStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  color: ${theme.surface.fillPrimary};
  font-size: 1.8rem;
`;

export const weatherColumnStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  gap: 0.2rem;
`;

export const weatherHeaderStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.3rem;
  letter-spacing: -0.04em;
  white-space: nowrap;
`;

export const weatherConditionStyle = (isVisible: boolean) => (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.1rem;
  letter-spacing: -0.02em;

  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  transform: translateY(${isVisible ? '0' : '-100%'});
  transition: ${transition(theme, ['color', 'opacity', 'visibility', 'transform'], 0.4)};
  white-space: nowrap;
`;

export const weatherConditionDividerStyle = (theme: Theme) => css`
  display: block;
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 0.2rem;
  background: ${theme.surface.fillSecondary};
`;
