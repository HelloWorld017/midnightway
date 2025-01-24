import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const headerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  margin-left: 0.4rem;
`;

export const titleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.4rem;
  letter-spacing: -0.02em;
`;

export const descriptionStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 1rem;
  line-height: 1.2rem;
  letter-spacing: -0.02em;
`;

export const descriptionDividerStyle = css`
  width: 0.1rem;
  height: 0.4rem;
  border-radius: 0.1rem;
  background: currentColor;
`;

export const calendarStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.2rem;
  gap: 1.2rem;

  background: ${theme.surface.bgSection};
  border-radius: 1.6rem;
`;

export const calendarSelectStyle = (theme: Theme) => css`
  position: relative;
  border: 1px solid ${theme.surface.fillLine};
  padding: 0.6rem 0.8rem;

  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.4rem;

  border-radius: 0.6rem;
  transition: ${transition(theme, ['border-color'])};

  &:focus-within {
    border-color: ${theme.surface.fillHighlight};
  }
`;

export const calendarSelectInputStyle = css`
  position: absolute;
  inset: 0;

  appearance: none;
  opacity: 0;
`;
