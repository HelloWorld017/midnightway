import AstalHyprland from 'gi://AstalHyprland';
import type { BridgeRepository } from '../types';

export const repositoryImpl: BridgeRepository = {
  get hyprland() {
    return AstalHyprland.get_default();
  },
};
