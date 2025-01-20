import { useMemo } from 'react';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';

export const usePerformanceValue = () => {
  const performance = useRepo(
    repo.performance.$pick('cpuUsage', 'memoryUsed', 'memoryTotal', 'gpuUsage')
  );

  const performanceValue = useMemo(() => {
    if (!performance) {
      return null;
    }

    const activeStats = [
      performance.cpuUsage,
      performance.gpuUsage,
      performance.memoryUsed &&
        performance.memoryTotal &&
        (performance.memoryUsed / performance.memoryTotal) * 100,
    ]
      .filter(x => x !== null)
      .sort();

    const { sum, total } = activeStats.reduce<{ multiplier: number; total: number; sum: number }>(
      (reduced, stat) => ({
        multiplier: reduced.multiplier / 2,
        total: reduced.total + 100 * reduced.multiplier,
        sum: reduced.sum + stat * reduced.multiplier,
      }),
      { multiplier: 0.5, total: 0, sum: 0 }
    );

    return (sum / total) * 100;
  }, [performance]);

  return performanceValue;
};
