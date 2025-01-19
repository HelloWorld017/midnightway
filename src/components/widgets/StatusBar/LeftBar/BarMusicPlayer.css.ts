import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const musicCollapsibleStyle = (isVisible: boolean) => css`
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  margin-left: ${isVisible ? 0 : -2.4}rem;
  transition: all 0.4s ease;
`;

export const musicStyle = css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  max-width: 30rem;
`;

export const musicIconStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  color: ${theme.surface.fillPrimary};
  font-size: 1.8rem;
`;

export const musicColumnsStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
`;

export const musicHeaderStyle = css`
  display: flex;
  align-items: center;
`;

export const musicHeaderTitleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.3rem;
  letter-spacing: -0.04em;
  white-space: nowrap;
`;

export const musicHeaderArtistContainerStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &::before {
    content: '';
    display: block;
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 0.2rem;
    margin: 0 0.8rem;
    background: ${theme.surface.fillSecondary};
  }
`;

export const musicHeaderArtistStyle = (isVisible: boolean) => (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.3rem;
  letter-spacing: -0.04em;
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  transform: translateX(${isVisible ? '0' : '-2rem'});
  transition: all 0.4s ease;
  transition-delay: ${isVisible ? '0.4s' : '0'};
  white-space: nowrap;
`;

export const musicArtistStyle = (isVisible: boolean) => (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.1rem;
  letter-spacing: -0.02em;
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  transform: translateY(${isVisible ? '0' : '-100%'});
  transition: all 1s ease;
  white-space: nowrap;
`;
