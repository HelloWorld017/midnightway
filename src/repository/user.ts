import { execAsync } from 'ags/process';
import { asConnectable, writable } from '@/utils/binding';

const userName = writable<string | null>('');
execAsync(['whoami'])
  .then(value => userName.set(value))
  .catch(() => {});

const sessionStartedAt = Date.now();

export const userRepository = asConnectable({
  userName,
  sessionStartedAt,
});
