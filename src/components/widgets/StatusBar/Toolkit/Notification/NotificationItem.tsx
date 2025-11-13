import { formatDistanceToNow } from 'date-fns';
import { IconX } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useInvokeRepo } from '@/hooks/useRepo';
import { useSanitizeHTML } from '@/hooks/useSanitizeHTML';
import * as styles from './NotificationItem.css';
import type { BridgeRepository } from '@/bridge/types';

type Notification = BridgeRepository['notification']['notifications'][number];
type NotificationItemProps = {
  item: Pick<
    Notification,
    'id' | 'appName' | 'time' | 'summary' | 'body' | 'image' | 'category'
  > & { actions: Pick<Notification['actions'][number], 'id' | 'label'>[] };
};

export const NotificationItem = ({ item }: NotificationItemProps) => {
  const invoke = useInvokeRepo();
  const bodyMarkup = useSanitizeHTML(item?.body ?? '');

  const onAction = (actionId: string) => {
    const action = repo.notification
      .$invokeMethod('get_notification', item.id)
      .$invokeMethod('invoke', actionId);

    invoke(action).catch(() => {});
  };

  const onDismiss = () => {
    const dismiss = repo.notification
      .$invokeMethod('get_notification', item.id)
      .$invokeMethod('dismiss');

    invoke(dismiss).catch(() => {});
  };

  return (
    <div css={styles.containerStyle}>
      <div css={styles.headerStyle}>
        <span css={styles.headerTextStyle}>{item.appName}</span>
        <span css={styles.headerDividerStyle} />
        <span css={styles.headerTextStyle}>{formatDistanceToNow(item.time * 1000)}</span>
        <button css={styles.dismissStyle} onClick={onDismiss}>
          <IconX />
        </button>
      </div>
      <div css={styles.contentsStyle}>
        {item.image && <img css={styles.imageStyle} src={`/@fs${item.image}`} />}
        <div>
          <h3 css={styles.titleStyle}>{item.summary}</h3>
          <p css={styles.descriptionStyle} {...bodyMarkup} />
        </div>
      </div>
      {!!item.actions?.length && (
        <div css={styles.actionsStyle}>
          {item.actions.map(action => (
            <button
              key={action.id}
              css={styles.actionStyle}
              type="button"
              onClick={() => onAction(action.id)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
