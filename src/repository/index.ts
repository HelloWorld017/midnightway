import AstalHyprland from 'gi://AstalHyprland';
import AstalMpris from 'gi://AstalMpris';
import AstalTray from 'gi://AstalTray';
import AstalWp from 'gi://AstalWp';
import { controlCenterRepository } from './controlCenter';
import { networkRepository } from './network';
import { notificationRepository } from './notification';
import { performanceRepository } from './performance';
import { temperatureRepository } from './temperature';
import { userRepository } from './user';
import { weatherRepository } from './weather';

const hyprlandRepository = AstalHyprland.get_default();
const musicPlayerRepository = AstalMpris.get_default();
const soundRepository = AstalWp.get_default()!;
const trayRepository = AstalTray.get_default();

export const repositoryImpl = {
  get controlCenter() {
    return controlCenterRepository;
  },

  get hyprland() {
    return hyprlandRepository;
  },

  get musicPlayer() {
    return musicPlayerRepository;
  },

  get network() {
    return networkRepository;
  },

  get notification() {
    return notificationRepository;
  },

  get performance() {
    return performanceRepository;
  },

  get sound() {
    return soundRepository;
  },

  get temperatures() {
    return temperatureRepository;
  },

  get tray() {
    return trayRepository;
  },

  get weather() {
    return weatherRepository;
  },

  get user() {
    return userRepository;
  },
};
