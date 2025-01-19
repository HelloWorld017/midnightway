import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const notificationIconStyle = (hasNotification: boolean) => (theme: Theme) => css`
  position: relative;
  color: ${theme.surface.fillPrimary};
  font-size: 1.6rem;

  ${hasNotification &&
  css`
    position: absolute;
    top: 0;
    right: 0;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 0.3rem;
    background: ${theme.surface.fillHighlight};
  `};
`;
