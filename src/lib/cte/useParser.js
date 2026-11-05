import { useEffect, useRef, useState } from 'react';

/**
 * Parses SQL in a Web Worker, since the parser is 734 kB and a long query takes seconds. The state is idle until the
 * first run, then parsing, then parsed with what `parse` returned.
 */
export function useParser() {
  const [state, setState] = useState({ kind: 'idle' });
  const worker = useRef(null);

  useEffect(() => {
    const w = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    w.addEventListener('message', (e) => setState({ kind: 'parsed', parsed: e.data }));
    w.addEventListener('error', (e) => setState({
      kind: 'parsed',
      parsed: { ok: false, error: e.message ? `The parser failed: ${e.message}` : 'The parser failed to load.' },
    }));
    worker.current = w;
    return () => w.terminate();
  }, []);

  const run = (sql) => {
    setState({ kind: 'parsing' });
    worker.current.postMessage(sql);
  };

  return [state, run];
}
