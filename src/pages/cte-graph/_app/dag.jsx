import { useEffect, useState } from 'react';

const H = 38;

const widthOf = (name) => Math.max(76, name.length * 7 + 20);

const nameOf = (def) => (def.kind === 'cte' ? def.name : 'query');

function Heads({ id }) {
  return (
    <defs>
      {[['1', 8], ['n', 12]].map(([n, size]) => (
        <marker key={n} id={`${id}-${n}`} viewBox="0 0 2 2" refX="2" refY="1" markerWidth={size} markerHeight={size}
          markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0,0L2,1L0,2z" className="fill-text" />
        </marker>
      ))}
    </defs>
  );
}

/** A read of `n`, headed at `points[0]`, the reader; `heads` is the id given to `Heads` in the same svg. */
function Edge({ points, n, heads }) {
  return (
    <path d={`M${points.map((p) => `${p.x},${p.y}`).join('L')}`}
      markerStart={`url(#${heads}-${n > 1 ? 'n' : '1'})`}
      className={`fill-none stroke-text ${n > 1 ? '[stroke-width:3px]' : '[stroke-width:1px]'}`} />
  );
}

function Box({ x, y, width, height, copies, materialized }) {
  return (
    <>
      <rect x={x} y={y} width={width} height={height}
        className={copies > 1 ? 'fill-accent/15 stroke-accent [stroke-width:3px]' : 'fill-bg stroke-text [stroke-width:1px]'} />
      {materialized && (
        <rect data-materialized x={x + 4} y={y + 4} width={width - 8} height={height - 8} className="fill-none stroke-text [stroke-width:1px]" />
      )}
    </>
  );
}

/**
 * A read count's size at 10px, from Departure Mono's metrics in its 550 units to the em: every glyph advances 350,
 * and its line ascends 550 and descends 150. elk is told this size, so it can keep the label clear of the nodes.
 */
const LABEL = { size: 10, advance: (10 * 350) / 550, ascent: (10 * 550) / 550, height: (10 * 700) / 550 };

const labelOf = (n) => {
  const text = `×${n}`;
  return { text, width: text.length * LABEL.advance, height: LABEL.height };
};

const READS = labelOf('n');

/** `text` in the box whose top-left is `x`, `y`. */
function EdgeLabel({ x, y, text }) {
  return (
    <text x={x} y={y + LABEL.ascent} fontSize={LABEL.size}
      className="fill-text stroke-bg [stroke-width:3px] [paint-order:stroke]">{text}</text>
  );
}

function Swatch({ label, children }) {
  return (
    <li className="flex items-center gap-1">
      <svg aria-hidden="true" width="30" height="28" viewBox="0 0 30 28" className="font-pixel">{children}</svg>
      <span>{label}</span>
    </li>
  );
}

/** A swatch of each of the graph's marks, drawn as the graph draws it, with what it means. */
export function Key() {
  return (
    <ul aria-label="Key" className="label flex flex-wrap items-center gap-x-4 gap-y-1">
      <Swatch label="one copy">
        <Box x={2} y={5} width={26} height={18} copies={1} />
        <text x={15} y={18} textAnchor="middle" className="fill-text text-[10px]">×1</text>
      </Swatch>
      <Swatch label="n copies">
        <Box x={2} y={5} width={26} height={18} copies={2} />
        <text x={15} y={18} textAnchor="middle" className="fill-text text-[10px]">×n</text>
      </Swatch>
      <Swatch label="MATERIALIZED">
        <Box x={2} y={5} width={26} height={18} copies={1} materialized />
      </Swatch>
      <Swatch label="rows flow">
        <Heads id="cte-key-flow" />
        <Box x={7} y={1} width={16} height={6} copies={1} />
        <Edge points={[{ x: 15, y: 7 }, { x: 15, y: 21 }]} n={1} heads="cte-key-flow" />
        <Box x={7} y={21} width={16} height={6} copies={1} />
      </Swatch>
      <Swatch label="n reads">
        <Heads id="cte-key-reads" />
        <Edge points={[{ x: 22, y: 2 }, { x: 22, y: 27 }]} n={2} heads="cte-key-reads" />
        <EdgeLabel {...READS} x={20 - READS.width} y={14.5 - READS.height / 2} />
      </Swatch>
    </ul>
  );
}

/** Where elk places each CTE, each read, and each read count over one. */
export async function layout({ defs }) {
  const { default: ELK } = await import('elkjs/lib/elk.bundled.js');
  const reads = defs.flatMap((d) => [...d.refs].map(([cte, n]) => ({ from: d.id, to: cte.id, n })));
  const out = await new ELK().layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.edgeLabels.placement': 'CENTER',
      'elk.spacing.nodeNode': '16',
      'elk.layered.spacing.nodeNodeBetweenLayers': '16',
      'elk.padding': '[top=8,left=8,bottom=8,right=8]',
    },
    children: defs.map((d) => ({ id: String(d.id), width: widthOf(nameOf(d)), height: H })),
    edges: reads.map((e) => ({
      id: `${e.from}>${e.to}`,
      sources: [String(e.from)],
      targets: [String(e.to)],
      labels: e.n > 1 ? [labelOf(e.n)] : [],
    })),
  });
  const at = new Map(out.children.map((c) => [c.id, c]));
  return {
    width: out.width,
    height: out.height,
    nodes: defs.map((def) => ({ def, ...at.get(String(def.id)) })),
    edges: reads.map((e, i) => {
      const { id, sections: [{ startPoint, bendPoints = [], endPoint }], labels: [label] = [] } = out.edges[i];
      return { ...e, key: id, points: [startPoint, ...bendPoints, endPoint], label };
    }),
  };
}

/**
 * Each CTE once, as `name ×copies`, with an edge to each CTE it reads, `×n` where it reads one n times, its arrowhead
 * at the reader, the way the rows flow. A CTE with more than one copy is drawn thick in the accent; a MATERIALIZED one
 * has a double border. `copies` is indexed by id.
 */
export function Dag({ model, copies }) {
  const [laid, setLaid] = useState(null);
  useEffect(() => {
    let live = true;
    layout(model).then(
      (l) => live && setLaid({ model, ok: true, ...l }),
      () => live && setLaid({ model, ok: false }),
    );
    return () => { live = false; };
  }, [model]);

  if (laid?.model !== model) return <p className="label">Laying out…</p>;
  if (!laid.ok) {
    return <p className="label"><span className="pixel-alert-text" data-variant="danger">The graph failed to load.</span></p>;
  }
  const { width, height } = laid;

  return (
    <div className="pixel-bleed">
      <div className="w-fit max-w-full mx-auto border-2 border-border bg-bg min-w-[min(100%,calc(720px-2rem))]">
        <svg role="img" aria-label="Each CTE once, with the CTEs it reads" viewBox={`0 0 ${width} ${height}`}
          className="block mx-auto font-pixel"
          style={{ width, maxWidth: '100%', height: 'auto' }}>
          <Heads id="cte-head" />
          {laid.edges.map((e) => (
            <g key={e.key} data-edge={e.key}>
              <Edge points={e.points} n={e.n} heads="cte-head" />
              {e.label && <EdgeLabel {...e.label} />}
            </g>
          ))}
          {laid.nodes.map(({ def, x, y, width: w }) => {
            const n = copies[def.id];
            const materialized = def.kind === 'cte' && def.materialized;
            return (
              <g key={def.id} data-node={nameOf(def)}>
                <title>{`${nameOf(def)}: ${n} ${n === 1 ? 'copy' : 'copies'}${materialized ? ', MATERIALIZED' : ''}`}</title>
                <Box x={x} y={y} width={w} height={H} copies={n} materialized={materialized} />
                <text x={x + w / 2} y={y + 16} textAnchor="middle" className="fill-text text-[11px]">{nameOf(def)}</text>
                <text x={x + w / 2} y={y + 30} textAnchor="middle" className="fill-text text-[10px]">×{n}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
