import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const trayIconStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-size: 1.6rem;
  flex: 0 0 auto;
`;
