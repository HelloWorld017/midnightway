import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';

export const powerIconStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-size: 1.6rem;
`;
