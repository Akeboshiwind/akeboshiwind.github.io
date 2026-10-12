const IMPORT = /^import .* from .*;$/;
const EXPORT = /^export (?:const|let|function|async function|class) /;

/**
 * Joins ES modules into one classic-script IIFE, for an `is:inline` script that must run before first paint.
 * Each module may only use one-line `import … from …;` (dropped: the modules are concatenated in dependency
 * order) and `export` on declarations (the keyword is dropped).
 *
 * @param {string[]} sources module sources, dependencies first
 * @param {string} entry statement run after the modules, e.g. `'ditherAll();'`
 * @returns {string}
 * @throws if any module uses other module syntax, which would otherwise ship as a syntax error
 */
export function inlineScript(sources, entry) {
  const body = sources.map((source) => source.split('\n').map((line) => {
    if (line.startsWith('import')) {
      if (!IMPORT.test(line)) throw new Error(`inlineScript: unsupported module syntax: ${line}`);
      return '';
    }
    if (line.startsWith('export')) {
      if (!EXPORT.test(line)) throw new Error(`inlineScript: unsupported module syntax: ${line}`);
      return line.slice('export '.length);
    }
    return line;
  }).join('\n')).join('\n');
  return `(() => {\n${body}\n${entry}\n})();`;
}
