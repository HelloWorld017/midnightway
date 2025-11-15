import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const labelStyle = (theme: Theme) => css`
  position: absolute;
  top: 3.2rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  width: 12rem;
  padding: 0.4rem;
  border: 1px solid ${theme.surface.fillLine};
  border-radius: 1.2rem;
  background: ${theme.surface.bgOverlay};
`;

export const guideStyle = (isVisible: boolean) => (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  gap: 0.4rem;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  opacity: ${+isVisible};
  transition: ${transition(theme, ['opacity'])};
`;

export const guideArrowStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  color: ${theme.surface.fillPrimary};
  font-size: 1.2rem;
  margin-left: 0.2rem;
`;

export const guideTextStyle = (theme: Theme) => css`
  flex: 1 1 0;
  min-width: 0;
  margin-right: 0.8rem;

  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
`;

export const sliderStyle = css`
  display: flex;
  justify-content: flex-end;
  flex-basis: var(--percentage);
`;

export const iconStyle = (theme: Theme) => css`
  background: ${theme.surface.bgElevated};
  color: ${theme.surface.fillPrimary};
  font-size: 1.2rem;
  padding: 0.4rem;
  border-radius: 0.8rem;
`;

export const gradientStyle = (theme: Theme) => css`
  position: absolute;
  pointer-events: none;
  top: 50%;
  left: 0.8rem;
  right: 0.8rem;
  border-radius: 1rem;
  overflow: hidden;
  transform: translateY(-50%);

  &::after {
    content: '';
    display: block;
    width: calc(var(--percentage) - 2.4rem);
    height: 1.2rem;
    border-radius: 1rem;
    background: ${theme.surface.gradientProgress};
  }
`;

export const inputStyle = css`
  appearance: none;
  position: absolute;
  inset: 0;
  opacity: 0;
`;

export const maskStyle = css`
  position: absolute;
  top: 0;
  left: 30%;
  bottom: 0;
  width: 70%;
`;
