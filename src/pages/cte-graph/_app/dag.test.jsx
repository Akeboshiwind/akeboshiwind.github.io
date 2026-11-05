import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { copies } from '../../../lib/cte/model.ts';
import { parse } from '../../../lib/cte/parse.ts';
import { Dag } from './dag.jsx';

const elk = vi.hoisted(() => ({ size: null }));

vi.mock('elkjs/lib/elk.bundled.js', () => ({
  default: class {
    layout(graph) {
      if (!elk.size) return Promise.reject(new Error('no layout'));
      return Promise.resolve({
        ...elk.size,
        children: graph.children.map((c, i) => ({ ...c, x: 8, y: 8 + i * 82 })),
        edges: graph.edges.map((e) => ({
          id: e.id,
          sections: [{ startPoint: { x: 40, y: 46 }, endPoint: { x: 40, y: 90 } }],
          labels: e.labels.map((l) => ({ ...l, x: 43, y: 62 })),
        })),
      });
    }
  },
}));

afterEach(() => {
  cleanup();
  elk.size = null;
});

const draw = (sql = 'WITH a AS (SELECT * FROM t) SELECT * FROM a') => {
  const { model } = parse(sql);
  render(<Dag model={model} copies={copies(model)} />);
};

describe('Dag', () => {
  test('says so when the layout fails, rather than laying out for ever', async () => {
    draw();
    expect(screen.getByText('Laying out…')).toBeTruthy();
    expect(await screen.findByText('The graph failed to load.')).toBeTruthy();
  });

  test('draws a narrow graph at its own size, centred in a column-wide frame, never stretched to fill it', async () => {
    elk.size = { width: 96, height: 136 };
    draw();
    const svg = await screen.findByRole('img');
    expect(svg.style.width).toBe('96px');
    expect(svg.style.maxWidth).toBe('100%');
    expect(svg.getAttribute('class')).not.toMatch(/min-w/);
    expect(svg.getAttribute('class')).toMatch(/mx-auto/);
    expect(svg.parentElement.getAttribute('class')).toMatch(/min-w-\[min\(100%,calc\(720px-2rem\)\)\]/);
  });

  test('draws a read count where elk placed it, its top-left at the label\'s x and y', async () => {
    elk.size = { width: 96, height: 136 };
    draw('WITH a AS (SELECT * FROM t) SELECT * FROM a, a AS a_2');
    const label = await screen.findByText('×2', { selector: '[data-edge] text' });
    expect([label.getAttribute('x'), label.getAttribute('y')]).toEqual(['43', '72']);
  });
});
