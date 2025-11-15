import type { ReactNode } from 'react';

export type PowerMenuItem = {
  icon: ReactNode;
  name: string;
  command: string[] | string;
  shouldConfirm?: boolean;
};
