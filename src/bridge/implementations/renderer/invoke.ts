import { repositoryImpl } from '@/repository';
import { createRepositoryProxy } from '@/utils/repositoryProxy';
import { bindRepositoryProxy } from '@/utils/repositoryProxy/bind';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const invokeImpl =
  (_: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['invoke'] =>
  ({ descriptor, returning }) => {
    const bindable = bindRepositoryProxy(createRepositoryProxy(descriptor), repositoryImpl);
    const result = bindable.get();
    return returning ? result : null;
  };
