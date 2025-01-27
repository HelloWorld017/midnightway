import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const sliderStyle = (theme: Theme) => css`
  position: relative;
  width: 100%;
  display: flex;
  gap: 0.4rem;
  border-radius: 1.2rem;
  padding: 1rem;
  background: ${theme.surface.bgElevated};
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    width: var(--state);

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    border-radius: 1.2rem;
    background: ${theme.surface.gradientRange};
  }
`;

export const sliderIconStyle = (theme: Theme) => css`
  position: relative;
  display: flex;
  color: ${theme.surface.fillPrimary};
  font-size: 1.2rem;
`;

export const sliderValueStyle = (theme: Theme) => css`
  position: relative;
  color: ${theme.surface.fillPrimary};
  font-family: ${theme.fonts.number};
  font-size: 0.8rem;
  line-height: 1rem;
`;

export const sliderInputStyle = () => css`
  appearance: none;
  position: absolute;
  inset: 0;
  opacity: 0;
`;
