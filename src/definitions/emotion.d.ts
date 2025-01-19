import type { SurfaceKind, Theme as ThemeType } from '@/constants/theme';

declare module '@emotion/react' {
  export interface Theme extends ThemeType {
    surface: ThemeType['colors'][SurfaceKind] & { kind: SurfaceKind };
  }
}
