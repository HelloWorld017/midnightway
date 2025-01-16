import IconWorkspace1 from './workspace-1.svg';
import IconWorkspace10 from './workspace-10.svg';
import IconWorkspace2 from './workspace-2.svg';
import IconWorkspace3 from './workspace-3.svg';
import IconWorkspace4 from './workspace-4.svg';
import IconWorkspace5 from './workspace-5.svg';
import IconWorkspace6 from './workspace-6.svg';
import IconWorkspace7 from './workspace-7.svg';
import IconWorkspace8 from './workspace-8.svg';
import IconWorkspace9 from './workspace-9.svg';
import type { ReactNode, SVGProps } from 'react';

export { default as IconLauncher } from './launcher.svg';
export { default as IconMusic } from './music.svg';

export const IconSetWorkspace = ({
  kind,
  fallback,
  ...props
}: { kind: number; fallback?: ReactNode } & SVGProps<SVGSVGElement>) => {
  const Component = [
    null,
    IconWorkspace1,
    IconWorkspace2,
    IconWorkspace3,
    IconWorkspace4,
    IconWorkspace5,
    IconWorkspace6,
    IconWorkspace7,
    IconWorkspace8,
    IconWorkspace9,
    IconWorkspace10,
  ][kind];

  return Component ? <Component {...props} /> : fallback;
};
