import { match, P } from 'ts-pattern';
import { isObject } from '@/utils/type';
import type { RepositoryProxyDescriptorItem, RepositoryProxyFilter } from './repositoryProxy';

type Binder<T = string> = (object: unknown, target: T) => () => void;

/* Utils */
const filterPredicate =
  ({ key, predicate, value }: RepositoryProxyFilter) =>
  (item: unknown) =>
    match(predicate)
      .with('is', () => isObject(item) && item[key] === value)
      .exhaustive();

const bindArray = <T>(array: unknown, target: T, binder: Binder<T>) => {
  const cleanups = Array.isArray(array) ? array.map(item => binder(item, target)) : [];
  return () => cleanups.forEach(cleanup => cleanup());
};

/* Implementations */
const pickOperator = (value: unknown, pick: string[]) =>
  isObject(value) ? Object.fromEntries(pick.map(key => [key, value[key]])) : value;

const bindPickOperator = (value: unknown, pick: string[], binder: Binder) =>
  bindArray(pick, value, (key, item) => binder(item, key as string));

const filterOperator = (array: unknown, filter: RepositoryProxyFilter) =>
  Array.isArray(array) ? array.filter(filterPredicate(filter)) : array;

const bindFilterOperator = (array: unknown, filter: RepositoryProxyFilter, binder: Binder) =>
  bindArray(array, filter.key, binder);

const findOperator = (array: unknown, filter: RepositoryProxyFilter) =>
  Array.isArray(array) ? (array.find(filterPredicate(filter)) as unknown) : array;

const bindFindOperator = (array: unknown, filter: RepositoryProxyFilter, binder: Binder) =>
  bindArray(array, filter.key, binder);

const invokeOperator = (fn: unknown, invoke: unknown[]) =>
  typeof fn === 'function' ? (fn as (...args: unknown[]) => unknown)(...invoke) : fn;

const invokeMethodOperator = (value: unknown, invokeMethod: { key: string; params: unknown[] }) =>
  isObject(value) && typeof value[invokeMethod.key] === 'function'
    ? (value[invokeMethod.key] as (...args: unknown[]) => unknown)(...invokeMethod.params)
    : value;

/* Apply */
export const applyDescriptorItem = (
  value: unknown,
  descriptorItem: RepositoryProxyDescriptorItem
) =>
  match(descriptorItem)
    .with(P.string, key => (isObject(value) ? value[key] : undefined))
    .with({ filter: P.select() }, filter => filterOperator(value, filter))
    .with({ find: P.select() }, find => findOperator(value, find))
    .with({ pick: P.select() }, pick => pickOperator(value, pick))
    .with({ invoke: P.select() }, invoke => invokeOperator(value, invoke))
    .with({ invokeMethod: P.select() }, invokeMethod => invokeMethodOperator(value, invokeMethod))
    .exhaustive();

export const bindDescriptorItem = (
  value: unknown,
  descriptorItem: RepositoryProxyDescriptorItem,
  binder: Binder
) =>
  match(descriptorItem)
    .with(P.string, key => (isObject(value) ? binder(value, key) : () => {}))
    .with({ filter: P.select() }, filter => bindFilterOperator(value, filter, binder))
    .with({ find: P.select() }, find => bindFindOperator(value, find, binder))
    .with({ pick: P.select() }, pick => bindPickOperator(value, pick, binder))
    .with({ invoke: P.select() }, () => () => {})
    .with({ invokeMethod: P.select() }, () => () => {})
    .exhaustive();
