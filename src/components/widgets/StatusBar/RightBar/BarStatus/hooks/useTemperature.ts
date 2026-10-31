import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import { useMemo } from 'react';

export const useTemperature = () => {
  const temperatureByPart = useRepo(repo.temperatures.temperatures);
  const temperatureAccumulated = useMemo(
    () =>
      temperatureByPart &&
      Object.values(temperatureByPart).reduce<{ sum: number; total: number }>(
        ({ sum, total }, current) => ({ sum: sum + current, total: total + 1 }),
        { sum: 0, total: 0 },
      ),
    [temperatureByPart],
  );

  if (!temperatureAccumulated) {
    return null;
  }

  return temperatureAccumulated.sum / temperatureAccumulated.total;
};
