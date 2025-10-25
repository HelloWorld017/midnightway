import {
  ArrowRightIcon,
  AudioLinesIcon,
  BatteryIcon,
  BatteryChargingIcon,
  BatteryFullIcon,
  BatteryLowIcon,
  BatteryMediumIcon,
  BatteryWarningIcon,
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloudDrizzleIcon,
  CloudFogIcon,
  CloudHailIcon,
  CloudLightningIcon,
  CloudMoonRainIcon,
  CloudMoonIcon,
  CloudRainWindIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudSunRainIcon,
  CloudSunIcon,
  CloudIcon,
  CloudyIcon,
  CpuIcon,
  Disc3Icon,
  DropletIcon,
  DropletsIcon,
  FastForwardIcon,
  FocusIcon,
  HazeIcon,
  LockIcon,
  LogOutIcon,
  MoonStarIcon,
  NetworkIcon,
  PowerIcon,
  RewindIcon,
  RotateCcwIcon,
  RouteOffIcon,
  SlidersHorizontalIcon,
  SnowflakeIcon,
  SpeakerIcon,
  SunIcon,
  TornadoIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
  WifiIcon,
  XIcon,
} from 'lucide-react';

import type { ComponentProps, ComponentType } from 'react';

const wrapLucideComponent =
  <T extends ComponentType>(LucideIcon: T) =>
  (props: ComponentProps<T>) => {
    const Icon = LucideIcon as ComponentType<{ width: string; height: string }>;
    return <Icon width="1em" height="1em" {...props} />;
  };

export const IconArrowRight = wrapLucideComponent(ArrowRightIcon);
export const IconAudioLines = wrapLucideComponent(AudioLinesIcon);
export const IconBattery = wrapLucideComponent(BatteryIcon);
export const IconBatteryCharging = wrapLucideComponent(BatteryChargingIcon);
export const IconBatteryFull = wrapLucideComponent(BatteryFullIcon);
export const IconBatteryLow = wrapLucideComponent(BatteryLowIcon);
export const IconBatteryMedium = wrapLucideComponent(BatteryMediumIcon);
export const IconBatteryWarning = wrapLucideComponent(BatteryWarningIcon);
export const IconBell = wrapLucideComponent(BellIcon);
export const IconCalendar = wrapLucideComponent(CalendarIcon);
export const IconChevronDown = wrapLucideComponent(ChevronDownIcon);
export const IconChevronUp = wrapLucideComponent(ChevronUpIcon);
export const IconCloudDrizzle = wrapLucideComponent(CloudDrizzleIcon);
export const IconCloudFog = wrapLucideComponent(CloudFogIcon);
export const IconCloudHail = wrapLucideComponent(CloudHailIcon);
export const IconCloudLightning = wrapLucideComponent(CloudLightningIcon);
export const IconCloudMoonRain = wrapLucideComponent(CloudMoonRainIcon);
export const IconCloudMoon = wrapLucideComponent(CloudMoonIcon);
export const IconCloudRainWind = wrapLucideComponent(CloudRainWindIcon);
export const IconCloudRain = wrapLucideComponent(CloudRainIcon);
export const IconCloudSnow = wrapLucideComponent(CloudSnowIcon);
export const IconCloudSunRain = wrapLucideComponent(CloudSunRainIcon);
export const IconCloudSun = wrapLucideComponent(CloudSunIcon);
export const IconCloud = wrapLucideComponent(CloudIcon);
export const IconCloudy = wrapLucideComponent(CloudyIcon);
export const IconCpu = wrapLucideComponent(CpuIcon);
export const IconDisc3 = wrapLucideComponent(Disc3Icon);
export const IconDroplet = wrapLucideComponent(DropletIcon);
export const IconDroplets = wrapLucideComponent(DropletsIcon);
export const IconFastForward = wrapLucideComponent(FastForwardIcon);
export const IconFocus = wrapLucideComponent(FocusIcon);
export const IconHaze = wrapLucideComponent(HazeIcon);
export const IconLock = wrapLucideComponent(LockIcon);
export const IconLogOut = wrapLucideComponent(LogOutIcon);
export const IconMoonStar = wrapLucideComponent(MoonStarIcon);
export const IconNetwork = wrapLucideComponent(NetworkIcon);
export const IconPower = wrapLucideComponent(PowerIcon);
export const IconRewind = wrapLucideComponent(RewindIcon);
export const IconRotateCcw = wrapLucideComponent(RotateCcwIcon);
export const IconRouteOff = wrapLucideComponent(RouteOffIcon);
export const IconSlidersHorizontal = wrapLucideComponent(SlidersHorizontalIcon);
export const IconSnowflake = wrapLucideComponent(SnowflakeIcon);
export const IconSpeaker = wrapLucideComponent(SpeakerIcon);
export const IconSun = wrapLucideComponent(SunIcon);
export const IconTornado = wrapLucideComponent(TornadoIcon);
export const IconVolume1 = wrapLucideComponent(Volume1Icon);
export const IconVolume2 = wrapLucideComponent(Volume2Icon);
export const IconVolumeX = wrapLucideComponent(VolumeXIcon);
export const IconWifi = wrapLucideComponent(WifiIcon);
export const IconX = wrapLucideComponent(XIcon);
