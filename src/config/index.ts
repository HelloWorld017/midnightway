import { join } from 'path';
import { ConfigSchema, type Config } from './schema';
import { IS_RENDERER } from '#meta';

let configValue: Config | null = null;

export const config = (): Config => {
  if (configValue === null) {
    throw new Error('Config is not set!');
  }

  return configValue;
};

export const updateConfig = (nextConfig: unknown) => {
  const parsedConfig = ConfigSchema.parse(nextConfig);
  configValue = parsedConfig;
};

if (!IS_RENDERER) {
  const { GLib, readFile } = await import('astal');
  const configDirectory = join(
    GLib.getenv('XDG_CONFIG_HOME') ?? '~/.config',
    'midnightway/config.json'
  );

  updateConfig(JSON.parse(readFile(configDirectory)));
}
