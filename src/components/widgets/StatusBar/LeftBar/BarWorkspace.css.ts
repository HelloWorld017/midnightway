import { css, theme } from '@/utils/css';
import type { SurfaceKind } from '@/constants/theme';

type Context = { isIdle: boolean; surface: SurfaceKind };

export const workspaceStyle = css`
  max-width: 200px;
`;

export const iconStyle = ({ surface }: Context) => css`
  background: ${theme.colors[surface].bgElevated};
  min-width: 18px;
  min-height: 18px;
`;

export const iconLabelStyle = ({ surface }: Context) => css`
  color: ${theme.colors[surface].fillElevated};
`;

export const clientLabelStyle = ({ surface }: Context) => css`
  color: ${theme.colors[surface].fillPrimary};
  font-family: ${theme.fonts.title};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.04em;
`;
