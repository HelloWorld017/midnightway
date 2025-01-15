import { match } from 'ts-pattern';
import { isObject } from '@/utils/type';
import type { RepositoryProxyDescriptorItem, RepositoryProxyFilter } from './repositoryProxy';

const pickOperator = (value: unknown, pick?: string[]) =>
  pick && value
    ? Object.fromEntries(pick.map(key => [key, (value as Record<string, unknown>)[key]]))
    : value;

const filterPredicate =
  ({ key, predicate, value }: RepositoryProxyFilter) =>
  (item: unknown) =>
    match(predicate)
      .with('is', () => isObject(item) && item[key] === value)
      .exhaustive();

const filterOperator = (array: unknown, filter: RepositoryProxyFilter) =>
  Array.isArray(array) ? array.filter(filterPredicate(filter)) : array;

const findOperator = (array: unknown, filter: RepositoryProxyFilter) =>
  Array.isArray(array) ? array.filter(filterPredicate(filter)) : array;

export const applyDescriptorItem = (
  value: unknown,
  descriptorItem: RepositoryProxyDescriptorItem
) => {
  if (typeof descriptorItem === 'string') {
    return isObject(value) ? value[descriptorItem] : undefined;
  }

  if ('filter' in descriptorItem) {
    return filterOperator(value, descriptorItem.filter);
  }

  if ('find' in descriptorItem) {
    return findOperator(value, descriptorItem.find);
  }

  if ('pick' in descriptorItem) {
    return pickOperator(value, descriptorItem.pick);
  }

  return value;
};
