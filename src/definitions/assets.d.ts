declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react';

  declare const component: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default component;
}
