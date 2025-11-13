import { Gio } from 'astal';
import { z } from 'zod';
import { applyDescriptor } from '@/utils/repositoryProxy/bind';
import type { BridgeMethodsMain, BridgeMethodsRenderer, MenuNodeKind } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';
import type { RepositoryProxyDescriptor } from '@/utils/repositoryProxy';

export const traverseMenuImpl =
  (_bridge: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['traverseMenu'] =>
  ({ descriptor }) => {
    const menuModel = applyDescriptor<Gio.MenuModel>(descriptor);
    const traverseDescriptor = (index: number, link: string) => [
      ...descriptor,
      { invokeMethod: { key: 'get_item_link', params: [index, link] } },
    ];

    const defaultString = z.string().catch('');
    const nullableString = z.string().nullable().catch(null);

    return Array.from({ length: menuModel.get_n_items() }).map((_, i) => {
      const section = !!menuModel.get_item_link(i, Gio.MENU_LINK_SECTION);
      const submenu = !!menuModel.get_item_link(i, Gio.MENU_LINK_SUBMENU);

      const [kind, children]: [MenuNodeKind, RepositoryProxyDescriptor | null] = section
        ? ['section', traverseDescriptor(i, Gio.MENU_LINK_SECTION)]
        : submenu
          ? ['submenu', traverseDescriptor(i, Gio.MENU_LINK_SUBMENU)]
          : ['item', null];

      const label = defaultString.parse(
        menuModel.get_item_attribute_value(i, Gio.MENU_ATTRIBUTE_LABEL)
      );

      const action = nullableString.parse(
        menuModel.get_item_attribute_value(i, Gio.MENU_ATTRIBUTE_ACTION)
      );

      const actionTarget = nullableString.parse(
        menuModel.get_item_attribute_value(i, Gio.MENU_ATTRIBUTE_TARGET)
      );

      return { kind, label, action, actionTarget, children };
    });
  };
