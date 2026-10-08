import { execAsync } from 'ags/process';
import * as z from 'zod';
import { config } from '@/config';
import { asConnectable, poll } from '@/utils/binding';

const { updateInterval } = config().system;

const zSensors = z.record(z.record(z.union([z.record(z.number().finite()), z.string()])));
type Sensors = z.TypeOf<typeof zSensors>;

const sensors = poll<Sensors>({}, updateInterval, async () =>
  zSensors.parse(JSON.parse(await execAsync(['sensors', '-j'])))
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
