import { createRepositoryProxy } from '@/utils/repositoryProxy';
import type { BridgeRepository } from './types';

export const repo = createRepositoryProxy<BridgeRepository, BridgeRepository>(['']);
