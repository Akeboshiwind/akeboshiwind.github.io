/** The grid the plan's gestures snap to, in metres. */
export const GRID = 0.25;

export const snap = (p) => ({ x: Math.round(p.x / GRID) * GRID, y: Math.round(p.y / GRID) * GRID });

/** The rect spanned by two opposite corners, whichever way round they are. */
export const rectBetween = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });
