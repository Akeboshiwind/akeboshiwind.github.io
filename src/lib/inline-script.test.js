import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { inlineScript } from './inline-script.js';

describe('inlineScript', () => {
  it('turns the dither modules into a classic script that parses', () => {
    const sources = ['src/lib/dither.js', 'src/lib/dither-dom.js'].map((f) => readFileSync(f, 'utf8'));
    const code = inlineScript(sources, 'ditherAll();');
    expect(() => new Function(code)).not.toThrow();
    expect(code).not.toMatch(/^\s*(import|export)\b/m);
  });

  it('refuses module syntax it cannot strip', () => {
    expect(() => inlineScript(['import {\n  a,\n} from "./a.js";'], '')).toThrow(/module syntax/);
    expect(() => inlineScript(['export default 1;'], '')).toThrow(/module syntax/);
  });
});
