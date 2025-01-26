import { useEffect, useMemo, useState } from 'react';
import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { useInvokeRepo, useRepo } from '@/hooks/useRepo';
import { debounce } from '@/utils/functions/debounce';
import type { ControlCenterItem } from '@/config/schema';

type ControlCenterItemToggleProps = {
  item: ControlCenterItem & { kind: 'toggle' };
  state?: boolean;
  onToggle?: (nextState: boolean) => void;
};

export const ControlCenterItemToggle = ({
  item,
  state: propsState,
  onToggle,
}: ControlCenterItemToggleProps) => {
  const repoStateRaw = useRepo(repo.controlCenter.items[item.id]);
  const repoState =
    !!repoStateRaw && !['false', 'no', '0'].includes(String(repoStateRaw as string));

  const state = propsState ?? repoState;

  const [isToggling, setIsToggling] = useState(false);
  const setIsTogglingDebounced = useMemo(() => debounce(setIsToggling, 2000), []);

  useEffect(() => {
    setIsToggling(false);
  }, [state]);

  useEffect(() => {
    setIsTogglingDebounced(isToggling);
  }, [isToggling]);

  const invoke = useInvokeRepo();
  const onClick = useLatestCallback(() => {
    if (isToggling) {
      setIsTogglingDebounced(false);
      return;
    }

    setIsToggling(true);

    if (onToggle) {
      return onToggle(!state);
    }

    const command = state ? item.deactivateCommand : item.activateCommand;
    void bridgeRenderer.exec({ command });

    if (item.state.kind !== 'poll') {
      void invoke(repo.controlCenter.items.set.$invoke('id_123', !state));
    }
  });
};
