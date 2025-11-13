export type ContextMenuAction = Record<never, never> & { __kind?: 'ContextMenuAction' };
export type ContextMenuToken = Record<never, never> & { __kind?: 'ContextMenuToken' };
export type ContextMenuNode<T = ContextMenuToken, TAction = ContextMenuAction> = {
  kind: 'item' | 'submenu' | 'section';
  label: string;
  action: TAction | null;
  children: T | null;
};

export type ContextMenuModel<T, TAction> = {
  root: T;
  key(token: T): string;
  traverse(node: T): PossiblyPromise<ContextMenuNode<T, TAction>[]>;
  action(action: TAction): void;
};
