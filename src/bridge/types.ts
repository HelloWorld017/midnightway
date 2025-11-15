import type { Config } from '@/config/schema';
import type { repositoryImpl } from '@/repository';
import type { RepositoryProxyDescriptor } from '@/utils/repositoryProxy';

/* Definitions */
export type InitParams = (InitParamsDock | InitParamsStatusBar | InitParamsOverlay) & {
  config: Config;
};

export type InitParamsDock = { kind: 'dock'; params: { monitor: string } };
export type InitParamsOverlay = { kind: 'overlay'; params: { monitor: string } };
export type InitParamsStatusBar = { kind: 'status-bar'; params: { monitor: string } };

export type MenuNodeKind = 'item' | 'section' | 'submenu';
export type MenuNode = {
  kind: MenuNodeKind;
  label: string;
  action: string | null;
  actionTarget: string | null;
  children: RepositoryProxyDescriptor | null;
};

/* Bridge */
export type BridgeMethodsMain = {
  zygoteFork: (params: { id: string; initParams: InitParams }) => void;
  zygoteRelease: (params: { id: string }) => void;
  onUpdate: (params: { id: string; value: unknown }) => void;
  onHiddenChange: (params: { isHidden: boolean }) => void;
  onOverlayCloseRequest: (params: void) => void;
};

export type BridgeMethodsRenderer = {
  initParams: (params: void) => InitParams;
  debug: (params: unknown) => void;
  subscribe: (params: { descriptor: RepositoryProxyDescriptor }) => { id: string; value: unknown };
  unsubscribe: (params: { id: string }) => void;
  exec: (params: { command: string | string[] }) => void;
  invoke: (params: { descriptor: RepositoryProxyDescriptor; returning: boolean }) => unknown;
  invokeGAction: (params: {
    descriptor: RepositoryProxyDescriptor;
    action: string;
    actionTarget: string | null;
  }) => unknown;
  traverseMenu: (params: { descriptor: RepositoryProxyDescriptor }) => MenuNode[];
};

export type BridgeRepository = typeof repositoryImpl;
