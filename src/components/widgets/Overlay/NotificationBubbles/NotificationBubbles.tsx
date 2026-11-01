import { repo } from '@/bridge/repository';
import { useRootProvider } from '@/components/common/RootProvider';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { useRefMap } from '@/hooks/useRefMap';
import { useInvokeRepo } from '@/hooks/useRepo';
import { animated, useTransition } from '@react-spring/web';
import { useEffect, useMemo, useRef } from 'react';
import { NotificationItem } from '../Toolkit/Notification/NotificationItem';
import { useNotifications } from '../Toolkit/Notification/hooks/useNotifications';
import * as styles from './NotificationBubbles.css';
import type { NotificationBubblesState } from '@/repository/overlay';

export const NotificationBubbles = ({ state }: { state: NotificationBubblesState }) => {
  const { window } = useRootProvider();
  const notifications = useNotifications();
  const invoke = useInvokeRepo();

  const containerRef = useRef<HTMLDivElement>(null);
  const [refMap, refCallback] = useRefMap<number, HTMLDivElement>();

  const activeBubbles = useRef(new Set<number>());
  const bubbles = useMemo(
    () => state.ids.flatMap(id => notifications?.filter(item => item.id === id) ?? []),
    [state.ids, notifications],
  );

  const transitions = useTransition(bubbles, {
    keys: item => item.id,
    from: { x: 48, opacity: 0, height: 0, scale: 0.96 },
    enter: item => async next => {
      activeBubbles.current.add(item.id);
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
    onDestroyed: item => {
      activeBubbles.current.delete(item.id);
      if (activeBubbles.current.size === 0) {
        void invoke(repo.overlay.$invokeMethod('closeEmptyNotificationBubbles'));
      }
    },
  });

  useEffect(() => {
    if (state.ids.length === 0 && activeBubbles.current.size === 0) {
      void invoke(repo.overlay.$invokeMethod('closeEmptyNotificationBubbles'));
    }
  }, [invoke, state.ids]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const updateBounds = () => {
      const { x, y, width, height } = container.getBoundingClientRect();
      void invoke(
        repo.overlay.$invokeMethod('setNotificationBubblesBounds', { x, y, width, height }),
      );
    };

    const observer = new window.ResizeObserver(updateBounds);
    observer.observe(container);
    window.addEventListener('resize', updateBounds);
    updateBounds();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBounds);
    };
  }, [invoke, window]);

  return (
    <SurfaceProvider surface="floating">
      <div
        ref={containerRef}
        css={styles.containerStyle}
        aria-live="polite"
        aria-relevant="additions"
      >
        {transitions((style, item) => (
          <animated.div style={style} css={styles.transitionStyle}>
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
              <NotificationItem item={item} compact />
            </div>
          </animated.div>
        ))}
      </div>
    </SurfaceProvider>
  );
};
