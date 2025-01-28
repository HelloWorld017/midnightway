export enum NetworkState {
  UNKNOWN = 0,
  ASLEEP = 10,
  DISCONNECTED = 20,
  DISCONNECTING = 30,
  CONNECTING = 40,
  CONNECTED_LOCAL = 50,
  CONNECTED_SITE = 60,
  CONNECTED_GLOBAL = 70,
}

export enum NetworkPrimary {
  WIRED = 1,
  WIFI = 2,
}

export enum PlaybackStatus {
  PLAYING = 0,
  PAUSED = 1,
  STOPPED = 2,
}
