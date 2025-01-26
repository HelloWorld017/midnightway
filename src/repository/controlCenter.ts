import { Variable, execAsync } from 'astal';
import { match } from 'ts-pattern';
import { config } from '@/config';
import { asConnectable } from '@/utils/binding';
import type { ControlCenterState, GeneratedId } from '@/config/schema';

const repositoryItem = config()
  .controlCenter.items.flat()
  .map(item => ('state' in item ? ([item.id, item.state] as const) : null))
  .filter(state => !!state);

const asVariable = (state: ControlCenterState<unknown>) =>
  match(state)
    .returnType<Variable<unknown>>()
    .with({ kind: 'default' }, state => Variable(state.defaultState))
    .with({ kind: 'poll' }, state => Variable(null).poll(state.pollInterval, state.pollCommand))
    .with({ kind: 'init' }, state => {
      const variable = Variable<unknown>(null);
      execAsync(state.initCommand)
        .then(value => variable.set(value))
        .catch(() => {});

      return variable;
    })
    .exhaustive();

export const controlCenterRepository = {
  items: asConnectable(
    Object.fromEntries(repositoryItem.map(([key, state]) => [key, asVariable(state)] as const)) as {
      [K in GeneratedId]: Variable<unknown>;
    }
  ),
};
