import { bridgeRenderer } from '@/bridge/renderer';
import {
  getRepositoryProxyDescriptor,
  repositoryProxyDescriptorToString,
} from '@/utils/repositoryProxy';
import type { ContextMenuModel, ContextMenuNode } from './types';
import type { RepositoryProxy, RepositoryProxyDescriptor } from '@/utils/repositoryProxy';
import type { Gio } from 'astal';

type DefaultContextMenuToken = { key: string; nodes: DefaultContextMenuNode[] };
type DefaultContextMenuNode = ContextMenuNode<DefaultContextMenuToken, () => void>;

export const defaultContextMenuModel = (
  root: DefaultContextMenuNode[]
): ContextMenuModel<DefaultContextMenuToken, () => void> => ({
  root: { key: '', nodes: root },
  key: token => token.key,
  traverse: token => token.nodes,
  action: action => action(),
});

type RepositoryMenuAction = { action: string | null; actionTarget: string | null };
export const repositoryContextMenuModel = (
  root: RepositoryProxy<Gio.MenuModel>,
  onAction: (action: RepositoryMenuAction) => void
): ContextMenuModel<RepositoryProxyDescriptor, RepositoryMenuAction> => ({
  root: getRepositoryProxyDescriptor(root),
  key: descriptor => repositoryProxyDescriptorToString(descriptor),
  traverse: async descriptor => {
    const nodes = await bridgeRenderer.traverseMenu({ descriptor });
    return nodes.map(node => ({
      ...node,
      action: { action: node.action, actionTarget: node.actionTarget },
    }));
  },
  action: onAction,
});
