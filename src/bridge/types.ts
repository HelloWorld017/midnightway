import type { Config } from '@/config/schema';
import type { RepositoryProxyDescriptor } from '@/utils/repositoryProxy';
import type AstalHyprland from 'gi://AstalHyprland';
import type AstalMpris from 'gi://AstalMpris';
import type AstalNetwork from 'gi://AstalNetwork';
import type AstalNotifd from 'gi://AstalNotifd';
import type AstalTray from 'gi://AstalTray';
import type AstalWp from 'gi://AstalWp';
import type GTop from 'gi://GTop';

/* Definitions */
export type InitParams = (InitParamsDock | InitParamsStatusBar) & { config: Config };
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
  network: AstalNetwork.Network;
  notification: AstalNotifd.Notifd;
  performance: GTop.glibtop;
  sound: AstalWp.Wp;
  tray: AstalTray.Tray;
};
