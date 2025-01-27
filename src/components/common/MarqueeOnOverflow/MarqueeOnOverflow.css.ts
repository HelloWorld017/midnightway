import { css, keyframes } from '@emotion/react';

const marquee = keyframes`
  0%, 5% { transform: translateX(0); }
  95%, 100% { transform: translateX(-50%) translateX(calc(-0.5 * var(--gap))); }
`;

export const flowRootStyle = css`
  display: flow-root;
`;

export const containerStyle = css`
  display: flex;
  overflow: hidden;
  padding: 0 var(--bleed);
  margin: 0 calc(-1 * var(--bleed));
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) var(--bleed),
    rgba(0, 0, 0, 1) calc(100% - var(--bleed)),
    rgba(0, 0, 0, 0) 100%
  );
`;

export const contentsWrapperStyle = (shouldMarquee: boolean) => css`
  display: flex;
  flex: 0 0 auto;
  gap: var(--gap);
  animation: none;

  ${shouldMarquee &&
  css`
    animation: ${marquee};
    animation-timing-function: linear;
    animation-duration: var(--duration);
    animation-iteration-count: infinite;
  `};
`;
