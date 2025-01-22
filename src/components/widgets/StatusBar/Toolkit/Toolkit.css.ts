import { css } from '@emotion/react';
import { transition } from '@/utils/css/transition';
import type { Theme } from '@emotion/react';

export const toolkitStyle = (theme: Theme) => css`
  position: absolute;
  top: 0;

  background: ${theme.surface.bgBase};
  border-radius: 1.5rem;
  padding: 1.2rem 1.8rem;
  transition: ${transition(theme, ['left', 'width'])};
`;
