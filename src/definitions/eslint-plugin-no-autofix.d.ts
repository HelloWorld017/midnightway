declare module 'eslint-plugin-no-autofix' {
  import type { TSESLint } from '@typescript-eslint/utils';

  declare const plugin: TSESLint.FlatConfig.Plugin;
  export default plugin;
}
