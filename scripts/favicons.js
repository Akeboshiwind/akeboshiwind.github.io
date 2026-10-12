#!/usr/bin/env node
// Regenerates the favicon set, site.webmanifest and browserconfig.xml in public/, and their shared cache-busting
// version in src/lib/favicon-version.json, from the header mark: the `cairn` dither shape, seed 2.
// Run after changing the mark: npm run favicons

import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { dither, rng, shapes } from '../src/lib/dither.js';
import { ACCENTS, PAGE_BACKGROUND as PAGE } from '../src/lib/accents.js';

const SEED = 2;
const [{ light, dark }] = ACCENTS;


const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/**
 * The cairn as a `cells × cells` mask. Below 36 cells the lit side's sparse dither dissolves the stones,
 * so `bold` floors each stone's density to keep the stack readable.
 */
function cairn(cells, bold) {
  const density = shapes.cairn.make(cells, cells, rng(SEED));
  const field = bold ? (x, y) => { const d = density(x, y); return d > 0 ? Math.max(d, 0.7) : 0; } : density;
  return dither(cells, cells, field);
}

function png(size, cells, { scale = 1, bold = false, background = null } = {}) {
  const mask = cairn(cells, bold);
  const image = new PNG({ width: size, height: size });
  const [ar, ag, ab] = hex(light.accent);
  const bg = background && hex(background);
  const offset = Math.floor((size - cells * scale) / 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [cx, cy] = [Math.floor((x - offset) / scale), Math.floor((y - offset) / scale)];
      const lit = cx >= 0 && cy >= 0 && cx < cells && cy < cells && mask[cy * cells + cx];
      const i = 4 * (y * size + x);
      if (lit) image.data.set([ar, ag, ab, 255], i);
      else if (bg) image.data.set([...bg, 255], i);
    }
  }
  return PNG.sync.write(image);
}

/** An .ico holding PNG-encoded images, which every browser that reads .ico accepts. */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

function svgPath(cells, bold) {
  const mask = cairn(cells, bold);
  let d = '';
  mask.forEach((on, i) => { if (on) d += `M${i % cells} ${Math.floor(i / cells)}h1v1h-1z`; });
  return d;
}

const small = { 16: png(16, 16, { bold: true }), 32: png(32, 32, { bold: true }) };
const ANDROID = [[192, 4], [256, 6], [512, 12]];

const icons = {
  'favicon-16x16.png': small[16],
  'favicon-32x32.png': small[32],
  'favicon.ico': ico([{ size: 16, data: small[16] }, { size: 32, data: small[32] }]),
  'apple-touch-icon.png': png(180, 36, { scale: 4, background: PAGE }),
  'mstile-150x150.png': png(150, 36, { scale: 3, background: PAGE }),
  ...Object.fromEntries(ANDROID.map(([size, scale]) => [`android-chrome-${size}x${size}.png`, png(size, 36, { scale, background: PAGE })])),
  'favicon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" shape-rendering="crispEdges">
<style>path{fill:${light.accent}}@media (prefers-color-scheme:dark){path{fill:${dark.accent}}}</style>
<path d="${svgPath(36, false)}"/>
</svg>
`,
  'safari-pinned-tab.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
<path d="${svgPath(32, true)}"/>
</svg>
`,
};

const hash = createHash('sha256');
for (const name of Object.keys(icons).sort()) hash.update(name).update(icons[name]);
const version = hash.digest('hex').slice(0, 8);
const url = (name) => `/${name}?v=${version}`;

const files = {
  ...icons,
  'browserconfig.xml': `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="${url('mstile-150x150.png')}"/>
            <TileColor>${PAGE}</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`,
  'site.webmanifest': `${JSON.stringify({
    name: 'By the Rocks',
    short_name: 'By the Rocks',
    icons: ANDROID.map(([size]) => ({ src: url(`android-chrome-${size}x${size}.png`), sizes: `${size}x${size}`, type: 'image/png' })),
    theme_color: PAGE,
    background_color: PAGE,
    display: 'standalone',
  }, null, 4)}\n`,
};

for (const [name, data] of Object.entries(files)) writeFileSync(new URL(`../public/${name}`, import.meta.url), data);
writeFileSync(new URL('../src/lib/favicon-version.json', import.meta.url), `${JSON.stringify({ version })}\n`);

console.log(`Wrote the favicon set to public/ (version ${version})`);
