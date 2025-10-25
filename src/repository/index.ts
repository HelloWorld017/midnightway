import AstalBattery from 'gi://AstalBattery';
import AstalHyprland from 'gi://AstalHyprland';
import AstalMpris from 'gi://AstalMpris';
import AstalNotifd from 'gi://AstalNotifd';
import AstalTray from 'gi://AstalTray';
import AstalWp from 'gi://AstalWp';
import { controlCenterRepository } from './controlCenter';
import { networkRepository } from './network';
import { performanceRepository } from './performance';
import { temperatureRepository } from './temperature';
import { userRepository } from './user';
import { weatherRepository } from './weather';

const batteryRepository = AstalBattery.get_default();
const hyprlandRepository = AstalHyprland.get_default();
const musicPlayerRepository = AstalMpris.get_default();
const notificationRepository = AstalNotifd.get_default();
const soundRepository = AstalWp.get_default()!;
const trayRepository = AstalTray.get_default();

export const repositoryImpl = {
  get battery() {
    return batteryRepository;
  },

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
