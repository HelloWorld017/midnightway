import { readFile } from 'ags/file';
import GLib from 'gi://GLib?version=2.0';
import { initConfigByValue } from './index';

const configDirectory =
  GLib.getenv('MIDNIGHTWAY_CONFIG_FILE') ??
  GLib.build_filenamev([GLib.get_user_config_dir(), 'midnightway/config.json']);

try {
  initConfigByValue(JSON.parse(readFile(configDirectory)));
} catch {
  initConfigByValue(undefined);
}
