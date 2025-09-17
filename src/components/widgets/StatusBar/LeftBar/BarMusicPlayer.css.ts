import { css } from '@emotion/react';
import { config } from '@/config';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const musicCollapsibleStyle = (isVisible: boolean) => (theme: Theme) => css`
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  margin-left: ${isVisible ? 0 : -2.4}rem;
  transition: ${transition(theme, ['opacity', 'visibility', 'margin'])};
`;

export const musicStyle = () => css`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: ${config().bar.maxSizes.workspace}px;
`;

export const musicIconStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  color: ${theme.surface.fillPrimary};
  font-size: 1.8rem;
`;

export const musicColumnStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  gap: 0.2rem;
  min-width: 0;
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
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const musicHeaderArtistContainerStyle = (theme: Theme) => css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 0.2rem;
    margin: 0 0.4rem;
    background: ${theme.surface.fillSecondary};
    flex: 0 0 auto;
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
  transition: ${transition(
    theme,
    ['color', 'opacity', 'visibility', 'transform'],
    isVisible ? 0.4 : 0
  )};

  display: block;
  flex: 1 1 0;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const musicArtistStyle = (isVisible: boolean) => (theme: Theme) => css`
  display: flex;
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.1rem;
  letter-spacing: -0.02em;
  opacity: ${+isVisible};
  visibility: ${isVisible ? 'visibile' : 'hidden'};
  transform: translateY(${isVisible ? '0' : '-100%'});
  transition: ${transition(theme, ['color', 'opacity', 'visibility', 'transform'], 0.2)};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
