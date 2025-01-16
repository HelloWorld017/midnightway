import type { Theme as ThemeType } from '@/constants/theme';

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
