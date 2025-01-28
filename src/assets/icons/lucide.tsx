import {
  ChevronDownIcon,
  PowerIcon,
  SpeakerIcon,
  Disc3Icon,
  CpuIcon,
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
  DropletIcon,
  DropletsIcon,
  HazeIcon,
  MoonStarIcon,
  SnowflakeIcon,
  SunIcon,
  RouteOffIcon,
  TornadoIcon,
  BellIcon,
  NetworkIcon,
  WifiIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  FocusIcon,
  RotateCcwIcon,
  LogOutIcon,
  LockIcon,
  CalendarIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';

import type { ComponentProps, ComponentType } from 'react';

const wrapLucideComponent =
  <T extends ComponentType>(LucideIcon: T) =>
  (props: ComponentProps<T>) => {
    const Icon = LucideIcon as ComponentType<{ width: string; height: string }>;
    return <Icon width="1em" height="1em" {...props} />;
  };

export const IconArrowRight = wrapLucideComponent(ArrowRightIcon);
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
export const IconFocus = wrapLucideComponent(FocusIcon);
export const IconHaze = wrapLucideComponent(HazeIcon);
export const IconLock = wrapLucideComponent(LockIcon);
export const IconLogOut = wrapLucideComponent(LogOutIcon);
export const IconMoonStar = wrapLucideComponent(MoonStarIcon);
export const IconNetwork = wrapLucideComponent(NetworkIcon);
export const IconPower = wrapLucideComponent(PowerIcon);
export const IconRotateCcw = wrapLucideComponent(RotateCcwIcon);
export const IconRouteOff = wrapLucideComponent(RouteOffIcon);
export const IconSlidersHorizontal = wrapLucideComponent(SlidersHorizontalIcon);
export const IconSnowflake = wrapLucideComponent(SnowflakeIcon);
export const IconSpeaker = wrapLucideComponent(SpeakerIcon);
export const IconSun = wrapLucideComponent(SunIcon);
export const IconTornado = wrapLucideComponent(TornadoIcon);
export const IconWifi = wrapLucideComponent(WifiIcon);
