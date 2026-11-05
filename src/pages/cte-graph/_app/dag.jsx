import { useEffect, useState } from 'react';

const H = 38;

const widthOf = (name) => Math.max(76, name.length * 7 + 20);

const nameOf = (def) => (def.kind === 'cte' ? def.name : 'query');

function Head({ id, size }) {
  return (
    <marker id={id} viewBox="0 0 2 2" refX="2" refY="1" markerWidth={size} markerHeight={size}
      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
      <path d="M0,0L2,1L0,2z" className="fill-text" />
    </marker>
  );
}

async function layout({ defs }) {
  const { default: ELK } = await import('elkjs/lib/elk.bundled.js');
  const reads = defs.flatMap((d) => [...d.refs].map(([cte, n]) => ({ from: d.id, to: cte.id, n })));
  const out = await new ELK().layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.spacing.nodeNode': '16',
      'elk.layered.spacing.nodeNodeBetweenLayers': '44',
      'elk.padding': '[top=8,left=8,bottom=8,right=8]',
    },
    children: defs.map((d) => ({ id: String(d.id), width: widthOf(nameOf(d)), height: H })),
    edges: reads.map((e) => ({ id: `${e.from}>${e.to}`, sources: [String(e.from)], targets: [String(e.to)] })),
  });
  const at = new Map(out.children.map((c) => [c.id, c]));
  return {
    width: out.width,
    height: out.height,
    nodes: defs.map((def) => ({ def, ...at.get(String(def.id)) })),
    edges: reads.map((e, i) => {
      const { startPoint, bendPoints = [], endPoint } = out.edges[i].sections[0];
      const points = [startPoint, ...bendPoints, endPoint];
      return { ...e, key: out.edges[i].id, points, middle: points[Math.floor((points.length - 1) / 2)] };
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
          <defs>
            <Head id="cte-head-1" size={8} />
            <Head id="cte-head-n" size={12} />
          </defs>
          {laid.edges.map((e) => (
            <g key={e.key} data-edge={e.key}>
              <path d={`M${e.points.map((p) => `${p.x},${p.y}`).join('L')}`}
                markerStart={`url(#cte-head-${e.n > 1 ? 'n' : '1'})`}
                className={`fill-none stroke-text ${e.n > 1 ? '[stroke-width:3px]' : '[stroke-width:1px]'}`} />
              {e.n > 1 && (
                <text x={e.middle.x + 4} y={e.middle.y + 4}
                  className="fill-text stroke-bg [stroke-width:3px] [paint-order:stroke] text-[10px]">
                  ×{e.n}
                </text>
              )}
            </g>
          ))}
          {laid.nodes.map(({ def, x, y, width: w }) => {
            const n = copies[def.id];
            const materialized = def.kind === 'cte' && def.materialized;
            return (
              <g key={def.id} data-node={nameOf(def)}>
                <title>{`${nameOf(def)}: ${n} ${n === 1 ? 'copy' : 'copies'}${materialized ? ', MATERIALIZED' : ''}`}</title>
                <rect x={x} y={y} width={w} height={H}
                  className={n > 1 ? 'fill-accent/15 stroke-accent [stroke-width:3px]' : 'fill-bg stroke-text [stroke-width:1px]'} />
                {materialized && (
                  <rect data-materialized x={x + 4} y={y + 4} width={w - 8} height={H - 8} className="fill-none stroke-text [stroke-width:1px]" />
                )}
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
