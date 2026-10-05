import { useMemo } from 'react';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';

export const useNotifications = () => {
  const notifications = useRepo(
    repo.notification.notifications.$pickArray(
      'id',
      'appName',
      'time',
      'summary',
      'body',
      'image',
      'category'
    )
  );

  const notificationActions = useRepo(
    repo.notification.notifications
      .$pickArray('actions')
      .$mapArray(action => action.actions.$pickArray('id', 'label'))
  );

  const notificationEntries = useMemo(
    () =>
      notifications &&
      notificationActions &&
      notifications.map((notification, index) => ({
        ...notification,
        actions: notificationActions?.[index] ?? [],
      })),
    [notifications, notificationActions]
  );

  return notificationEntries;
};
