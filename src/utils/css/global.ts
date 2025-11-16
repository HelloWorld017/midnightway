import { css } from '@emotion/react';

export const globalStyle = css`
  *:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *)) {
    all: unset;
    display: revert;
  }

  *:where(:not(a, button, input, textarea)) {
    cursor: inherit;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    font-size: 12px;
    cursor: default;
  }

  a,
  button {
    cursor: revert;
  }

  img {
    max-inline-size: 100%;
    max-block-size: 100%;
  }
`;
