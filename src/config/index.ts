import { zConfig, type Config } from './schema';

let configValue: Config | null = null;

export const config = (): Config => {
  if (configValue === null) {
    throw new Error('Config is not set!');
  }

  return configValue;
};

export const initConfigByValue = (nextConfig: unknown) => {
  const parsedConfig = zConfig.parse(nextConfig);
  configValue = parsedConfig;
};
