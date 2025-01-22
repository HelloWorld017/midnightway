import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const collapsibleParentStyle =
  (orientation: 'horizontal' | 'vertical', isVisible: boolean) => (theme: Theme) => css`
    display: grid;
    transition: ${transition(theme, ['grid-template-rows', 'grid-template-columns'])};
    ${`grid-template-${orientation === 'horizontal' ? 'columns' : 'rows'}: ${+isVisible}fr;`}
  `;

export const collapsibleChildStyle = css`
  overflow: hidden;
`;
