import { IconX } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useInvokeRepo } from '@/hooks/useRepo';
import { useSanitizeHTML } from '@/hooks/useSanitizeHTML';
import { formatDistanceToNow } from 'date-fns';
import { useRef, useState } from 'react';
import * as styles from './NotificationItem.css';
import type { BridgeRepository } from '@/bridge/types';

type Notification = BridgeRepository['notification']['notifications'][number];
export type NotificationItemProps = {
  className?: string;
  compact?: boolean;
  onExpandActions?: () => void;
  item: Pick<
    Notification,
    'id' | 'appName' | 'time' | 'summary' | 'body' | 'image' | 'category'
  > & { actions: Pick<Notification['actions'][number], 'id' | 'label'>[] };
};

export const NotificationItem = ({
  className,
  item,
  compact = false,
  onExpandActions,
}: NotificationItemProps) => {
  const invoke = useInvokeRepo();
  const bodyMarkup = useSanitizeHTML(item?.body ?? '');
  const [actionsExpanded, setActionsExpanded] = useState(false);
  const focusActionRef = useRef(false);
  const hasActions = !!item.actions?.length;
  const canExpandActions = compact && hasActions;

  const expandActions = () => {
    if (canExpandActions && !actionsExpanded) {
      setActionsExpanded(true);
      onExpandActions?.();
    }
  };

  const onAction = (actionId: string) => {
    const action = repo.notification
      .$invokeMethod('get_notification', item.id)
      .$invokeMethod('invoke', actionId);

    void invoke(action);
  };

  const onDismiss = () => {
    const dismiss = repo.notification
      .$invokeMethod('get_notification', item.id)
      .$invokeMethod('dismiss');

    void invoke(dismiss);
  };

  return (
    <div css={styles.containerStyle} className={className}>
      {canExpandActions && !actionsExpanded && (
        <button
          type="button"
          css={styles.expandActionsStyle}
          aria-label="Show notification actions"
          aria-expanded={false}
          onClick={event => {
            focusActionRef.current = event.detail === 0;
            expandActions();
          }}
        />
      )}
      <div css={styles.headerStyle}>
        <div css={styles.headerTextContainerStyle}>
          <span css={styles.headerTextStyle}>{item.appName}</span>
          <span css={styles.headerDividerStyle} />
          <span css={styles.headerTextStyle}>{formatDistanceToNow(item.time * 1000)}</span>
        </div>
        <button css={styles.dismissStyle} onClick={onDismiss}>
          <IconX />
        </button>
      </div>
      <div css={styles.contentsStyle}>
        {item.image && <img css={styles.imageStyle} src={`/@fs${item.image}`} alt="" />}
        <div css={styles.textContentsStyle}>
          <h3 css={[styles.titleStyle, compact && styles.lineClampStyle(2)]}>{item.summary}</h3>
          <p css={[styles.descriptionStyle, compact && styles.lineClampStyle(4)]} {...bodyMarkup} />
        </div>
      </div>
      {hasActions && (!compact || actionsExpanded) && (
        <div css={styles.actionsStyle}>
          {item.actions.map((action, index) => (
            <button
              key={action.id}
              css={styles.actionStyle}
              type="button"
              ref={element => {
                if (index === 0 && element && focusActionRef.current) {
                  focusActionRef.current = false;
                  element.focus();
                }
              }}
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
