import type { WeatherIconKind } from '@/assets/icons';

const WeatherIcon = {
  1: 'sun',
  2: 'cloud-sun',
  3: 'cloud',
  4: 'cloudy',
  9: 'cloud-rain',
  10: 'cloud-drizzle',
  11: 'cloud-lightning',
  13: 'cloud-snow',
  50: 'cloud-fog',
} satisfies Record<number, WeatherIconKind>;

const WeatherIconFull = {
  // Group 2xx: Thunderstorm
  200: 'cloud-lightning', // thunderstorm with light rain
  201: 'cloud-lightning', // thunderstorm with rain
  202: 'cloud-lightning', // thunderstorm with rain
  210: 'cloud-lightning', // light thunderstorm
  211: 'cloud-lightning', // thunderstorm
  212: 'cloud-lightning', // heavy thunderstorm
  221: 'cloud-lightning', // ragged thunderstorm
  230: 'cloud-lightning', // thunderstorm with light drizzle
  231: 'cloud-lightning', // thunderstorm with drizzle
  232: 'cloud-lightning', // thunderstorm with heavy drizzle

  // Group 3xx: Drizzle
  300: 'cloud-sun-rain', // light intensity drizzle
  301: 'droplet', // drizzle
  302: 'cloud-drizzle', // heavy intensity drizzle
  310: 'droplets', // light intensity drizzle rain
  311: 'cloud-drizzle', // drizzle rain
  312: 'cloud-drizzle', // heavy intensity drizzle rain
  313: 'cloud-rain', // shower rain and drizzle
  314: 'cloud-rain', // heavy shower rain and drizzle
  321: 'cloud-rain-wind', // shower drizzle

  // Group 5xx: Rain
  500: 'droplets', // light rain
  501: 'cloud-drizzle', // moderate rain
  502: 'cloud-rain', // heavy intensity rain
  503: 'cloud-rain-wind', // very heavy rain
  504: 'cloud-rain-wind', // extreme rain
  511: 'cloud-hail', // freezing rain
  520: 'cloud-drizzle', // light intensity shower rain
  521: 'cloud-rain', // shower rain
  522: 'cloud-rain-wind', // heavy intensity shower rain
  531: 'cloud-rain-wind', // ragged shower rain

  // Group 6xx: Snow
  600: 'snowflake', // light snow
  601: 'snowflake', // snow
  602: 'cloud-snow', // heavy snow
  611: 'cloud-snow', // sleet
  612: 'cloud-snow', // light shower sleet
  613: 'cloud-hail', // shower sleet
  615: 'cloud-hail', // light rain and snow
  616: 'cloud-hail', // rain and snow
  620: 'cloud-hail', // light shower snow
  621: 'cloud-hail', // shower snow
  622: 'cloud-hail', // heavy shower snow

  // Group 7xx: Atmosphere
  701: 'haze', // mist
  711: 'haze', // smoke
  721: 'haze', // haze
  731: 'cloud-fog', // sand / dust whirls
  741: 'cloud-fog', // fog
  751: 'cloud-fog', // sand
  761: 'cloud-fog', // dust
  762: 'cloud-fog', // volcanic ash
  771: 'cloud-rain-wind', // squalls
  781: 'tornado', // tornado

  // Group 800: Clear
  800: 'sun', // clear sky

  // Group 80x: Clouds
  801: 'sun', // few clouds: 11-25%
  802: 'cloud-sun', // scattered clouds: 25-50%
  803: 'cloud', // broken clouds: 51-84%
  804: 'cloudy', // overcast clouds: 85-100%
} satisfies Record<number, WeatherIconKind>;

export const useWeatherIcon = (weatherIcon?: string, weatherId?: number) => {
  if (weatherId && Object.hasOwn(WeatherIconFull, weatherId)) {
    return WeatherIconFull[weatherId as keyof typeof WeatherIconFull];
  }

  const weatherIconNumber = weatherIcon && parseInt(weatherIcon);
  if (weatherIconNumber && Object.hasOwn(WeatherIcon, weatherIconNumber)) {
    return WeatherIcon[weatherIconNumber as keyof typeof WeatherIcon];
  }

  return null;
};
