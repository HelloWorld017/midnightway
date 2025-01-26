import { match } from 'ts-pattern';
import { ControlCenterItemButton } from './ControlCenterItemButton';
import type { ControlCenterItem as ControlCenterItemType } from '@/config/schema';

export const ControlCenterItem = ({ item }: { item: ControlCenterItemType }) =>
  match(item)
    .with({ kind: 'button' }, button => <ControlCenterItemButton item={button} />)
    .otherwise(() => null);
