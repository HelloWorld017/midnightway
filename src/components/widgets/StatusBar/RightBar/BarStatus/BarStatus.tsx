import { IconCore, IconSound, IconTemperature } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { SizeAnimated } from '@/components/common/SizeAnimated';
import { useRepo } from '@/hooks/useRepo';
import { formatNumberByDigits } from '@/utils/format';
import { isFiniteNumber } from '@/utils/type';
import { useNetworkState } from '../../hooks/useNetworkState';
import * as styles from './BarStatus.css';
import { useNetworkUsage } from './hooks/useNetworkUsage';
import { usePerformanceValue } from './hooks/usePerformanceValue';
import { useTemperature } from './hooks/useTemperature';

export const BarStatus = () => {
  const performanceValue = usePerformanceValue();
  const networkUsage = useNetworkUsage();
  const temperature = useTemperature();
  const volume = useRepo(repo.sound.defaultSpeaker.volume);
  const { icon: networkIcon } = useNetworkState();

  return (
    <SizeAnimated>
      <div css={styles.statusListStyle}>
        {isFiniteNumber(volume) && (
          <div css={styles.statusItemStyle}>
            <IconSound css={styles.statusIconStyle} />
            {formatNumberByDigits(volume * 100)}
          </div>
        )}

        {networkUsage !== null && (
          <div css={styles.statusItemStyle}>
            <span css={styles.statusIconStyle}>{networkIcon}</span>
            {networkUsage}
          </div>
        )}

        {isFiniteNumber(performanceValue) && (
          <div css={styles.statusItemStyle}>
            <IconCore css={styles.statusIconStyle} />
            {`${formatNumberByDigits(performanceValue)}%`}
          </div>
        )}

        {isFiniteNumber(temperature) && (
          <div css={styles.statusItemStyle}>
            <IconTemperature css={styles.statusIconStyle} />
            {`${formatNumberByDigits(temperature)}°`}
          </div>
        )}
      </div>
    </SizeAnimated>
  );
};
