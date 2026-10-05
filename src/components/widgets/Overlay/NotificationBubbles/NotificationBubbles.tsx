import { useEffect } from 'react';
import { repo } from '@/bridge/repository';
import { useInvokeRepo } from '@/hooks/useRepo';
import { NotificationList } from '../Toolkit/Notification/NotificationList';
import { useNotifications } from '../Toolkit/Notification/hooks/useNotifications';

export const NotificationBubbles = () => {
  const notifications = useNotifications();
  const invoke = useInvokeRepo();

  useEffect(() => {
    if (notifications && !notifications.length) {
      void invoke(repo.overlay.$invokeMethod('setNotificationBubblesState', null));
    }
  }, [invoke, notifications]);

  return <NotificationList notifications={notifications ?? []}></NotificationList>;
};
