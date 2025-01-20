import { useLayoutEffect, useMemo, useState } from 'react';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import { formatNumberByUnit } from '@/utils/format';
import { isFiniteNumber } from '@/utils/type';

export const useNetworkUsage = () => {
  const networkUsage = useRepo(repo.network.usage);
  const networkUsageValue = useMemo(
    () =>
      networkUsage?.reduce((prev, item) => prev + item.stats64.rx.bytes + item.stats64.tx.bytes, 0),
    [networkUsage]
  );

  const [initialNetworkUsageValue, setInitialNetworkUsageValue] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (isFiniteNumber(networkUsageValue) && initialNetworkUsageValue === null) {
      setInitialNetworkUsageValue(networkUsageValue);
    }
  }, [networkUsageValue, initialNetworkUsageValue]);

  const networkUsageFormatted = useMemo(
    () =>
      isFiniteNumber(initialNetworkUsageValue) &&
      isFiniteNumber(networkUsageValue) &&
      formatNumberByUnit(networkUsageValue - initialNetworkUsageValue),
    [networkUsageValue]
  );

  return networkUsageFormatted || null;
};
