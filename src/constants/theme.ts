const DEFAULT_EASING =
  'linear(0, 0.0015 0.54%, 0.0069 1.16%, 0.0259 2.32%, 0.0575 3.57%, 0.1044 5%, 0.2092 7.58%, 0.4617 13.11%, 0.5733 15.7%, 0.6801 18.47%, 0.7658 21.05%, 0.8396 23.73%, 0.8708, 0.8985 26.41%, 0.9243, 0.9465, 0.9654 30.69%, 0.9822 32.2%, 1.0037 34.79%, 1.0187 37.56%, 1.0278 40.59%, 1.0315 44.07%, 1.0291 48.97%, 1.0104 62.98%, 1.0028 71.81%, 0.9994 82.61%, 0.9993 99.91%)';

const SNAPPY_EASING =
  'linear(0, 0.0017, 0.0065 1.13%, 0.0241 2.25%, 0.053 3.46%, 0.0952 4.83%, 0.1857 7.24%, 0.4155 12.71%, 0.5239 15.44%, 0.6238, 0.7098, 0.7815 23.88%, 0.8131 25.33%, 0.8428, 0.8689 28.39%, 0.8928, 0.9134 31.61%, 0.9318, 0.9473, 0.9602 36.67%, 0.9713 38.44%, 0.9809 40.37%, 0.9887 42.38%, 0.9949 44.55%, 1.0031 49.46%, 1.0056 53.32%, 1.0063 58.14%, 1.0014 80.74%, 1.0001 99.96%)';

export type SurfaceColors = {
  bgBase: string;
  bgBackdrop?: string;
  bgOverlay?: string;
  bgElevated?: string;
  bgElevatedHover?: string;
  bgElevatedActive?: string;
  bgSection?: string;
  fillPrimary: string;
  fillSecondary: string;
  fillHighlight: string;
  fillHighlightHover?: string;
  fillHighlightActive?: string;
  fillHighlightText: string;
  fillLine?: string;
  gradientRange?: string;
  gradientProgress?: string;
};

export const DEFAULT_THEME = {
  colors: {
    overlay: {
      bgBase: '#101010',
      fillPrimary: '#ffffff',
      fillSecondary: 'rgba(255, 255, 255, .5)',
      fillHighlight: '#ffffff',
      fillHighlightText: '#1179f8',
    },
    glass: {
      bgBase: 'rgba(0, 0, 0, .1)',
      fillPrimary: '#ffffff',
      fillSecondary: 'rgba(255, 255, 255, .5)',
      fillHighlight: '#ffffff',
      fillHighlightText: 'rgba(0, 0, 0, .5)',
    },
    floating: {
      bgBase: 'rgba(45, 45, 45, .9)',
      bgBackdrop: 'rgba(45, 45, 45, .6)',
      bgOverlay: '#202020',
      bgElevated: 'rgba(255, 255, 255, .1)',
      bgElevatedHover: 'rgba(255, 255, 255, .15)',
      bgElevatedActive: 'rgba(255, 255, 255, .05)',
      bgSection: 'rgba(0, 0, 0, .1)',
      fillPrimary: '#ffffff',
      fillSecondary: 'rgba(255, 255, 255, .5)',
      fillHighlight: '#1179f8',
      fillHighlightText: '#ffffff',
      fillHighlightHover: '#2986f9',
      fillHighlightActive: '#0772f5',
      fillLine: 'rgba(255, 255, 255, .1)',
      gradientRange: 'linear-gradient(to right, rgba(199, 199, 199, .5), rgba(124, 126, 134, .5))',
      gradientProgress: 'linear-gradient(to right, #585858, #c7c7c7)',
    },
  } satisfies Record<string, SurfaceColors>,

  fonts: {
    title: 'Metropolis',
    content: 'Pretendard JP',
    number: 'Aquatico',
  },

  easings: {
    color: {
      easing: SNAPPY_EASING,
      duration: 1,
    },
    background: {
      easing: DEFAULT_EASING,
      duration: 0.7,
    },
    opacity: {
      easing: SNAPPY_EASING,
      duration: 0.7,
    },
    size: {
      easing: DEFAULT_EASING,
      duration: 0.7,
    },
  },
};

export type Theme = typeof DEFAULT_THEME;
export type SurfaceKind = keyof Theme['colors'];
