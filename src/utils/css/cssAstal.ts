import hash from '@emotion/hash';
import { App } from 'astal/gtk4';
import { compile, serialize, stringify } from 'stylis';

const stylePrefix = 'css-';
const styleRegistry = new Set<string>();

export const cssAstal = (template: TemplateStringsArray, ...args: unknown[]) => {
  const raw = String.raw(template, ...args);
  const rawHash = hash(raw);
  const className = `${stylePrefix}${rawHash}`;

  if (styleRegistry.has(rawHash)) {
    return className;
  }

  const style = serialize(compile(`.${className} { ${raw} }`), stringify);
  App.apply_css(style);

  styleRegistry.add(rawHash);
  return className;
};
