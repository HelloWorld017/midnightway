export const DEFAULT_THEME = {
  colors: {
    floating: {
      bgBase: '#101010',
      bgElevated: '#ffffff',
      fillPrimary: '#ffffff',
      fillSecondary: 'rgba(255, 255, 255, .5)',
      fillHighlight: '#ffffff',
      fillElevated: '#2589BB',
    },
    glass: {
      bgBase: 'rgba(0, 0, 0, .1)',
      bgElevated: '#ffffff',
      fillPrimary: '#ffffff',
      fillSecondary: 'rgba(255, 255, 255, .5)',
      fillHighlight: '#ffffff',
      fillElevated: 'rgba(0, 0, 0, .5)',
    },
  },

  fonts: {
    title: 'Metropolis',
    content: 'Pretendard JP',
    number: 'Aquatico',
  },
};

export type Theme = typeof DEFAULT_THEME;
export type SurfaceKind = keyof Theme['colors'];
