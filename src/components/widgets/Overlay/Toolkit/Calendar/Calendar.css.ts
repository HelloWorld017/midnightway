import { css } from '@emotion/react';
import { match } from 'ts-pattern';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1rem;
  min-height: 100%;
`;

export const headerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 auto;
  gap: 0.4rem;
  margin-left: 0.2rem;
`;

export const titleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 3rem;
  letter-spacing: -0.02em;
`;

export const descriptionStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-size: 1.2rem;
  line-height: 1.6rem;
  letter-spacing: -0.02em;
`;

export const descriptionDividerStyle = css`
  width: 0.1rem;
  height: 0.6rem;
  border-radius: 0.1rem;
  background: currentColor;
`;

export const calendarStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  padding: 1.6rem;
  gap: 1.6rem;

  background: ${theme.surface.bgSection};
  border-radius: 2rem;
`;

export const calendarControlStyle = css`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
`;

export const calendarSelectStyle = (theme: Theme) => css`
  position: relative;
  border: 1px solid ${theme.surface.fillLine};
  padding: 0.8rem 1rem;

  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.content};
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 1.6rem;

  cursor: text;
  border-radius: 0.8rem;
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
  font-size: 1.4rem;
  width: 3.2rem;
  height: 3.2rem;
  padding: 0.8rem;
  border-radius: 0.8rem;
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
  border-bottom: 0.1rem solid ${theme.surface.fillLine};
`;

export const calendarHeaderDayStyle = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 3.6rem;
  height: 3.2rem;

  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.title};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6rem;
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

    width: 3.6rem;
    height: 3.6rem;
    border-radius: 1.6rem;

    font-family: ${theme.fonts.content};
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.6rem;

    color: ${match(kind)
      .with('active', () => theme.surface.fillPrimary)
      .with('inactive', () => theme.surface.fillSecondary)
      .with('holiday', () => theme.surface.fillHighlight)
      .with('today', () => theme.surface.fillHighlightText)
      .exhaustive()};

    cursor: default;
    &:hover {
      background: ${theme.surface.bgElevated};
    }

    ${kind === 'today' &&
    css`
      background: ${theme.surface.fillHighlight};
      &:hover {
        background: ${theme.surface.fillHighlight};
      }
    `}
  `;
