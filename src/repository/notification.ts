import { Variable } from 'astal';
import AstalNotifd from 'gi://AstalNotifd';
import { asConnectable } from '@/utils/binding';

const notifd = AstalNotifd.get_default();

export const notificationRepository = asConnectable({
  isSilentMode: Variable(false),
  notifd,
});
