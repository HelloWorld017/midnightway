import hash from '@emotion/hash';
import app from 'ags/gtk4/app';
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
  app.apply_css(style);

  styleRegistry.add(rawHash);
  return className;
};
