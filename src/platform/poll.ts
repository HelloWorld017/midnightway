import { createPoll } from 'ags/time';

export const poll = <T>(initial: T, interval: number, update: (previous: T) => Promise<T>) =>
  createPoll(initial, interval, async previous => {
    try {
      return await update(previous);
    } catch (error) {
      console.error(error);
      return previous;
    }
  });
