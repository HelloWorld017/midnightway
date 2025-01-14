import { createRepositoryProxy } from '@/utils/proxy';
import type { BridgeRepository } from './types';

export const repo = createRepositoryProxy<BridgeRepository>('');
