import { useRef } from 'react';
import { match } from 'ts-pattern';
import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import {
  repositoryContextMenuModel,
  useSetContextMenuModel,
} from '@/components/common/ContextMenu';
import { useInvokeRepo, useRepo } from '@/hooks/useRepo';
import { getRepositoryProxyDescriptor } from '@/utils/repositoryProxy';
import * as styles from './TrayItem.css';
import type { MouseEvent } from 'react';

export const TrayItem = ({ id }: { id: string }) => {
  const tray = useRepo(
    repo.tray.$invokeMethod('get_item', id).$pick('title', 'id', 'iconName', 'isMenu')
  );

  const trayTooltip = useRepo(
    repo.tray.$invokeMethod('get_item', id).tooltip.$pick('title', 'description')
  );

  const invoke = useInvokeRepo();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setContextMenuModel = useSetContextMenuModel();

  type Action = 'wait_menu' | 'activate' | 'secondary_activate' | 'menu';
  const onAction = (e: MouseEvent, action: Action) => {
    if (action === 'wait_menu') {
      clickTimer.current = setTimeout(() => onAction(e, 'menu'), 250);
      return;
    }

    const tray = repo.tray.$invokeMethod('get_item', id);
    if (action === 'activate' || action === 'secondary_activate') {
      invoke(tray.$invokeMethod(action, e.screenX, e.screenY)).catch(() => {});
      e.preventDefault();
      return;
    }

    if (action === 'menu') {
      const trayMenu = tray.menuModel;
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
        })
      );
    }
  };

  const onClick = (e: MouseEvent) => {
    const action = match({ kind: e.type, menuPreferred: tray?.isMenu })
      .with({ kind: 'click', menuPreferred: true }, (): Action => 'wait_menu')
      .with({ kind: 'click', menuPreferred: false }, (): Action => 'activate')
      .with({ kind: 'contextmenu', menuPreferred: true }, (): Action => 'menu')
      .with({ kind: 'contextmenu', menuPreferred: false }, (): Action => 'secondary_activate')
      .with({ kind: 'dblclick', menuPreferred: true }, (): Action => 'activate')
      .otherwise(() => null);

    if (action) {
      onAction(e, action);
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
