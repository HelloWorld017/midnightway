import { join } from 'path';
import { GLib, readFile } from 'astal';
import { initConfigByValue } from './index';

const configDirectory =
  GLib.getenv('MIDNIGHTWAY_CONFIG_FILE') ??
  join(GLib.getenv('XDG_CONFIG_HOME') ?? '~/.config', 'midnightway/config.json');

try {
  initConfigByValue(JSON.parse(readFile(configDirectory)));
} catch {
  initConfigByValue(undefined);
}
