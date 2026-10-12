import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { inlineScript } from './inline-script.js';

describe('inlineScript', () => {
  it('turns the theme module into a classic script that parses', () => {
    const code = inlineScript([readFileSync('src/lib/theme-init.js', 'utf8')], 'initTheme();');
    expect(() => new Function(code)).not.toThrow();
    expect(code).not.toMatch(/^\s*(import|export)\b/m);
  });

  it('refuses module syntax it cannot strip', () => {
    expect(() => inlineScript(['import {\n  a,\n} from "./a.js";'], '')).toThrow(/module syntax/);
    expect(() => inlineScript(['export default 1;'], '')).toThrow(/module syntax/);
  });
});
