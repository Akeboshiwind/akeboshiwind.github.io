import { describe, expect, test } from 'vitest';
import { parse } from '../../../lib/cte/parse.ts';
import { SAMPLES } from '../../../lib/cte/samples.ts';
import { layout } from './dag.jsx';

const laidOut = (name) => layout(parse(SAMPLES.find((s) => s.name === name).sql).model);

const overlap = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

describe.each(['Diamond', 'Realistic'])('laid out by elk, the %s sample', (name) => {
  test('places a label on each read over one, and none on a single read', async () => {
    const { edges } = await laidOut(name);
    expect(edges.some((e) => e.n > 1)).toBe(true);
    for (const e of edges) {
      if (e.n > 1) expect(e.label).toMatchObject({ text: `×${e.n}`, x: expect.any(Number), y: expect.any(Number) });
      else expect(e.label).toBeUndefined();
    }
  });

  test('keeps every label clear of every node', async () => {
    const { nodes, edges } = await laidOut(name);
    const clashes = edges.filter((e) => e.label).flatMap((e) =>
      nodes.filter((node) => overlap(e.label, node)).map((node) => `${e.key} over ${node.id}`));
    expect(clashes).toEqual([]);
  });
});
