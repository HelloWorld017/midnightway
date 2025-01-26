import { useMemo } from 'react';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import { formatNumberByUnit } from '@/utils/format';
import { isFiniteNumber } from '@/utils/type';

export const useNetworkUsage = () => {
  const networkUsage = useRepo(repo.network.usage);
  const networkUsageFormatted = useMemo(
    () =>
      isFiniteNumber(networkUsage?.initialRx) &&
      isFiniteNumber(networkUsage.initialTx) &&
      formatNumberByUnit(
        networkUsage.totalRx -
          networkUsage.initialRx +
          networkUsage.totalTx -
          networkUsage.initialTx
      ),
    [networkUsage]
  );

  return networkUsageFormatted || null;
};
