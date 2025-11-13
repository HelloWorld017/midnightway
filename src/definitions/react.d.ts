declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

declare global {
  declare namespace JSX {
    // To fix `animated` in react-spring
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }

  declare namespace ReactJSX {
    export = React.JSX;
  }
}

export {};
