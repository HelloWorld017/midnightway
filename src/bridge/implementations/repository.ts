import AstalHyprland from 'gi://AstalHyprland';
import AstalMpris from 'gi://AstalMpris';
import AstalNetwork from 'gi://AstalNetwork';
import AstalNotifd from 'gi://AstalNotifd';
import AstalTray from 'gi://AstalTray';
import AstalWp from 'gi://AstalWp';
import GTop from 'gi://GTop';
import type { BridgeRepository } from '../types';

const Performance = GTop.glibtop_init();

export const repositoryImpl: BridgeRepository = {
  get hyprland() {
    return AstalHyprland.get_default();
  },

  get musicPlayer() {
    return AstalMpris.get_default();
  },

  get network() {
    return AstalNetwork.get_default();
  },

  get notification() {
    return AstalNotifd.get_default();
  },

  get performance() {
    return Performance;
  },

  get sound() {
    return AstalWp.get_default();
  },

  get tray() {
    return AstalTray.get_default();
  },
};
