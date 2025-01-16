import type { RepositoryProxyDescriptor } from '@/utils/repositoryProxy';
import type AstalHyprland from 'gi://AstalHyprland';
import type AstalMpris from 'gi://AstalMpris';

/* Definitions */
export type InitParams = InitParamsDock | InitParamsStatusBar;
export type InitParamsDock = { kind: 'dock'; params: { monitor: string } };
export type InitParamsStatusBar = { kind: 'status-bar'; params: { monitor: string } };

export type BridgeMethodsMain = {
  update: (params: { id: string; value: unknown }) => void;
};

export type BridgeMethodsRenderer = {
  initParams: (params: void) => InitParams;
  subscribe: (params: { descriptor: RepositoryProxyDescriptor }) => { id: string; value: unknown };
  unsubscribe: (params: { id: string }) => void;
};

export type BridgeRepository = {
  hyprland: AstalHyprland.Hyprland;
  musicPlayer: AstalMpris.Mpris;
};
