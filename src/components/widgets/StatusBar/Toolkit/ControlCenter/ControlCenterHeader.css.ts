import { css, type Theme } from '@emotion/react';
import { transition } from '@/utils/css/transition';

export const headerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const headerContentStyle = css`
  display: flex;
  flex-direction: column;
`;

export const headerTitleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1.7rem;
  letter-spacing: -0.02em;
`;

export const headerDescriptionStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 500;
  font-size: 0.8rem;
  line-height: 1rem;
  letter-spacing: -0.02em;
`;

export const headerButtonStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-size: 1.2rem;
  padding: 0.6rem;
  border-radius: 0.6rem;
  transition: ${transition(theme, ['background'])};

  &:hover {
    background: ${theme.surface.bgElevated};
  }
`;
