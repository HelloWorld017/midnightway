import { execAsync } from 'ags/process';
import { match } from 'ts-pattern';
import { config } from '@/config';
import { asConnectable, poll, writable } from '@/utils/binding';
import type { ControlCenterState, GeneratedId } from '@/config/schema';
import type { Accessor } from 'ags';

const repositoryItem = config()
  .controlCenter.items.flat()
  .map(item => ('state' in item ? ([item.id, item.state] as const) : null))
  .filter(state => !!state);

const asVariable = (state: ControlCenterState<unknown>) =>
  match(state)
    .returnType<Accessor<unknown>>()
    .with({ kind: 'default' }, state => writable(state.defaultState))
    .with({ kind: 'poll' }, state =>
      poll<unknown>(null, state.pollInterval, () => execAsync(state.pollCommand))
    )
    .with({ kind: 'init' }, state => {
      const variable = writable<unknown>(null);
      execAsync(state.initCommand)
        .then(value => variable.set(value))
        .catch(() => {});

      return variable;
    })
    .exhaustive();

export const controlCenterRepository = {
  items: asConnectable(
    Object.fromEntries(repositoryItem.map(([key, state]) => [key, asVariable(state)] as const)) as {
      [K in GeneratedId]: Accessor<unknown>;
    }
  ),
};
