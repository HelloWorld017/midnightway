import {
  IconCloud,
  IconCloudDrizzle,
  IconCloudFog,
  IconCloudHail,
  IconCloudLightning,
  IconCloudMoon,
  IconCloudMoonRain,
  IconCloudRain,
  IconCloudRainWind,
  IconCloudSnow,
  IconCloudSun,
  IconCloudSunRain,
  IconCloudy,
  IconDroplet,
  IconDroplets,
  IconHaze,
  IconMoonStar,
  IconSnowflake,
  IconSun,
  IconTornado,
} from './lucide';
import type { ReactNode, SVGProps } from 'react';

const IconSetWeatherMap = {
  'cloud-drizzle': IconCloudDrizzle,
  'cloud-fog': IconCloudFog,
  'cloud-hail': IconCloudHail,
  'cloud-lightning': IconCloudLightning,
  'cloud-moon-rain': IconCloudMoonRain,
  'cloud-moon': IconCloudMoon,
  'cloud-rain-wind': IconCloudRainWind,
  'cloud-rain': IconCloudRain,
  'cloud-snow': IconCloudSnow,
  'cloud-sun-rain': IconCloudSunRain,
  'cloud-sun': IconCloudSun,
  'cloud': IconCloud,
  'cloudy': IconCloudy,
  'droplet': IconDroplet,
  'droplets': IconDroplets,
  'haze': IconHaze,
  'moon-star': IconMoonStar,
  'snowflake': IconSnowflake,
  'sun': IconSun,
  'tornado': IconTornado,
};

export type WeatherIconKind = keyof typeof IconSetWeatherMap;

export const IconSetWeather = ({
  kind,
  fallback,
  ...props
}: {
  kind: keyof typeof IconSetWeatherMap | null;
  fallback?: ReactNode;
} & SVGProps<SVGSVGElement>) => {
  const Component = kind && IconSetWeatherMap[kind];
  return Component ? <Component {...props} /> : fallback;
};
