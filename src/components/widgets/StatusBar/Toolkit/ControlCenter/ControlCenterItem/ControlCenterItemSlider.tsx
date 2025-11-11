import { throttle } from 'es-toolkit';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { useCleanup } from '@/hooks/useCleanup';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { useInvokeRepo, useRepo } from '@/hooks/useRepo';
import * as styles from './ControlCenterItemSlider.css';
import type { ControlCenterItem } from '@/config/schema';
import type { IconName } from 'lucide-react/dynamic';
import type { ReactNode } from 'react';

const zNumeric = z.coerce
  .number()
  .finite()
  .catch(0)
  .transform(i => Math.round(i))
  .transform(i => Math.max(0, Math.min(i, 100)));

type ControlCenterItemSliderProps = {
  item: ControlCenterItem & { kind: 'slider' };
  icon?: ReactNode;
  state?: number;
  onChange?: (nextValue: number) => void;
  onChangeUpdate?: (nextValue: number) => void;
};

export const ControlCenterItemSlider = ({
  item,
  icon,
  state: propsState,
  onChange: propsOnChange,
  onChangeUpdate: propsOnChangeUpdate,
}: ControlCenterItemSliderProps) => {
  const repoStateRaw = useRepo(repo.controlCenter.items[item.id]);
  const repoState = zNumeric.parse(repoStateRaw);

  const state = propsState ?? repoState;
  const [draftState, setDraftState] = useState(state);
  useEffect(() => setDraftState(state), [state]);

  const invoke = useInvokeRepo();
  const onChangeUpdate = useLatestCallback((nextValue: number) => {
    if (propsOnChange) {
      return;
    }

    if (propsOnChangeUpdate) {
      return propsOnChangeUpdate(nextValue);
    }

    const command = item.command
      .replaceAll('{{percent}}', nextValue.toFixed(0))
      .replaceAll('{{frac}}', (nextValue / 100).toFixed(2));

    void bridgeRenderer.exec({ command });

    if (item.state.kind !== 'poll') {
      void invoke(repo.controlCenter.items.$invokeMethod('set', item.id, nextValue));
    }
  });

  const onChangeUpdateThrottled = useMemo(() => throttle(onChangeUpdate, 250), [onChangeUpdate]);
  const onChange = useLatestCallback((nextValue: number) => {
    if (propsOnChange) {
      return propsOnChange(nextValue);
    }

    onChangeUpdateThrottled(nextValue);
    setDraftState(nextValue);
  });

  useCleanup(() => {
    if (draftState !== state) {
      onChange(draftState);
    }
  });

  return (
    <label css={styles.sliderStyle} style={{ '--state': `${draftState}%` }}>
      <span css={styles.sliderIconStyle}>
        {icon || <DynamicIcon name={item.icon as IconName} width="1em" height="1em" />}
      </span>
      <span css={styles.sliderValueStyle}>{draftState.toFixed(0)}</span>
      <input
        css={styles.sliderInputStyle}
        type="range"
        min={0}
        max={100}
        value={draftState}
        onChange={e => onChange(e.currentTarget.valueAsNumber)}
      />
    </label>
  );
};
