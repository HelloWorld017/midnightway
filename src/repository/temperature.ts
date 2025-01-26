import { Variable } from 'astal';
import { config } from '@/config';
import { asConnectable } from '@/utils/binding';

const { updateInterval } = config().system;

type Sensors = Record<string, Record<string, Record<string, number> | string>>;
const sensors = new Variable<Sensors>({}).poll(
  updateInterval,
  ['sensors', '-j'],
  out => JSON.parse(out) as Sensors
);

const sensorProbes = config().system.temperatures;
const temperatures = sensors(out => {
  const entries = sensorProbes.map(({ name, devices }) => {
    const temperatures = Object.keys(out)
      .filter(key => devices.some(device => key.includes(device)))
      .map(adapterName => out[adapterName])
      .flatMap(adapter =>
        Object.values(adapter)
          .filter(sensor => typeof sensor === 'object')
          .flatMap(sensor =>
            Object.entries(sensor)
              .filter(([key]) => key.startsWith('temp') && key.endsWith('input'))
              .map(([, temp]) => temp)
          )
      );

    return temperatures.length
      ? ([name, temperatures.reduce((prev, next) => prev + next, 0) / temperatures.length] as const)
      : null;
  });

  return Object.fromEntries(entries.filter(value => value !== null));
});

export const temperatureRepository = asConnectable({
  temperatures,
});
