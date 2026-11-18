/* Pyodide runs inside a Web Worker so long/infinite loops never freeze the page
 * (the Stop button simply terminates the worker). The worker source is kept as a
 * string and started from a Blob URL so it works with any bundler or static host. */
export const PYODIDE_VERSION = '0.27.7'
export const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

export const WORKER_SOURCE = /* js */ `
let pyodide = null;
const ready = (async () => {
  importScripts('${PYODIDE_URL}pyodide.js');
  pyodide = await loadPyodide({ indexURL: '${PYODIDE_URL}' });
  postMessage({ type: 'ready', version: pyodide.version });
})().catch(err => postMessage({ type: 'fatal', text: String(err && err.message || err) }));

function makeWriter(kind) {
  const dec = new TextDecoder();
  let buf = '';
  return {
    write(bytes) { buf += dec.decode(bytes, { stream: true }); flush(false); return bytes.length; },
    flushAll() { flush(true); },
  };
  function flush(all) {
    const i = all ? buf.length : buf.lastIndexOf('\\n') + 1;
    if (i > 0) { postMessage({ type: kind, text: buf.slice(0, i) }); buf = buf.slice(i); }
  }
}

onmessage = async (e) => {
  const { code, stdin } = e.data;
  await ready;
  if (!pyodide) return;
  const out = makeWriter('out');
  const err = makeWriter('err');
  const lines = stdin.length ? stdin.replace(/\\r/g, '').split('\\n') : [];
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  let li = 0;
  pyodide.setStdout({ write: (b) => out.write(b), isatty: false });
  pyodide.setStderr({ write: (b) => err.write(b), isatty: false });
  pyodide.setStdin({
    stdin: () => {
      out.flushAll();
      if (li < lines.length) { const l = lines[li++]; postMessage({ type: 'echo', text: l + '\\n' }); return l + '\\n'; }
      postMessage({ type: 'needinput' });
      return null;
    },
    isatty: false,
  });
  const t0 = performance.now();
  try {
    await pyodide.loadPackagesFromImports(code, { messageCallback: (m) => postMessage({ type: 'sys', text: m }), errorCallback: () => {} });
    const globals = pyodide.globals.get('dict')();
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' });
    globals.destroy && globals.destroy();
    out.flushAll(); err.flushAll();
    postMessage({ type: 'done', ms: performance.now() - t0 });
  } catch (ex) {
    out.flushAll(); err.flushAll();
    let msg = String(ex && ex.message || ex);
    const at = msg.indexOf('File "main.py"');
    if (at > 0) msg = 'Traceback (most recent call last):\\n  ' + msg.slice(at);
    postMessage({ type: 'error', text: msg, ms: performance.now() - t0 });
  }
};
`
