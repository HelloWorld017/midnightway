import { css } from '@emotion/react';
import { match } from 'ts-pattern';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 0.8rem;
  min-height: 100%;
`;

export const headerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 auto;
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
  flex: 1 0 auto;
  padding: 1.2rem;
  gap: 1.2rem;

  background: ${theme.surface.bgSection};
  border-radius: 1.6rem;
`;

export const calendarControlStyle = css`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
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

export const calendarButtonsStyle = css`
  display: flex;
  flex: 0 0 auto;
`;

export const calendarButtonStyle = (theme: Theme) => css`
  cursor: pointer;
  color: ${theme.surface.fillPrimary};
  font-size: 1.2rem;
  padding: 0.7rem;
  border-radius: 0.6rem;
  transition: ${transition(theme, ['background'])};

  &:hover {
    background: ${theme.surface.bgElevated};
  }
`;

export const calendarMonthStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  justify-content: space-around;
`;

export const calendarHeaderStyle = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.surface.fillLine};
`;

export const calendarHeaderDayStyle = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 2.7rem;
  height: 2.4rem;

  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.title};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.1rem;
`;

export const calendarWeekStyle = css`
  display: flex;
  justify-content: space-between;
`;

export const calendarDateStyle =
  (kind: 'inactive' | 'active' | 'holiday' | 'today') => (theme: Theme) => css`
    display: flex;
    justify-content: center;
    align-items: center;

    width: 2.7rem;
    height: 2.7rem;
    border-radius: 1.2rem;

    font-family: ${theme.fonts.content};
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.1rem;

    color: ${match(kind)
      .with('active', () => theme.surface.fillPrimary)
      .with('inactive', () => theme.surface.fillSecondary)
      .with('holiday', () => theme.surface.fillHighlight)
      .with('today', () => theme.surface.fillHighlightText)
      .exhaustive()};

    ${kind === 'today' &&
    css`
      background: ${theme.surface.fillHighlight};
    `}
  `;
