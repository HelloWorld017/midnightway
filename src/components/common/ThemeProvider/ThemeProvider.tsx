import { DEFAULT_THEME } from '@/constants/theme';
import { ThemeProvider as EmotionThemeProvider, useTheme } from '@emotion/react';
import { useMemo } from 'react';
import type { SurfaceKind } from '@/constants/theme';
import type { ReactNode } from 'react';

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <EmotionThemeProvider theme={DEFAULT_THEME}>{children}</EmotionThemeProvider>
);

type SurfaceProviderProps = {
  surface: SurfaceKind;
  children: ReactNode;
};

export const SurfaceProvider = ({ surface, children }: SurfaceProviderProps) => {
  const theme = useTheme();
  const themeWithSurface = useMemo(
    () => ({ ...theme, surface: { kind: surface, ...theme.colors[surface] } }),
    [theme, surface],
  );

  return <EmotionThemeProvider theme={themeWithSurface}>{children}</EmotionThemeProvider>;
};
