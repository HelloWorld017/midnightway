import { transition } from '@/utils/css/transition';
import { css, keyframes } from '@emotion/react';
import type { Theme } from '@emotion/react';

const enterKeyframe = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const backdropStyle = (theme: Theme) => css`
  position: absolute;
  inset: 0;
  background: ${theme.colors.glass.bgBase};
`;

export const toolkitStyle = (theme: Theme) => css`
  position: absolute;
  overflow: hidden;
  background: ${theme.surface.bgBase};
  transition: ${transition.multiplier(0.5)(theme, ['left', 'top', 'border-radius'])};
  transform: translateX(-50%);

  animation-name: ${enterKeyframe};
  animation-duration: ${theme.easings.opacity.duration}s;
  animation-timing-function: ${theme.easings.opacity.easing};
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

export const mainStyle = (width: string) => css`
  width: min(${width}, calc(100vw - 2rem));
  height: min(40rem, calc(100vh - 7rem));
  display: flex;
  gap: 1rem;
  padding: 1rem;
`;

export const asideStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  gap: 0.8rem;
  padding: 0.8rem;
  margin: 1rem;
  margin-right: 0;
  border-radius: 1.6rem;
  background: ${theme.surface.bgOverlay};
`;

export const asideItemStyle = (isActive: boolean) => (theme: Theme) =>
  css`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${isActive ? theme.surface.fillHighlight : 'transparent'};
    color: ${isActive ? theme.surface.fillHighlightText : theme.surface.fillPrimary};
    font-size: 1.6rem;
    padding: 1rem;
    border-radius: 1rem;

    transition: ${transition(theme, ['background', 'color'])};

    ${
      !isActive &&
      css`
        &:hover {
          background: ${theme.surface.bgElevated};
        }
      `
    };
  `;

export const contentStyle = css`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
`;

export const transitionContentStyle = css`
  height: 100%;
`;

export const scrollerStyle = css`
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const innerPortalStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;
