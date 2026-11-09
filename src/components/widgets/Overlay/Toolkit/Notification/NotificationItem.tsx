import { IconChevronDown, IconChevronUp, IconX } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { Collapsible } from '@/components/common/Collapsible';
import { useInvokeRepo } from '@/hooks/useRepo';
import { useSanitizeHTML } from '@/hooks/useSanitizeHTML';
import { formatDistanceToNow } from 'date-fns';
import { useLayoutEffect, useRef, useState } from 'react';
import * as styles from './NotificationItem.css';
import type { BridgeRepository } from '@/bridge/types';

type Notification = BridgeRepository['notification']['notifications'][number];
export type NotificationItemProps = {
  className?: string;
  compact?: boolean;
  item: Pick<
    Notification,
    'id' | 'appName' | 'time' | 'summary' | 'body' | 'image' | 'category'
  > & { actions: Pick<Notification['actions'][number], 'id' | 'label'>[] };
};

export const NotificationItem = ({ className, item, compact = false }: NotificationItemProps) => {
  const invoke = useInvokeRepo();
  const bodyMarkup = useSanitizeHTML(item?.body ?? '');
  const [actionsExpanded, setActionsExpanded] = useState(false);
  const focusActionRef = useRef(false);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const hasActions = !!item.actions?.length;
  const canExpandActions = compact && hasActions;

  useLayoutEffect(() => {
    if (actionsExpanded && focusActionRef.current) {
      focusActionRef.current = false;
      firstActionRef.current?.focus();
    }
  }, [actionsExpanded]);

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
      {canExpandActions && (
        <button
          type="button"
          css={styles.expandActionsStyle}
          aria-label={actionsExpanded ? 'Hide notification actions' : 'Show notification actions'}
          aria-expanded={actionsExpanded}
          onClick={event => {
            focusActionRef.current = !actionsExpanded && event.detail === 0;
            setActionsExpanded(expanded => !expanded);
          }}
        />
      )}
      <div css={styles.headerStyle}>
        <div css={styles.headerTextContainerStyle}>
          <span css={styles.headerTextStyle}>{item.appName}</span>
          <span css={styles.headerDividerStyle} />
          <span css={styles.headerTextStyle}>{formatDistanceToNow(item.time * 1000)}</span>
          {canExpandActions &&
            (actionsExpanded ? (
              <IconChevronUp css={styles.expandIndicatorStyle} aria-hidden="true" />
            ) : (
              <IconChevronDown css={styles.expandIndicatorStyle} aria-hidden="true" />
            ))}
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
      {hasActions && (
        <Collapsible orientation="vertical" isVisible={!compact || actionsExpanded}>
          <div
            css={styles.actionsStyle}
            inert={compact && !actionsExpanded}
            aria-hidden={compact && !actionsExpanded}
          >
            {item.actions.map((action, index) => (
              <button
                key={action.id}
                css={styles.actionStyle}
                type="button"
                ref={index === 0 ? firstActionRef : undefined}
                onClick={() => onAction(action.id)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </Collapsible>
      )}
    </div>
  );
};
