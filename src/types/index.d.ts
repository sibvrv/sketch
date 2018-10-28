declare module '*.less';

/**
 * extends preact HTMLAttributes
 */
declare namespace JSX {
  interface HTMLAttributes {
    class?: string | any[] | object;
  }
}

declare var __DEV__: boolean;
declare var __PROD__: boolean;
