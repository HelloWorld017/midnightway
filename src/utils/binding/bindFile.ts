import { readFileAsync, Variable } from 'astal';

export const bindFile = <T>(
  path: string | null,
  transform: (content: string) => T,
  interval: number
): Variable<T | null> => {
  const variable = new Variable<T | null>(null);
  if (!path) {
    return variable;
  }

  const intervalId = setInterval(async () => {
    try {
      const content = await readFileAsync(path);
      variable.set(transform(content));
    } catch (err) {
      console.error(err);
    }
  }, interval);

  return variable.onDropped(() => clearInterval(intervalId));
};
