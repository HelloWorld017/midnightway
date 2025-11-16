import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const labelStyle = (theme: Theme) => css`
  position: absolute;
  top: 4.2rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  width: 16rem;
  padding: 0.6rem;
  border: 1px solid ${theme.surface.fillLine};
  border-radius: 1.6rem;
  background: ${theme.surface.bgOverlay};
`;

export const guideStyle = (isVisible: boolean) => (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  opacity: ${+isVisible};
  transition: ${transition(theme, ['opacity'])};
`;

export const guideArrowStyle = (theme: Theme) => css`
  flex: 0 0 auto;
  color: ${theme.surface.fillPrimary};
  font-size: 1.6rem;
  margin-left: 0.2rem;
`;

export const guideTextStyle = (theme: Theme) => css`
  flex: 1 1 0;
  min-width: 0;
  margin-right: 1rem;

  color: ${theme.surface.fillSecondary};
  font-family: ${theme.fonts.content};
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.4rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
  opacity: 0.8;
`;

export const sliderStyle = css`
  display: flex;
  justify-content: flex-end;
  flex-basis: calc(var(--percentage) + 1.2rem);
`;

export const iconStyle = (theme: Theme) => css`
  background: ${theme.surface.bgElevated};
  color: ${theme.surface.fillPrimary};
  font-size: 1.6rem;
  padding: 0.6rem;
  border-radius: 1rem;
`;

export const gradientStyle = (theme: Theme) => css`
  position: absolute;
  pointer-events: none;
  top: 50%;
  left: 1.2rem;
  right: 1.2rem;
  border-radius: 1.2rem;
  overflow: hidden;
  transform: translateY(-50%);

  &::after {
    content: '';
    display: block;
    width: calc(var(--percentage) - 2.4rem);
    height: 1.6rem;
    border-radius: 1.2rem;
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
