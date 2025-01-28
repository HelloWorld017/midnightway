import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const containerStyle = (theme: Theme) => css`
  background: linear-gradient(
      to left,
      rgb(from ${theme.surface.bgBase} r g b / 0.5),
      rgb(from ${theme.surface.bgBase} r g b / 0.5)
    ),
    var(--cover-art);
  background-color: ${theme.surface.bgSection};
  background-size: cover;

  border-radius: 1.2rem;
  padding: 1.2rem;
  padding-top: 0.8rem;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const bodyStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.2rem;
`;

export const contentsStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  margin-top: 0.4rem;
  gap: 0.8rem;
`;

export const playPauseStyle = (theme: Theme) => css`
  display: flex;
  flex: 0 0 auto;
  padding: 0.8rem;
  font-size: 0.8rem;
  color: ${theme.surface.fillPrimary};
  background: rgba(from ${theme.surface.bgBase} r g b / 0.5);
  border-radius: 0.8rem;
  cursor: pointer;
  backdrop-filter: blur(12px);
`;

export const iconStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-size: 1.2rem;
`;

export const textContentsStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const titleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4rem;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const artistStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const controllerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
`;

export const inputStyle = css`
  flex: 1 1 0;
`;

export const prevNextIconStyle = (isActive: boolean) => (theme: Theme) => css`
  cursor: ${isActive ? 'pointer' : 'not-allowed'};
  display: flex;
  font-size: 1.2rem;
  color: ${isActive ? theme.surface.fillPrimary : theme.surface.fillSecondary};
`;
