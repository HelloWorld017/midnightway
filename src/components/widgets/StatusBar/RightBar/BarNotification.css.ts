import { css } from '@emotion/react';
import type { SurfaceKind } from '@/constants/theme';
import type { Theme } from '@emotion/react';

export const notificationIconStyle = (surface: SurfaceKind) => (theme: Theme) => css`
  color: ${theme.colors[surface].fillPrimary};
  font-size: 1.6rem;
`;
