import { css, theme } from '@/utils/css';

export const statusBarStyle = css`
  background: ${theme.colors.glass.bgBase};
  border-radius: 20px;
  margin: 5px 15px;
  transition: background 0.4s ease;
`;

export const statusBarIdleStyle = css`
  background: transparent;
  margin: 0;
`;
