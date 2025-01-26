import type { Config } from '@/config/schema';
import type { repositoryImpl } from '@/repository';
import type { RepositoryProxyDescriptor } from '@/utils/repositoryProxy';

/* Definitions */
export type InitParams = (InitParamsCalendar | InitParamsDock | InitParamsStatusBar) & {
  config: Config;
};

export type InitParamsCalendar = { kind: 'calendar'; params: Record<string, never> };
export type InitParamsDock = { kind: 'dock'; params: { monitor: string } };
export type InitParamsStatusBar = { kind: 'status-bar'; params: { monitor: string } };

/* Bridge */
export type BridgeMethodsMain = {
  onUpdate: (params: { id: string; value: unknown }) => void;
  onToolkitCloseRequest: (params: void) => void;
};

export type BridgeMethodsRenderer = {
  initParams: (params: void) => InitParams;
  debug: (params: unknown) => void;
  subscribe: (params: { descriptor: RepositoryProxyDescriptor }) => { id: string; value: unknown };
  unsubscribe: (params: { id: string }) => void;
  prepareOpenToolkit: (params: void) => void;
  closeToolkit: (params: void) => void;
  exec: (params: { command: string | string[] }) => void;
  invoke: (params: {
    descriptor: RepositoryProxyDescriptor;
    returnValue: RepositoryProxyDescriptor | null;
  }) => unknown;
};

export type BridgeRepository = typeof repositoryImpl;
