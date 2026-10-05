import { readFileAsync } from 'ags/file';
import { poll } from '@/platform/poll';
import { writable } from '@/platform/reactivity';
import type { Accessor } from 'ags';

export const bindFile = <T>(
  path: string | null,
  transform: (content: string) => T,
  interval: number
): Accessor<T | null> => {
  if (!path) {
    return writable<T | null>(null);
  }

  return poll<T | null>(null, interval, async () => transform(await readFileAsync(path)));
};
