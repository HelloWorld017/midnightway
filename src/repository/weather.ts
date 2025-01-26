import { Variable } from 'astal';
import { config } from '@/config';
import { asConnectable } from '@/utils/binding';

const url = (template: TemplateStringsArray, ...parts: unknown[]) =>
  String.raw(template, ...parts.map(part => encodeURIComponent(String(part))));

const weatherConfig = config().weather;
const weatherURL = (() => {
  if (!weatherConfig) {
    return null;
  }

  return url`https://api.openweathermap.org/data/2.5/weather?q=${weatherConfig.location}&appid=${weatherConfig.apiToken}`;
})();

type Weather = {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  cloud: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: 200;
};

const weather = Variable<Weather | null>(null);
if (weatherConfig && weatherURL) {
  weather.poll(weatherConfig.updateInterval, ['curl', weatherURL], out => {
    try {
      return JSON.parse(out) as Weather;
    } catch (err) {
      console.error('Failed to fetch weather', err);
      return null;
    }
  });
}

export const weatherRepository = asConnectable({
  weather,
});
