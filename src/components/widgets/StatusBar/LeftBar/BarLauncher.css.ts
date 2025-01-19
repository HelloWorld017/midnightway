import { css } from '@emotion/react';
import type { SurfaceKind } from '@/constants/theme';
import type { Theme } from '@emotion/react';

export const launcherIconStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-size: 1.4rem;
`;
