import hash from '@emotion/hash';
import { throttle } from 'es-toolkit';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { MarqueeOnOverflow } from '@/components/common/MarqueeOnOverflow';
import { useCleanup } from '@/hooks/useCleanup';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { useInvokeRepo, useRepo } from '@/hooks/useRepo';
import * as styles from './ControlCenterItemToggle.css';
import type { ControlCenterItem } from '@/config/schema';
import type { IconName } from 'lucide-react/dynamic';
import type { ReactNode } from 'react';

type ControlCenterItemToggleProps = {
  item: ControlCenterItem & { kind: 'toggle' };
  icon?: ReactNode;
  state?: boolean;
  onToggle?: (nextState: boolean) => void;
  onToggleUpdate?: (nextState: boolean) => void;
};

export const ControlCenterItemToggle = ({
  item,
  icon,
  state: propsState,
  onToggle: propsOnToggle,
  onToggleUpdate: propsOnToggleUpdate,
}: ControlCenterItemToggleProps) => {
  const repoStateRaw = useRepo(repo.controlCenter.items[item.id]);
  const repoState =
    !!repoStateRaw && !['false', 'no', '0'].includes(String(repoStateRaw as string));

  const state = propsState ?? repoState;
  const [draftState, setDraftState] = useState(state);
  useEffect(() => setDraftState(state), [state]);

  const invoke = useInvokeRepo();
  const onToggleUpdate = useLatestCallback((nextState: boolean) => {
    if (propsOnToggle) {
      return;
    }

    if (propsOnToggleUpdate) {
      return propsOnToggleUpdate(nextState);
    }

    const command = nextState ? item.activateCommand : item.deactivateCommand;
    void bridgeRenderer.exec({ command });

    if (item.state.kind !== 'poll') {
      void invoke(repo.controlCenter.items.$invokeMethod('set', item.id, nextState));
    }
  });

  const onToggleUpdateThrottled = useMemo(() => throttle(onToggleUpdate, 1000), [onToggleUpdate]);
  const onToggle = useLatestCallback(() => {
    const nextState = !draftState;
    if (propsOnToggle) {
      return propsOnToggle(nextState);
    }

    onToggleUpdateThrottled(nextState);
    setDraftState(nextState);
  });

  useCleanup(() => {
    if (draftState !== state) {
      onToggleUpdate(draftState);
    }
  });

  const title =
    typeof item.title === 'string' ? item.title : item.title[state ? 'active' : 'inactive'];

  const description =
    typeof item.description === 'string'
      ? item.description
      : item.description[state ? 'active' : 'inactive'];

  return (
    <button css={styles.toggleStyle(state)} type="button" onClick={onToggle}>
      <span css={styles.toggleIconStyle}>
        {icon || <DynamicIcon name={item.icon as IconName} width="1em" height="1em" />}
      </span>

      <div css={styles.toggleContentStyle}>
        {description && <span css={styles.toggleDescriptionStyle}>{description}</span>}
        <MarqueeOnOverflow css={styles.toggleTitleStyle} key={hash(title)}>
          {title}
        </MarqueeOnOverflow>
      </div>
    </button>
  );
};
