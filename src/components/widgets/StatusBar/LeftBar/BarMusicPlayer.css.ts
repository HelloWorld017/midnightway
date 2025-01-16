import { css } from '@emotion/react';
import type { SurfaceKind } from '@/constants/theme';
import type { Theme } from '@emotion/react';

export const musicStyle = (isVisible: boolean) => css`
  display: flex;
  flex-direction: column;
  max-width: 30rem;
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  transition: all 0.4s ease;
`;

export const musicHeaderStyle = css`
  display: flex;
  align-items: center;
`;

export const musicHeaderTitleStyle = (surface: SurfaceKind) => (theme: Theme) => css`
  color: ${theme.colors[surface].fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.3rem;
  letter-spacing: -0.04em;
`;

export const musicHeaderArtistContainerStyle = (surface: SurfaceKind) => (theme: Theme) => css`
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
    background: ${theme.colors[surface].fillSecondary};
  }
`;

export const musicHeaderArtistStyle =
  (surface: SurfaceKind, isVisible: boolean) => (theme: Theme) => css`
    color: ${theme.colors[surface].fillSecondary};
    font-family: ${theme.fonts.content};
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 1.3rem;
    letter-spacing: -0.04em;
    opacity: ${+isVisible};
    visibility: ${isVisible ? 'visibile' : 'hidden'};
    transform: translateX(${isVisible ? '0' : '100%'});
    transition: all 0.4s ease;
    white-space: nowrap;
  `;

export const musicArtistStyle = (surface: SurfaceKind, isVisible: boolean) => (theme: Theme) => css`
  color: ${theme.colors[surface].fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 400;
  font-size: 0.9rem;
  line-height: 1.1rem;
  letter-spacing: -0.02em;
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  transform: translateY(${isVisible ? '0' : '-100%'});
  transition: all 1s ease;
  white-space: nowrap;
`;
