import IconWeatherCloudDrizzle from './weather-cloud-drizzle.svg';
import IconWeatherCloudFog from './weather-cloud-fog.svg';
import IconWeatherCloudHail from './weather-cloud-hail.svg';
import IconWeatherCloudLightning from './weather-cloud-lightning.svg';
import IconWeatherCloudMoonRain from './weather-cloud-moon-rain.svg';
import IconWeatherCloudMoon from './weather-cloud-moon.svg';
import IconWeatherCloudRainWind from './weather-cloud-rain-wind.svg';
import IconWeatherCloudRain from './weather-cloud-rain.svg';
import IconWeatherCloudSnow from './weather-cloud-snow.svg';
import IconWeatherCloudSunRain from './weather-cloud-sun-rain.svg';
import IconWeatherCloudSun from './weather-cloud-sun.svg';
import IconWeatherCloud from './weather-cloud.svg';
import IconWeatherCloudy from './weather-cloudy.svg';
import IconWeatherDroplet from './weather-droplet.svg';
import IconWeatherDroplets from './weather-droplets.svg';
import IconWeatherHaze from './weather-haze.svg';
import IconWeatherMoonStar from './weather-moon-star.svg';
import IconWeatherSnowflake from './weather-snowflake.svg';
import IconWeatherSun from './weather-sun.svg';
import IconWeatherTornado from './weather-tornado.svg';
import type { ReactNode, SVGProps } from 'react';

const IconSetWeatherMap = {
  'cloud-drizzle': IconWeatherCloudDrizzle,
  'cloud-fog': IconWeatherCloudFog,
  'cloud-hail': IconWeatherCloudHail,
  'cloud-lightning': IconWeatherCloudLightning,
  'cloud-moon-rain': IconWeatherCloudMoonRain,
  'cloud-moon': IconWeatherCloudMoon,
  'cloud-rain-wind': IconWeatherCloudRainWind,
  'cloud-rain': IconWeatherCloudRain,
  'cloud-snow': IconWeatherCloudSnow,
  'cloud-sun-rain': IconWeatherCloudSunRain,
  'cloud-sun': IconWeatherCloudSun,
  'cloud': IconWeatherCloud,
  'cloudy': IconWeatherCloudy,
  'droplet': IconWeatherDroplet,
  'droplets': IconWeatherDroplets,
  'haze': IconWeatherHaze,
  'moon-star': IconWeatherMoonStar,
  'snowflake': IconWeatherSnowflake,
  'sun': IconWeatherSun,
  'tornado': IconWeatherTornado,
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
