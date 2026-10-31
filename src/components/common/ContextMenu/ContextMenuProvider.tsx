import { useLatestCallback } from '@/hooks/useLatestCallback';
import { useLatestRef } from '@/hooks/useLatestRef';
import { buildContext } from '@/utils/context';
import { isPromise } from '@/utils/promise';
import { useMemo, useReducer, useRef, useState } from 'react';
import type {
  ContextMenuAction,
  ContextMenuModel,
  ContextMenuNode,
  ContextMenuToken,
} from './types';

type MenuModel = ContextMenuModel<Any, Any> | null;

export const [ContextMenuProvider, useContextMenuProvider] = buildContext(() => {
  const [menuModel, updateMenuModel] = useState<MenuModel>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(0);
  const menuModelRef = useLatestRef(menuModel);
  const requestId = useRef(0);
  const [, refresh] = useReducer(value => value + 1, 0);
  const cache = useMemo(
    () => ({
      model: menuModel,
      nodes: new Map<string, ContextMenuNode[]>(),
      pending: new Map<string, Promise<void>>(),
    }),
    [menuModel],
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const setMenuModel = useLatestCallback((model: PossiblyPromise<MenuModel>) => {
    const id = ++requestId.current;
    setSession(id);
    setIsOpen(model !== null);
    menuModelRef.current = null;

    if (isPromise(model)) {
      updateMenuModel(null);
      void model
        .then(next => {
          if (requestId.current === id) {
            menuModelRef.current = next;
            updateMenuModel(next);
            setIsOpen(next !== null);
          }
        })
        .catch(error => {
          if (requestId.current === id) {
            console.error('Failed to open context menu', error);
            setIsOpen(false);
          }
        });
    } else {
      menuModelRef.current = model;
      updateMenuModel(model);
    }
  });

  const close = useLatestCallback(() => setMenuModel(null));
  const activate = useLatestCallback((action: ContextMenuAction) => {
    const model = menuModelRef.current;
    close();
    model?.action(action);
  });

  const expandToken = useLatestCallback((token: ContextMenuToken): ContextMenuNode[] | null => {
    if (!menuModel || cache.model !== menuModelRef.current) {
      return null;
    }

    const key = menuModel.key(token);
    const nodes = cache.nodes.get(key);
    if (nodes) {
      return nodes;
    }
    const pending = cache.pending.get(key);
    if (pending) {
      throw pending;
    }

    const id = requestId.current;
    const output = menuModel.traverse(token);
    if (!isPromise(output)) {
      cache.nodes.set(key, output);
      return output;
    }

    const isCurrent = () => requestId.current === id && menuModelRef.current === menuModel;
    const request = output
      .then(nodes => {
        if (isCurrent()) {
          cache.nodes.set(key, nodes);
        }
      })
      .catch(error => {
        if (isCurrent()) {
          console.error('Failed to load context menu', error);
          cache.nodes.set(key, []);
        }
      })
      .finally(() => {
        cache.pending.delete(key);
        if (isCurrent()) {
          refresh();
        }
      });
    cache.pending.set(key, request);
    throw request;
  });

  return {
    root: menuModel?.root as ContextMenuToken | undefined,
    isOpen,
    session,
    close,
    activate,
    expandToken,
    setMenuModel,
    position,
    setPosition,
  };
});

export const useSetContextMenuPosition = () => useContextMenuProvider(state => state.setPosition);
export const useSetContextMenuModel = () => useContextMenuProvider(state => state.setMenuModel);
