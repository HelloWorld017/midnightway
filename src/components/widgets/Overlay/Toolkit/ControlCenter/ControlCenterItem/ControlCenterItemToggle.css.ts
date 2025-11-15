import { css } from '@emotion/react';
import * as indexStyles from './index.css';
import type { Theme } from '@emotion/react';

export const toggleStyle = (isActive: boolean) => (theme: Theme) => css`
  ${indexStyles.itemStyle(theme)};

  background: ${isActive ? theme.surface.fillHighlight : theme.surface.bgElevated};

  &:hover {
    background: ${isActive ? theme.surface.fillHighlightHover : theme.surface.bgElevatedHover};
  }

  &:active {
    background: ${isActive ? theme.surface.fillHighlightActive : theme.surface.bgElevatedActive};
  }
`;

export {
  iconStyle as toggleIconStyle,
  contentStyle as toggleContentStyle,
  titleStyle as toggleTitleStyle,
  descriptionStyle as toggleDescriptionStyle,
} from './index.css';
