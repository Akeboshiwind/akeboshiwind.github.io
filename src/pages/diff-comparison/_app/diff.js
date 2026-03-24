// Myers diff algorithm operating on lines
export function computeDiff(oldText, newText) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const n = oldLines.length;
  const m = newLines.length;
  const max = n + m;

  if (max === 0) return [];

  // Myers' algorithm
  const v = new Array(2 * max + 1);
  v[max + 1] = 0;
  const trace = [];

  for (let d = 0; d <= max; d++) {
    trace.push([...v]);
    for (let k = -d; k <= d; k += 2) {
      const idx = k + max;
      let x;
      if (k === -d || (k !== d && v[idx - 1] < v[idx + 1])) {
        x = v[idx + 1];
      } else {
        x = v[idx - 1] + 1;
      }
      let y = x - k;
      while (x < n && y < m && oldLines[x] === newLines[y]) {
        x++;
        y++;
      }
      v[idx] = x;
      if (x >= n && y >= m) {
        return backtrack(trace, oldLines, newLines, max);
      }
    }
  }
  return [];
}

function backtrack(trace, oldLines, newLines, max) {
  let x = oldLines.length;
  let y = newLines.length;
  const edits = [];

  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;
    const idx = k + max;
    let prevK;
    if (k === -d || (k !== d && v[idx - 1] < v[idx + 1])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = v[prevK + max];
    const prevY = prevX - prevK;

    // Diagonal moves (equal lines)
    while (x > prevX && y > prevY) {
      x--;
      y--;
      edits.unshift({ type: 'equal', oldLine: x, newLine: y, value: oldLines[x] });
    }

    if (d > 0) {
      if (x === prevX) {
        // Insert
        y--;
        edits.unshift({ type: 'insert', newLine: y, value: newLines[y] });
      } else {
        // Delete
        x--;
        edits.unshift({ type: 'delete', oldLine: x, value: oldLines[x] });
      }
    }
  }
  return edits;
}
