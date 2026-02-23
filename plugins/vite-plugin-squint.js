import { compileString } from 'squint-cljs/node-api.js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const CLJS_RE = /\.cljs$/;
const VIRTUAL_PREFIX = '\0';

export default function squintPlugin(opts = {}) {
  return {
    name: 'vite-plugin-squint',
    enforce: 'pre',

    resolveId(source, importer) {
      // Handle .cljs imports directly
      if (CLJS_RE.test(source)) {
        const resolved = importer
          ? resolve(dirname(importer.replace(VIRTUAL_PREFIX, '')), source)
          : resolve(source);
        return VIRTUAL_PREFIX + resolved + '.jsx';
      }

      // Handle .js imports that are actually .cljs files (Squint compiles requires to .js)
      if (source.endsWith('.js') && importer?.includes('.cljs')) {
        const importerClean = importer.replace(VIRTUAL_PREFIX, '').replace(/\.jsx$/, '');
        const dir = dirname(importerClean);
        const jsPath = resolve(dir, source);
        if (!existsSync(jsPath)) {
          const cljsPath = jsPath.replace(/\.js$/, '.cljs');
          if (existsSync(cljsPath)) {
            return VIRTUAL_PREFIX + cljsPath + '.jsx';
          }
        }
      }
    },

    async load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) return;
      const cleanId = id.slice(VIRTUAL_PREFIX.length);
      if (!cleanId.endsWith('.cljs.jsx')) return;

      const cljsPath = cleanId.slice(0, -4); // remove .jsx to get .cljs
      if (!existsSync(cljsPath)) {
        this.error(`Squint source file not found: ${cljsPath}`);
        return;
      }
      const source = readFileSync(cljsPath, 'utf-8');
      const result = await compileString(source, {
        context: 'module',
        'elide-imports': false,
        ...opts,
      });
      let js = result.javascript;

      // Squint doesn't always emit semicolons between top-level statements.
      // Insert semicolons where a closing paren is immediately followed by a new statement.
      js = js.replace(/\)\)(?=\s*(?:var |const |let |function |\w))/g, '));\n');

      // Rewrite relative imports to be relative to the original .cljs file location
      const dir = dirname(cljsPath);
      const rewritten = js.replace(
        /from\s+["'](\.[^"']+)["']/g,
        (match, importPath) => {
          const abs = resolve(dir, importPath);
          return `from "${abs}"`;
        }
      ).replace(
        /import\s+["'](\.[^"']+)["']/g,
        (match, importPath) => {
          const abs = resolve(dir, importPath);
          return `import "${abs}"`;
        }
      );

      return { code: rewritten, map: null };
    },

    handleHotUpdate({ file, server }) {
      if (!CLJS_RE.test(file)) return;

      const virtualId = VIRTUAL_PREFIX + file + '.jsx';
      const mod = server.moduleGraph.getModuleById(virtualId);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
        return [mod];
      }
    },
  };
}
