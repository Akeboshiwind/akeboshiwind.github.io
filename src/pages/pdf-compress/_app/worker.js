// Web worker that lazily loads Ghostscript WASM from a CDN and runs PDF
// compression. Posts progress updates back to the main thread so the UI
// can show what's happening.

const GS_VERSION = '0.0.2';
const CDN_BASE = `https://cdn.jsdelivr.net/npm/@jspawn/ghostscript-wasm@${GS_VERSION}/`;

let gsPromise = null;
let totalPages = 0;
let currentPage = 0;

function send(msg, transfer) {
  if (transfer) self.postMessage(msg, transfer);
  else self.postMessage(msg);
}

function handleStdout(text) {
  // "Processing pages 1 through N." gives us the total.
  const total = text.match(/Processing pages \d+ through (\d+)/);
  if (total) {
    totalPages = parseInt(total[1], 10);
    send({ type: 'progress', stage: 'compressing', current: 0, total: totalPages });
    return;
  }
  // "Page N" fires for each rendered page.
  const page = text.match(/^Page (\d+)/);
  if (page) {
    currentPage = parseInt(page[1], 10);
    send({ type: 'progress', stage: 'compressing', current: currentPage, total: totalPages });
  }
}

async function loadGhostscript() {
  if (gsPromise) return gsPromise;
  send({ type: 'progress', stage: 'loading' });
  gsPromise = (async () => {
    // Vite would otherwise try to resolve this at build time.
    const mod = await import(/* @vite-ignore */ CDN_BASE + 'gs.mjs');
    const init = mod.default;
    return init({
      locateFile: (file) => CDN_BASE + file,
      print: handleStdout,
      printErr: handleStdout,
    });
  })();
  return gsPromise;
}

self.addEventListener('message', async (e) => {
  const { type } = e.data;
  if (type === 'preload') {
    try { await loadGhostscript(); send({ type: 'ready' }); }
    catch (err) { send({ type: 'error', message: err?.message || String(err) }); }
    return;
  }
  if (type !== 'compress') return;

  const { buffer, preset } = e.data;
  totalPages = 0;
  currentPage = 0;

  try {
    const gs = await loadGhostscript();

    for (const name of ['input.pdf', 'output.pdf']) {
      try { gs.FS.unlink(name); } catch { /* not present */ }
    }

    gs.FS.writeFile('input.pdf', new Uint8Array(buffer));

    send({ type: 'progress', stage: 'compressing', current: 0, total: 0 });

    await gs.callMain([
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=/${preset}`,
      '-dNOPAUSE',
      '-dBATCH',
      '-sOutputFile=output.pdf',
      'input.pdf',
    ]);

    const out = gs.FS.readFile('output.pdf');
    const outBuf = out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);

    try { gs.FS.unlink('input.pdf'); } catch { /* ignore */ }
    try { gs.FS.unlink('output.pdf'); } catch { /* ignore */ }

    send({ type: 'done', buffer: outBuf, size: outBuf.byteLength }, [outBuf]);
  } catch (err) {
    send({ type: 'error', message: err?.message || String(err) });
  }
});
