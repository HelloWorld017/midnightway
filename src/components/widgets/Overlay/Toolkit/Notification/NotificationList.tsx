import { animated, useTransition as useSpringTransition } from '@react-spring/web';
import { useRefMap } from '@/hooks/useRefMap';
import { sleep } from '@/utils/promise';
import { NotificationItem } from './NotificationItem';
import * as styles from './NotificationList.css';
import type { NotificationItemProps } from './NotificationItem';
import type { ReactNode } from 'react';

export type NotificationListProps = {
  notifications: NotificationItemProps['item'][];
  children?: ReactNode;
};

export const NotificationList = ({ notifications, children }: NotificationListProps) => {
  const [refMap, refCallback] = useRefMap<number, HTMLDivElement>();
  const transitions = useSpringTransition(notifications, {
    keys: item => item.id,
    from: { x: -30, opacity: 0, height: 0 },
    enter: item => async next => {
      await next({ x: 0, opacity: 1, height: refMap.get(item.id)?.offsetHeight });
    },
    update: item => async next => {
      await next({ height: refMap.get(item.id)?.offsetHeight });
    },
    leave: item => async next => {
      await next({ height: refMap.get(item.id)?.offsetHeight });
      await Promise.all([next({ x: 30, opacity: 0 }), sleep(150).then(() => next({ height: 0 }))]);
    },
    trail: 50,
  });

  return (
    <div css={styles.notificationListStyle}>
      {children}
      <div css={styles.notificationListInnerStyle}>
        {transitions((style, item) => (
          <animated.div style={style}>
            <div css={styles.notificationItemStyle} ref={refCallback(item.id)}>
              <NotificationItem item={item} />
            </div>
          </animated.div>
        ))}
      </div>
    </div>
  );
};
