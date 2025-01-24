import type { SurfaceColors, SurfaceKind, Theme as ThemeType } from '@/constants/theme';

declare module '@emotion/react' {
  export interface Theme extends ThemeType {
    surface: SurfaceColors & { kind: SurfaceKind };
  }
}
