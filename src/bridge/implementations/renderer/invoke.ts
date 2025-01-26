import { repositoryImpl } from '@/repository';
import { createRepositoryProxy } from '@/utils/repositoryProxy';
import { bindRepositoryProxy } from '@/utils/repositoryProxy/bind';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const invokeImpl =
  (_: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['invoke'] =>
  ({ descriptor, returnValue }) => {
    const bindable = bindRepositoryProxy(createRepositoryProxy(descriptor), repositoryImpl);
    if (!returnValue) {
      return null;
    }

    const returnValueBindable = bindRepositoryProxy(
      createRepositoryProxy(returnValue),
      bindable.get() as Record<string, unknown>
    );

    return returnValueBindable.get();
  };
