import type { repositoryImpl } from './implementations/repository';
import type { Config } from '@/config/schema';
import type { RepositoryProxyDescriptor } from '@/utils/repositoryProxy';

type Otherwise<T> = T & Record<never, never>;

/* Definitions */
export type InitParams = (InitParamsDock | InitParamsStatusBar) & { config: Config };
export type InitParamsDock = { kind: 'dock'; params: { monitor: string } };
export type InitParamsStatusBar = { kind: 'status-bar'; params: { monitor: string } };

export type BridgeMethodsMain = {
  update: (params: { id: string; value: unknown }) => void;
};

export type BridgeMethodsRenderer = {
  initParams: (params: void) => InitParams;
  debug: (params: unknown) => void;
  subscribe: (params: { descriptor: RepositoryProxyDescriptor }) => { id: string; value: unknown };
  unsubscribe: (params: { id: string }) => void;
  setFloating: (params: { state: boolean }) => void;
  setSize: (params: { width: -1 | Otherwise<number>; height: -1 | Otherwise<number> }) => void;
};

export type BridgeRepository = typeof repositoryImpl;
