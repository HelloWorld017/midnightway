import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import {
  repositoryContextMenuModel,
  useSetContextMenuModel,
  useSetContextMenuPosition,
} from '@/components/common/ContextMenu';
import { useInvokeRepo, useRepo } from '@/hooks/useRepo';
import { getRepositoryProxyDescriptor } from '@/utils/repositoryProxy';
import { useRef } from 'react';
import { match } from 'ts-pattern';
import * as styles from './TrayItem.css';
import type { MouseEvent } from 'react';

export const TrayItem = ({ id }: { id: string }) => {
  const tray = useRepo(
    repo.tray.$invokeMethod('get_item', id).$pick('title', 'id', 'iconName', 'isMenu'),
  );

  const trayTooltip = useRepo(
    repo.tray.$invokeMethod('get_item', id).tooltip.$pick('title', 'description'),
  );

  const invoke = useInvokeRepo();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setContextMenuModel = useSetContextMenuModel();
  const setContextMenuPosition = useSetContextMenuPosition();

  type Action = 'activate' | 'secondary_activate' | 'menu';
  const onAction = (e: MouseEvent, action: Action, shouldWait = false) => {
    if (clickTimer.current !== null) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }

    if (shouldWait) {
      clickTimer.current = setTimeout(() => onAction(e, action), 250);
      return;
    }

    const tray = repo.tray.$invokeMethod('get_item', id);
    if (action === 'activate' || action === 'secondary_activate') {
      e.preventDefault();
      void invoke(tray.$invokeMethod(action, e.screenX, e.screenY));
      return;
    }

    if (action === 'menu') {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      const trayMenu = tray.menuModel;
      void invoke(tray.$invokeMethod('about_to_show')).then(() => {
        setContextMenuModel(
          repositoryContextMenuModel(trayMenu, ({ action, actionTarget }) => {
            if (!action) {
              return;
            }

            bridgeRenderer
              .invokeGAction({
                descriptor: getRepositoryProxyDescriptor(tray.actionGroup),
                action,
                actionTarget,
              })
              .catch(() => {});
          }),
        );
      });
    }
  };

  const onClick = (e: MouseEvent) => {
    const [action, shouldWait] = match({ kind: e.type, isMenu: tray?.isMenu ?? false })
      .with({ kind: 'click', isMenu: true }, () => ['menu', true] as const)
      .with({ kind: 'click', isMenu: false }, () => ['activate', true] as const)
      .with({ kind: 'contextmenu' }, () => ['menu', false] as const)
      .with({ kind: 'dblclick', isMenu: true }, () => ['activate', false] as const)
      .with({ kind: 'dblclick', isMenu: false }, () => ['secondary_activate', false] as const)
      .otherwise(() => [null, false]);

    if (action) {
      onAction(e, action, shouldWait);
    }
  };

  const trayTitle = trayTooltip?.title || tray?.title || tray?.id || tray?.iconName;
  if (!trayTitle) {
    return null;
  }

  return (
    <button
      css={styles.trayStyle}
      type="button"
      onClick={onClick}
      onContextMenu={onClick}
      title={trayTooltip?.description}
    >
      <span css={styles.textStyle}>{trayTitle}</span>
    </button>
  );
};
