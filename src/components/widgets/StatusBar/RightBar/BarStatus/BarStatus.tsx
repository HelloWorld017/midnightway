import { match, P } from 'ts-pattern';
import {
  IconBattery,
  IconBatteryCharging,
  IconBatteryFull,
  IconBatteryLow,
  IconBatteryMedium,
  IconBatteryWarning,
  IconCpu,
  IconStatusTemperature,
  IconVolume1,
  IconVolume2,
  IconVolumeX,
} from '@/assets/icons';
import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { SizeAnimated } from '@/components/common/SizeAnimated';
import { config } from '@/config';
import { useRepo } from '@/hooks/useRepo';
import { formatNumberByDigits } from '@/utils/format';
import { isFiniteNumber } from '@/utils/type';
import { useNetworkState } from '../../hooks/useNetworkState';
import * as styles from './BarStatus.css';
import { useNetworkUsage } from './hooks/useNetworkUsage';
import { usePerformanceValue } from './hooks/usePerformanceValue';
import { useTemperature } from './hooks/useTemperature';
import type { BarStatusItem as BarStatusItemType } from '@/config/schema';

type BarStatusItemSoundProps = { item: BarStatusItemType & { kind: 'sound' } };
const BarStatusItemSound = ({ item }: BarStatusItemSoundProps) => {
  const volume = useRepo(repo.sound.defaultSpeaker.volume);

  const IconVolume = match(volume)
    .with(P.number.finite().lt(0.5).gt(0), () => IconVolume1)
    .with(P.number.finite().gte(0.5), () => IconVolume2)
    .otherwise(() => IconVolumeX);

  return (
    <>
      {isFiniteNumber(volume) && (
        <div css={styles.statusItemStyle}>
          <IconVolume css={styles.statusIconStyle} />
          {item.visibility === 'full' && formatNumberByDigits(volume * 100)}
        </div>
      )}
    </>
  );
};

type BarStatusItemNetworkProps = { item: BarStatusItemType & { kind: 'network' } };
const BarStatusItemNetwork = ({ item }: BarStatusItemNetworkProps) => {
  const networkUsage = useNetworkUsage();
  const { icon: networkIcon } = useNetworkState();
  return (
    <>
      {networkUsage !== null && (
        <div css={styles.statusItemStyle}>
          <span css={styles.statusIconStyle}>{networkIcon}</span>
          {item.visibility === 'full' && networkUsage}
        </div>
      )}
    </>
  );
};

type BarStatusItemPerformanceProps = { item: BarStatusItemType & { kind: 'performance' } };
const BarStatusItemPerformance = ({ item }: BarStatusItemPerformanceProps) => {
  const performanceValue = usePerformanceValue();
  const shouldShowIcon =
    isFiniteNumber(performanceValue) &&
    (item.visibility === 'full' || performanceValue > item.threshold);

  const shouldShowValue =
    isFiniteNumber(performanceValue) &&
    (item.visibility === 'full' ||
      (item.visibility !== 'minimized' && performanceValue > item.threshold));

  return (
    <>
      {shouldShowIcon && (
        <div css={styles.statusItemStyle}>
          <IconCpu css={styles.statusIconStyle} />
          {shouldShowValue && `${formatNumberByDigits(performanceValue)}%`}
        </div>
      )}
    </>
  );
};

type BarStatusItemTemperatureProps = { item: BarStatusItemType & { kind: 'temperature' } };
const BarStatusItemTemperature = ({ item }: BarStatusItemTemperatureProps) => {
  const temperature = useTemperature();
  const shouldShowIcon =
    isFiniteNumber(temperature) && (item.visibility === 'full' || temperature > item.threshold);

  const shouldShowValue =
    isFiniteNumber(temperature) &&
    (item.visibility === 'full' ||
      (item.visibility !== 'minimized' && temperature > item.threshold));

  return (
    <>
      {shouldShowIcon && (
        <div css={styles.statusItemStyle}>
          <IconStatusTemperature css={styles.statusIconStyle} />
          {shouldShowValue && `${formatNumberByDigits(temperature)}°`}
        </div>
      )}
    </>
  );
};

type BarStatusItemBatteryProps = { item: BarStatusItemType & { kind: 'battery' } };
const BarStatusItemBattery = ({ item }: BarStatusItemBatteryProps) => {
  const battery = useRepo(repo.battery.$pick('percentage', 'charging', 'isBattery'));

  const shouldShowIcon = !!battery?.isBattery;
  const shouldShowValue = item.visibility === 'full' && isFiniteNumber(battery?.percentage);

  const IconBatteryState = match(battery)
    .with({ charging: true }, () => IconBatteryCharging)
    .with({ percentage: P.number.finite().gte(0.8) }, () => IconBatteryFull)
    .with({ percentage: P.number.finite().gte(0.45) }, () => IconBatteryMedium)
    .with({ percentage: P.number.finite().gte(0.15) }, () => IconBatteryLow)
    .with({ percentage: P.number.finite() }, () => IconBatteryWarning)
    .otherwise(() => IconBattery);

  return (
    <>
      {shouldShowIcon && (
        <div css={styles.statusItemStyle}>
          <IconBatteryState css={styles.statusIconStyle} />
          {shouldShowValue && formatNumberByDigits(battery.percentage * 100)}
        </div>
      )}
    </>
  );
};

type BarStatusItemProps = { item: BarStatusItemType };
const BarStatusItem = ({ item }: BarStatusItemProps) =>
  match(item)
    .with({ kind: 'performance' }, item => <BarStatusItemPerformance item={item} />)
    .with({ kind: 'temperature' }, item => <BarStatusItemTemperature item={item} />)
    .with({ kind: 'sound' }, item => <BarStatusItemSound item={item} />)
    .with({ kind: 'network' }, item => <BarStatusItemNetwork item={item} />)
    .with({ kind: 'battery' }, item => <BarStatusItemBattery item={item} />)
    .exhaustive();

export const BarStatus = () => {
  const { items } = config().bar.status;

  return (
    <SizeAnimated>
      <div css={styles.statusListStyle}>
        {items.map(item => (
          <BarStatusItem key={item.id} item={item} />
        ))}
      </div>
    </SizeAnimated>
  );
};
