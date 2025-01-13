import { css, theme } from '@/utils/css';
import type { SurfaceKind } from '@/constants/theme';

export const clockTextStyle = (surface: SurfaceKind) => css`
  color: ${theme.colors[surface].fillPrimary};
  font-family: ${theme.fonts.title};
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: -0.04em;
`;

export const clockDividerStyle = css`
  width: 3px;
  height: 3px;
  border-radius: 3px;
`;
