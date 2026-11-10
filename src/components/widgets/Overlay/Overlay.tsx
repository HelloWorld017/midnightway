import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import {
  animated,
  config as springConfig,
  useTransition as useSpringTransition,
} from '@react-spring/web';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { match } from 'ts-pattern';
import { NotificationBubbles } from './NotificationBubbles';
import * as styles from './Overlay.css';
import { Toolkit } from './Toolkit';
import type { OverlayItem } from '@/repository/overlay';

const getTransitionKey = (item: OverlayItem) => {
  if (item.kind !== 'toolkit') {
    return item.kind;
  }

  return `toolkit-${item.popup.anchor}`;
};

export const Overlay = () => {
  const overlayItems = useRepo(repo.overlay.overlayItems);
  const items = useMemo(
    () => (overlayItems ?? []).map(item => ({ item, key: getTransitionKey(item) })),
    [overlayItems],
  );

  const activeKeys = useRef(new Set<string>());
  activeKeys.current = new Set(items.map(({ key }) => key));

  const [closingGeneration, setClosingGeneration] = useState<number | null>(null);
  const [transitionKeys, setTransitionKeys] = useState<Set<string>>(() => new Set());
  const transitions = useSpringTransition(items, {
    keys: entry => entry.key,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: (_item, _index, state) =>
      state === ('enter' as typeof state) ? springConfig.stiff : { duration: 200 },
    onDestroyed: ({ key }) => {
      if (activeKeys.current.has(key)) {
        return;
      }

      setTransitionKeys(previous => {
        if (!previous.has(key)) {
          return previous;
        }

        const next = new Set(previous);
        next.delete(key);
        return next;
      });
    },
  });

  useLayoutEffect(() => {
    setTransitionKeys(previous => {
      const missing = items.filter(({ key }) => !previous.has(key));
      if (missing.length === 0) {
        return previous;
      }
      const next = new Set(previous);
      for (const { key } of missing) {
        next.add(key);
      }
      return next;
    });
  }, [items]);

  useEffect(
    () =>
      registerImplementations({
        onOverlayClosing: ({ generation }) => setClosingGeneration(generation),
      }),
    [],
  );

  useEffect(() => {
    if (closingGeneration !== null && overlayItems?.length === 0 && transitionKeys.size === 0) {
      void bridgeRenderer.overlayExitFinished({ generation: closingGeneration });
      setClosingGeneration(null);
    }
  }, [closingGeneration, overlayItems, transitionKeys]);

  return (
    <>
      {transitions((style, { item }, transition) => (
        <animated.div
          inert={item.kind === 'toolkit' && (transition.phase as string) === 'leave'}
          css={styles.overlayStyle}
          style={{
            ...style,
            pointerEvents:
              item.kind === 'toolkit' && (transition.phase as string) === 'leave'
                ? 'none'
                : undefined,
          }}
        >
          {match(item)
            .with({ kind: 'toolkit' }, toolkit => (
              <Toolkit popup={toolkit.popup} isLeaving={(transition.phase as string) === 'leave'} />
            ))
            .with({ kind: 'notificationBubbles' }, bubbles => (
              <NotificationBubbles state={bubbles.state} />
            ))
            .exhaustive()}
        </animated.div>
      ))}
    </>
  );
};
