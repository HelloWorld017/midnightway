import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const popupStyle = (width: string) => css`
  width: min(${width}, calc(100vw - 2rem));
  max-height: calc(75vh - 7rem);
  overflow-y: auto;
  padding: 1.2rem;
`;

export const trayListStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  list-style: none;
`;

export const trayItemStyle = (theme: Theme) => css`
  width: 100%;
  max-width: none;
  padding: 0.8rem 1rem;

  &:hover {
    background: ${theme.surface.bgElevatedHover};
  }
`;

export const emptyStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 1.2rem;
  padding: 1rem 0;
`;

export const soundControlsStyle = css`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  & > label {
    flex: 1;
    min-width: 0;
  }
`;

export const soundMuteStyle = (theme: Theme) => css`
  display: flex;
  padding: 1rem;
  border-radius: 1rem;
  color: ${theme.surface.fillPrimary};
  background: ${theme.surface.bgElevated};
  font-size: 1.6rem;
`;

export const backButtonStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 1.2rem;
  padding: 0.4rem 0;
  margin-bottom: 0.8rem;
`;
