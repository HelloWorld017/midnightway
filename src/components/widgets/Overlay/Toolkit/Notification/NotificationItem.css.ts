import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const containerStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  padding: 1rem 1.2rem;
  padding-top: 0.8rem;
  border-radius: 1.2rem;
  background: ${theme.surface.bgSection};
`;

export const headerStyle = css`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const headerTextStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.title};
  font-weight: 500;
  font-size: 0.7rem;
  line-height: 0.8rem;
  letter-spacing: -0.02em;
`;

export const headerDividerStyle = (theme: Theme) => css`
  background: ${theme.surface.fillLine};
  width: 0.15rem;
  height: 0.4rem;
  transform: rotate(45deg);
  border-radius: 0.2rem;
`;

export const dismissStyle = (theme: Theme) => css`
  cursor: pointer;
  margin-left: auto;
  padding: 0.4rem;
  border-radius: 0.4rem;
  color: ${theme.surface.fillSecondary};
  font-size: 0.8rem;
  background: ${theme.surface.bgElevated};
  transition: ${transition(theme, ['background'])};

  &:hover {
    background: ${theme.surface.bgElevatedHover};
  }

  &:active {
    background: ${theme.surface.bgElevatedActive};
  }
`;

export const contentsStyle = css`
  display: flex;
  align-items: flex-start;
  margin-top: 0.4rem;
  gap: 0.6rem;
`;

export const textContentsStyle = css`
  flex: 1 1 0;
  min-width: 0;
  gap: 0.2rem;
`;

export const titleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-size: 1.1rem;
  font-weight: 600;
  font-family: ${theme.fonts.content};
  line-height: 1.4rem;
  letter-spacing: -0.02em;
`;

export const descriptionStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-size: 0.8rem;
  font-family: ${theme.fonts.content};
  line-height: 1rem;
  letter-spacing: -0.02em;
  white-space: pre-line;
`;

export const imageStyle = css`
  flex: 0 0 auto;
  border-radius: 1rem;
  width: 2.4rem;
  height: 2.4rem;
  object-fit: cover;
`;

export const actionsStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
  margin-top: 0.4rem;
`;

export const actionStyle = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.6rem;
  padding: 0 0.6rem;
  border-radius: 0.4rem;
  background: ${theme.surface.bgElevated};
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-size: 0.7rem;
  line-height: 0.8rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
  transition: ${transition(theme, ['background'])};

  &:hover {
    background: ${theme.surface.bgElevatedHover};
  }

  &:active {
    background: ${theme.surface.bgElevatedActive};
  }
`;
