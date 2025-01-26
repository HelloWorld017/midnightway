import { execAsync, Variable } from 'astal';
import { asConnectable } from '@/utils/binding';

const userName = new Variable<string | null>('');
execAsync(['whoami'])
  .then(value => userName.set(value))
  .catch(() => {});

const sessionStartedAt = Date.now();

export const userRepository = asConnectable({
  userName,
  sessionStartedAt,
});
