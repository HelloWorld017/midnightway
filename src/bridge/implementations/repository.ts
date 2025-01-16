import AstalHyprland from 'gi://AstalHyprland';
import AstalMpris from 'gi://AstalMpris';
import type { BridgeRepository } from '../types';

export const repositoryImpl: BridgeRepository = {
  get musicPlayer() {
    return AstalMpris.get_default();
  },

  get hyprland() {
    return AstalHyprland.get_default();
  },
};
