import { repo } from '@/bridge/repository';
import { RenderArea } from '@/components/common/RenderArea';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { useLatestRef } from '@/hooks/useLatestRef';
import { useRefMap } from '@/hooks/useRefMap';
import { useInvokeRepo } from '@/hooks/useRepo';
import { animated, useTransition } from '@react-spring/web';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NotificationItem } from '../Toolkit/Notification/NotificationItem';
import { useNotifications } from '../Toolkit/Notification/hooks/useNotifications';
import * as styles from './NotificationBubbles.css';
import type { NotificationBubblesState } from '@/repository/overlay';

const AnimatedRenderArea = animated(RenderArea);

export const NotificationBubbles = ({ state }: { state: NotificationBubblesState }) => {
  const notifications = useNotifications();
  const invoke = useInvokeRepo();

  const [refMap, refCallback] = useRefMap<number, HTMLDivElement>();

  const activeBubblesRef = useRef(new Set<number>());
  const [visibleBubbles, setVisibleBubbles] = useState(() => new Set<number>());
  const visibleBubblesRef = useLatestRef(visibleBubbles);
  const [, setLayoutVersion] = useState(0);

  const bubbles = useMemo(
    () => state.ids.flatMap(id => notifications?.filter(item => item.id === id) ?? []),
    [state.ids, notifications],
  );

  const transitions = useTransition(bubbles, {
    keys: item => item.id,
    from: { x: 48, opacity: 0, height: 0, scale: 0.96 },
    enter: item => async next => {
      activeBubblesRef.current.add(item.id);

      if (!visibleBubblesRef.current.has(item.id)) {
        const nextVisibleBubbles = new Set(visibleBubblesRef.current);
        nextVisibleBubbles.add(item.id);
        setVisibleBubbles(nextVisibleBubbles);
      }

      await next({ x: 0, opacity: 1, height: refMap.get(item.id)?.offsetHeight ?? 0, scale: 1 });
    },

    update: item => async next => {
      await next({ height: refMap.get(item.id)?.offsetHeight ?? 0 });
    },

    leave: () => async next => {
      await next({ x: 48, opacity: 0, scale: 0.96 });
      await next({ height: 0 });
    },

    config: { tension: 280, friction: 28 },
    onChange: ({ value }, _, item) => {
      if (!item) {
        return;
      }

      const isHidden = (value.opacity as number) < 0.2;
      if (isHidden !== !visibleBubblesRef.current.has(item.id)) {
        const nextVisibleBubbles = new Set(visibleBubblesRef.current);
        nextVisibleBubbles[isHidden ? 'delete' : 'add'](item.id);
        setVisibleBubbles(nextVisibleBubbles);
      }
    },
    onDestroyed: item => {
      activeBubblesRef.current.delete(item.id);
      if (activeBubblesRef.current.size === 0) {
        void invoke(repo.overlay.$invokeMethod('closeEmptyNotificationBubbles'));
      }

      if (visibleBubblesRef.current.has(item.id)) {
        const nextVisibleBubbles = new Set(visibleBubblesRef.current);
        nextVisibleBubbles.delete(item.id);
        setVisibleBubbles(nextVisibleBubbles);
      }
    },
  });

  useEffect(() => {
    if (state.ids.length === 0 && activeBubblesRef.current.size === 0) {
      void invoke(repo.overlay.$invokeMethod('closeEmptyNotificationBubbles'));
    }
  }, [invoke, state.ids]);

  return (
    <SurfaceProvider surface="overlay">
      <RenderArea
        kind="clip"
        css={styles.containerStyle}
        aria-live="polite"
        aria-relevant="additions"
      >
        {transitions((style, item) => (
          <AnimatedRenderArea kind="clip" style={style} css={styles.transitionStyle}>
            <div
              ref={refCallback(item.id)}
              css={styles.bubbleStyle}
              onMouseEnter={() =>
                void invoke(repo.overlay.$invokeMethod('pauseNotificationBubble', item.id))
              }
              onMouseLeave={() =>
                void invoke(repo.overlay.$invokeMethod('resumeNotificationBubble', item.id))
              }
              onFocusCapture={() =>
                void invoke(repo.overlay.$invokeMethod('pauseNotificationBubble', item.id))
              }
              onBlurCapture={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  void invoke(repo.overlay.$invokeMethod('resumeNotificationBubble', item.id));
                }
              }}
            >
              <RenderArea kind={visibleBubbles.has(item.id) ? 'default' : 'input'} radius="1.6rem">
                <NotificationItem
                  css={styles.bubbleItemStyle}
                  item={item}
                  compact
                  onExpandActions={() => setLayoutVersion(version => version + 1)}
                />
              </RenderArea>
            </div>
          </AnimatedRenderArea>
        ))}
      </RenderArea>
    </SurfaceProvider>
  );
};
