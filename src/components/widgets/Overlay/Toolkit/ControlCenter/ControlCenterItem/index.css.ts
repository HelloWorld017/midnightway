import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const itemStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  min-height: 4.2rem;

  cursor: pointer;
  background: ${theme.surface.bgElevated};
  padding: 1rem 1.2rem;
  border-radius: 1.2rem;
  transition: ${transition(theme, ['background'])};

  &:hover {
    background: ${theme.surface.bgElevatedHover};
  }

  &:active {
    background: ${theme.surface.bgElevatedActive};
  }
`;

export const iconStyle = (theme: Theme) => css`
  display: flex;
  color: ${theme.surface.fillPrimary};
  font-size: 1.6rem;
  flex: 0 0 auto;
`;

export const contentStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
`;

export const titleStyle = (theme: Theme) => css`
  color: ${theme.surface.fillPrimary};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2rem;
  letter-spacing: -0.02em;
`;

export const descriptionStyle = (theme: Theme) => css`
  color: ${theme.surface.fillSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
