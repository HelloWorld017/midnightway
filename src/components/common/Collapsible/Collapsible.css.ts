import { css } from '@emotion/react';

export const collapsibleParentStyle = (
  orientation: 'horizontal' | 'vertical',
  isVisible: boolean
) => css`
  display: grid;
  transition: all 0.4s ease;
  ${`grid-template-${orientation === 'horizontal' ? 'columns' : 'rows'}: ${+isVisible}fr;`}
`;

export const collapsibleChildStyle = css`
  overflow: hidden;
`;
