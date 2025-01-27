declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

declare global {
  declare namespace ReactJSX {
    export = React.JSX;
  }
}

export {};
