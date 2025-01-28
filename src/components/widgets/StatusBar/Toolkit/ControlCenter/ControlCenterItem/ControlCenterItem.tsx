import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';
import { repo } from '@/bridge/repository';
import { useNetworkState } from '@/components/widgets/StatusBar/hooks/useNetworkState';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { useInvokeRepo, useRepo } from '@/hooks/useRepo';
import { ControlCenterItemButton } from './ControlCenterItemButton';
import { ControlCenterItemSlider } from './ControlCenterItemSlider';
import { ControlCenterItemToggle } from './ControlCenterItemToggle';
import type { ControlCenterItem as ControlCenterItemType } from '@/config/schema';

type ControlCenterItemNetworkProps = { item: ControlCenterItemType & { kind: 'network' } };
const ControlCenterItemNetwork = ({ item }: ControlCenterItemNetworkProps) => {
  const { t } = useTranslation();
  const { isConnected, icon, text } = useNetworkState();
  const toggleItem = useMemo(
    (): ControlCenterItemType & { kind: 'toggle' } => ({
      id: item.id,
      kind: 'toggle',
      icon: '',
      title: text,
      description: t('control-center.network'),
      activateCommand: '',
      deactivateCommand: '',
      state: { kind: 'default', defaultState: false },
    }),
    [item, text]
  );

  return (
    <ControlCenterItemToggle
      item={toggleItem}
      icon={icon}
      state={isConnected}
      onToggle={() => {}}
    />
  );
};

type ControlCenterItemSilentProps = { item: ControlCenterItemType & { kind: 'silent' } };
const ControlCenterItemSilent = ({ item }: ControlCenterItemSilentProps) => {
  const { t } = useTranslation();
  const isSilentMode = useRepo(repo.notification.isSilentMode);

  const invoke = useInvokeRepo();
  const setSilentMode = useLatestCallback((nextValue: boolean) => {
    void invoke(repo.notification.set.$invoke('isSilentMode', nextValue));
  });

  const toggleItem = useMemo(
    (): ControlCenterItemType & { kind: 'toggle' } => ({
      id: item.id,
      kind: 'toggle',
      icon: 'circle-slash',
      title: t('control-center.silent-mode'),
      description: '',
      activateCommand: '',
      deactivateCommand: '',
      state: { kind: 'default', defaultState: false },
    }),
    [item]
  );

  return (
    <ControlCenterItemToggle
      item={toggleItem}
      state={isSilentMode ?? false}
      onToggleUpdate={setSilentMode}
    />
  );
};

type ControlCenterItemVolumeSliderProps = {
  item: ControlCenterItemType & { kind: 'volume-slider' };
};

const ControlCenterItemVolumeSlider = ({ item }: ControlCenterItemVolumeSliderProps) => {
  const volumeFloat = useRepo(repo.sound.defaultSpeaker.volume);
  const volume = (volumeFloat ?? 0) * 100;

  const invoke = useInvokeRepo();
  const setVolume = useLatestCallback((nextVolumePercent: number) => {
    const nextVolumeFloat = nextVolumePercent / 100;
    void invoke(repo.sound.defaultSpeaker.$invokeMethod('set_volume', nextVolumeFloat));
  });

  const sliderItem = useMemo(
    (): ControlCenterItemType & { kind: 'slider' } => ({
      id: item.id,
      kind: 'slider',
      icon: 'speaker',
      state: { kind: 'default', defaultState: 0 },
      command: '',
    }),
    [item]
  );

  return <ControlCenterItemSlider item={sliderItem} state={volume} onChangeUpdate={setVolume} />;
};

export const ControlCenterItem = ({ item }: { item: ControlCenterItemType }) =>
  match(item)
    .with({ kind: 'button' }, button => <ControlCenterItemButton item={button} />)
    .with({ kind: 'toggle' }, toggle => <ControlCenterItemToggle item={toggle} />)
    .with({ kind: 'slider' }, slider => <ControlCenterItemSlider item={slider} />)
    .with({ kind: 'network' }, network => <ControlCenterItemNetwork item={network} />)
    .with({ kind: 'silent' }, silent => <ControlCenterItemSilent item={silent} />)
    .with({ kind: 'volume-slider' }, volume => <ControlCenterItemVolumeSlider item={volume} />)
    .exhaustive();
