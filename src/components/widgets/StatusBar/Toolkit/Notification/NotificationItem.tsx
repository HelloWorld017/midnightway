import { formatDistanceToNow } from 'date-fns';
import { IconX } from '@/assets/icons';
import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import { useSanitizeHTML } from '@/hooks/useSanitizeHTML';
import * as styles from './NotificationItem.css';

export const NotificationItem = ({ id }: { id: number }) => {
  const item = useRepo(
    repo.notification
      .$invokeMethod('get_notification', id)
      .$pick('appName', 'time', 'summary', 'body', 'image', 'actions', 'category')
  );

  const bodyMarkup = useSanitizeHTML(item?.body ?? '');

  const onAction = (actionId: string) => {
    bridgeRenderer.debug(['notification-action', actionId]).catch(() => {});
  };

  if (!item) {
    return null;
  }

  return (
    <div css={styles.containerStyle}>
      <div css={styles.headerStyle}>
        <span css={styles.headerTextStyle}>{item.appName}</span>
        <span css={styles.headerDividerStyle} />
        <span css={styles.headerTextStyle}>{formatDistanceToNow(item.time * 1000)}</span>
        <button css={styles.dismissStyle}>
          <IconX />
        </button>
      </div>
      <h3 css={styles.titleStyle}>{item.summary}</h3>
      <p css={styles.descriptionStyle} {...bodyMarkup} />
      {item.image && <img css={styles.imageStyle} src={`/@fs${item.image}`} />}
      {!!item.actions.length && (
        <div css={styles.actionsStyle}>
          {item.actions.map(action => (
            <button css={styles.actionStyle} type="button" onClick={() => onAction(action.id)}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
