import { defineConfig } from '@farmfe/core';
import less from '@farmfe/js-plugin-less';
import type { JsPlugin } from '@farmfe/core';

const extractStyles: JsPlugin = {
  name: 'plugin-extract-styles',
  finalizeResources: {
    executor(param) {
      const resourceMap = Object.entries(param.resourcesMap);
      const styles = resourceMap
        .map(([, resource]) => resource)
        .filter(resource => resource.resourceType === 'css');

      const styleNames = new Set(styles.map(style => style.name));

      const output = resourceMap
        .filter(([, resource]) => !styleNames.has(resource.name))
        .map(([name, resource]) => {
          if (
            resource.resourceType !== 'js' ||
            !resource.info?.data.isEntry ||
            !resource.bytes
          ) {
            return [name, resource] as const;
          }

          const content = Buffer.from(resource.bytes)
            .toString('utf-8')
            .replaceAll(
              'import.meta.CSS_PATHS',
              JSON.stringify(Array.from(styleNames))
            );

          const newResource = {
            ...resource,
            bytes: [...Buffer.from(content, 'utf-8')],
          };

          return [name, newResource] as const;
        });

      return Object.fromEntries(output);
    },
  },
};

export default defineConfig({
  compilation: {
    input: {
      index: './src/index.tsx',
    },
    output: {
      path: 'dist',
      targetEnv: 'library',
    },
    script: {
      target: 'es2022',
    },
    assets: {
      mode: 'browser',
    },
    external: [
      '^cairo$',
      '^console$',
      '^gettext$',
      '^system$',
      '^file://.*',
      '^gi://.*',
      '^resource://.*',
    ],
    minify: process.env.BUILD_MODE === 'development',
  },
  plugins: [
    less(),
    extractStyles,
    [
      '@farmfe/plugin-react',
      {
        importSource: 'astal/gtk4',
        development: false,
        refresh: false,
      },
    ],
  ],
});
