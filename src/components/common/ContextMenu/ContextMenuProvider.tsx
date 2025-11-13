import { useEffect, useState } from 'react';
import { useLatestCallback } from '@/hooks/useLatestCallback';
import { buildContext } from '@/utils/context';
import { isPromise } from '@/utils/promise';
import type { ContextMenuModel, ContextMenuNode, ContextMenuToken } from './types';

export const [ContextMenuProvider, useContextMenuProvider] = buildContext(() => {
  const [menuModel, setMenuModel] = useState<ContextMenuModel<Any, Any> | null>(null);
  const [childMap, setChildMap] = useState<Record<string, ContextMenuNode[]>>({});
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const traverse = useLatestCallback((target: ContextMenuToken) => {
    const output = menuModel?.traverse(target);
    if (isPromise(output)) {
      return output
        .then(nodes => {
          if (nodes && menuModel) {
            setChildMap(childMap => ({
              ...childMap,
              [menuModel.key(childMap)]: nodes,
            }));
          }
        })
        .catch(() => {});
    }

    if (output) {
      setChildMap(childMap => ({
        ...childMap,
        [menuModel!.key(childMap)]: output,
      }));
    }
  });

  const expandToken = useLatestCallback((token: ContextMenuToken): ContextMenuNode[] | null => {
    if (!menuModel) {
      return null;
    }

    const key = menuModel.key(token);
    if (!childMap[key]) {
      const result = traverse(token);
      if (isPromise(result)) {
        throw result;
      }
    }

    return childMap[key];
  });

  useEffect(() => {
    setChildMap({});
  }, [menuModel]);

  return {
    root: menuModel?.root as ContextMenuNode,
    expandToken,
    setMenuModel,
    position,
    setPosition,
  };
});

export const useSetContextMenuPosition = () => useContextMenuProvider(state => state.setPosition);
export const useSetContextMenuModel = () => useContextMenuProvider(state => state.setMenuModel);
