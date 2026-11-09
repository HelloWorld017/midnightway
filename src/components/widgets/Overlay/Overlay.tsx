import { bridgeRenderer, registerImplementations } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import {
  animated,
  config as springConfig,
  useTransition as useSpringTransition,
} from '@react-spring/web';
import { useEffect, useLayoutEffect, useState } from 'react';
import { match } from 'ts-pattern';
import { NotificationBubbles } from './NotificationBubbles';
import { Toolkit } from './Toolkit';
import type { OverlayItem } from '@/repository/overlay';

export const Overlay = () => {
  const overlayItems = useRepo(repo.overlay.overlayItems);
  const [closingGeneration, setClosingGeneration] = useState<number | null>(null);
  const [transitionKeys, setTransitionKeys] = useState<Set<OverlayItem['kind']>>(() => new Set());
  const transitions = useSpringTransition(overlayItems ?? [], {
    keys: item => item.kind,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: (_item, _index, state) =>
      state === ('enter' as typeof state) ? springConfig.stiff : { duration: 200 },
    onDestroyed: item => {
      if (overlayItems?.some(current => current.kind === item.kind)) {
        return;
      }

      setTransitionKeys(previous => {
        if (!previous.has(item.kind)) {
          return previous;
        }

        const next = new Set(previous);
        next.delete(item.kind);
        return next;
      });
    },
  });

  useLayoutEffect(() => {
    setTransitionKeys(previous => {
      const missing = (overlayItems ?? []).filter(item => !previous.has(item.kind));
      if (missing.length === 0) {
        return previous;
      }
      const next = new Set(previous);
      for (const item of missing) {
        next.add(item.kind);
      }
      return next;
    });
  }, [overlayItems]);

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
      {transitions((style, item, transition) => (
        <animated.div style={style}>
          {match(item)
            .with({ kind: 'toolkit' }, toolkit => (
              <Toolkit state={toolkit.state} isLeaving={(transition.phase as string) === 'leave'} />
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
