import { config } from '@/config';
import { asConnectable, poll, writable } from '@/utils/binding';
import { execAsync } from 'ags/process';
import * as z from 'zod';

const url = (template: TemplateStringsArray, ...parts: unknown[]) =>
  String.raw(template, ...parts.map(part => encodeURIComponent(String(part))));

const weatherConfig = config().weather;
const weatherURL = (() => {
  if (!weatherConfig) {
    return null;
  }

  return url`https://api.openweathermap.org/data/2.5/weather?q=${weatherConfig.location}&appid=${weatherConfig.apiToken}`;
})();

const zWeather = z.object({
  coord: z.object({ lon: z.number(), lat: z.number() }),
  weather: z.array(
    z.object({ id: z.number(), main: z.string(), description: z.string(), icon: z.string() }),
  ),
  base: z.string(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
    sea_level: z.number().optional(),
    grnd_level: z.number().optional(),
  }),
  visibility: z.number(),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number().optional(),
  }),
  clouds: z.object({ all: z.number() }),
  dt: z.number(),
  sys: z.object({
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.literal(200),
});

type Weather = z.infer<typeof zWeather>;

const weather =
  weatherConfig && weatherURL
    ? poll<Weather | null>(null, weatherConfig.updateInterval, async () => {
        const out = await execAsync(['curl', weatherURL]);
        return zWeather.parse(JSON.parse(out));
      })
    : writable<Weather | null>(null);

export const weatherRepository = asConnectable({
  weather,
});
