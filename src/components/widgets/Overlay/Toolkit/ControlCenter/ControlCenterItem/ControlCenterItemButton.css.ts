import { css } from '@emotion/react';
import * as indexStyles from './index.css';
import type { Theme } from '@emotion/react';

export {
  itemStyle as buttonStyle,
  iconStyle as buttonIconStyle,
  contentStyle as buttonContentStyle,
  descriptionStyle as buttonDescriptionStyle,
} from './index.css';

export const buttonTitleStyle = (theme: Theme) => css`
  ${indexStyles.titleStyle(theme)};
  white-space: nowrap;
  text-overflow: ellipsis;
`;
