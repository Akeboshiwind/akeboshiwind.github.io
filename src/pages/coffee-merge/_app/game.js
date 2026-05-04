import { Engine, World, Bodies, Body, Events, Composite } from 'matter-js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const W = 420, H = 640;
// Playfield is inset by the rim so glasses can render onto the table edge
// (drawn inside the canvas) instead of being clipped at the wood-grain.
const RIM = 14;
const PF_LEFT = RIM;
const PF_RIGHT = W - RIM;
const PF_TOP = RIM;
const PF_BOTTOM = H - RIM;
const PF_W = PF_RIGHT - PF_LEFT;
const PF_H = PF_BOTTOM - PF_TOP;
const dpr = Math.min(window.devicePixelRatio || 1, 2);
canvas.width = W * dpr;
canvas.height = H * dpr;
ctx.scale(dpr, dpr);

const TIER_FILES = [
  '01-espresso.png',
  '05-affogato.png',
  '07-latte.png',
  '13-iced-latte.png',
  '14-mocha.png',
  '17-raspberry-mocha.png',
  '16-orange-zest-coffee.png',
  '21-spiced-rum-coffee.png',
  '22-iced-coffee.png',
  '23-berry-infused-coffee.png',
  '24-coffee-punch.png',
];

const TIER_MIN_R = 22;
const TIER_MAX_R = 158;
// Collision is the glass base; image is the whole glass with rim/foam.
// Shrinking the body lets rendered glasses overlap when they settle —
// reads as a crowded bar and packs a few more drinks below the line.
const COLLISION_RATIO = 0.82;
const TIERS = TIER_FILES.map((file, i) => {
  const t = i / (TIER_FILES.length - 1);
  const radius = Math.round(TIER_MIN_R * Math.pow(TIER_MAX_R / TIER_MIN_R, t));
  const collisionRadius = Math.round(radius * COLLISION_RATIO);
  const img = new Image();
  img.src = `/coffee-merge/${file}`;
  return { file, radius, collisionRadius, img };
});

const AIR_DRAG = 0.046;
const LAUNCH_SPEED = 26;

const engine = Engine.create();
engine.gravity.x = 0;
engine.gravity.y = 0;
engine.positionIterations = 8;
engine.velocityIterations = 8;

const wallT = 200;
World.add(engine.world, [
  Bodies.rectangle(W/2, PF_TOP - wallT/2, W*2, wallT, { isStatic: true, restitution: 0.4 }),
  Bodies.rectangle(W/2, PF_BOTTOM + wallT/2, W*2, wallT, { isStatic: true, restitution: 0.4 }),
  Bodies.rectangle(PF_LEFT - wallT/2, H/2, wallT, H*2, { isStatic: true, restitution: 0.4 }),
  Bodies.rectangle(PF_RIGHT + wallT/2, H/2, wallT, H*2, { isStatic: true, restitution: 0.4 }),
]);

function createDrink(x, y, tier, vx = 0, vy = 0) {
  const t = TIERS[tier];
  const body = Bodies.circle(x, y, t.collisionRadius, {
    friction: 0.05,
    frictionAir: AIR_DRAG,
    restitution: 0.35,
    density: 0.0012 + tier * 0.0001,
    slop: 0.02,
    inertia: Infinity,
  });
  body.tier = tier;
  body.isDrink = true;
  body.spawnTime = performance.now();
  body.popScale = 1;
  if (tier > maxTier) maxTier = tier;
  if (vx || vy) Body.setVelocity(body, { x: vx, y: vy });
  return body;
}

let score = 0;
let maxTier = 0;
let currentTier = pickStarter();
let nextTier = pickStarter();
let aiming = false;
let launcherX = W / 2;
const LAUNCHER_Y = H - 48;
const LAUNCH_LINE_Y = H - 92;
let gameOver = true;
let particles = [];
let merges = [];
const overTimers = new Map();

const NAME_KEY = 'coffee-merge:lastName';
const STATE_KEY = 'coffee-merge:gameState';
const SAVE_INTERVAL_MS = 1000;
const TOP_ENTRIES = 5;
// Overfetch so client-side dedup-by-name still yields enough unique users
// even when the top of the table is dominated by repeat submissions.
const FETCH_SIZE = 200;
const PB_URL = 'https://pb.bythe.rocks';
const GAME_ID = 'coffee-merge';

// Live ladder: each player upserts a row in `live_sessions` while playing,
// subscribes to PocketBase realtime events for live_sessions and scores,
// then fills two flanking slots around their score from the local cache.
const LIVE_FRESH_MS = 30000;
const LIVE_PATCH_INTERVAL_MS = 2000;
const HEARTBEAT_INTERVAL_MS = 10000;
const STALE_TICK_INTERVAL_MS = 5000;

let sessionId = null;
const liveSessionsMap = new Map();
let topRecord = null;
let prevWindowKeys = [];

function liveUrl(suffix = '') {
  return `${PB_URL}/api/collections/live_sessions/records${suffix}`;
}

async function createLiveSession() {
  const playerName = loadLastName() || 'Player';
  try {
    const res = await fetch(liveUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: GAME_ID, name: playerName, score, tier: maxTier }),
    });
    if (!res.ok) return;
    const data = await res.json();
    sessionId = data.id;
  } catch {}
}

let lastPatchAt = 0;
let pendingPatchTimer = null;
function scheduleLivePatch() {
  const wait = Math.max(0, LIVE_PATCH_INTERVAL_MS - (Date.now() - lastPatchAt));
  if (wait === 0) {
    sendLivePatch();
  } else if (!pendingPatchTimer) {
    pendingPatchTimer = setTimeout(() => {
      pendingPatchTimer = null;
      sendLivePatch();
    }, wait);
  }
}

async function sendLivePatch() {
  if (!sessionId) return;
  lastPatchAt = Date.now();
  try {
    await fetch(liveUrl(`/${sessionId}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, tier: maxTier }),
    });
  } catch {}
}

async function deleteLiveSession() {
  if (!sessionId) return;
  const id = sessionId;
  sessionId = null;
  if (pendingPatchTimer) {
    clearTimeout(pendingPatchTimer);
    pendingPatchTimer = null;
  }
  try {
    await fetch(liveUrl(`/${id}`), { method: 'DELETE' });
  } catch {}
}

async function fetchTopOne() {
  const f = encodeURIComponent(`game="${GAME_ID}"`);
  try {
    const res = await fetch(`${PB_URL}/api/collections/scores/records?filter=${f}&sort=-score&perPage=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.items?.[0] || null;
  } catch { return null; }
}

async function bulkFetchLive() {
  // PocketBase filter wants "YYYY-MM-DD HH:MM:SS.sssZ" (space, not T).
  const cutoff = new Date(Date.now() - LIVE_FRESH_MS).toISOString().replace('T', ' ');
  const f = encodeURIComponent(`game="${GAME_ID}" && updated>"${cutoff}"`);
  try {
    const res = await fetch(liveUrl(`?filter=${f}&sort=-updated&perPage=50`));
    if (!res.ok) return;
    const data = await res.json();
    liveSessionsMap.clear();
    for (const r of (data.items || [])) liveSessionsMap.set(r.id, r);
  } catch {}
}

let realtimeES = null;
let realtimeClientId = null;
async function subscribeRealtime() {
  if (!realtimeClientId) return;
  try {
    await fetch(`${PB_URL}/api/realtime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: realtimeClientId,
        subscriptions: ['live_sessions', 'scores'],
      }),
    });
  } catch (err) {
    console.warn('realtime subscribe failed', err);
  }
}

function startRealtime() {
  if (realtimeES) return;
  realtimeES = new EventSource(`${PB_URL}/api/realtime`);
  realtimeES.addEventListener('PB_CONNECT', async (e) => {
    try {
      realtimeClientId = JSON.parse(e.data).clientId;
      // Bulk-fetch the starting state before subscribing — otherwise events
      // arriving during the bulk fetch get wiped by its clear() call.
      const [, top] = await Promise.all([bulkFetchLive(), fetchTopOne()]);
      topRecord = top;
      // Snap prevWindowKeys to the bulk state so the placeholder YOU-only
      // ladder doesn't register as a "lineup change" on the first real
      // render — otherwise the player's row pulses on every game start.
      prevWindowKeys = computeLadderWindow().map(c => c.id);
      renderLadder();
      await subscribeRealtime();
    } catch (err) {
      console.warn('realtime connect handler failed', err);
    }
  });
  realtimeES.addEventListener('live_sessions', (e) => {
    try {
      const { action, record } = JSON.parse(e.data);
      if (record.game !== GAME_ID) return;
      if (action === 'delete') liveSessionsMap.delete(record.id);
      else liveSessionsMap.set(record.id, record);
      renderLadder();
    } catch {}
  });
  realtimeES.addEventListener('scores', (e) => {
    try {
      const { record } = JSON.parse(e.data);
      if (record.game !== GAME_ID) return;
      // A new submission may be a new top — refetch the single top row.
      fetchTopOne().then(t => { topRecord = t; renderLadder(); });
    } catch {}
  });
  realtimeES.onerror = () => {
    // EventSource auto-reconnects; PB_CONNECT will fire again with a fresh clientId.
    console.warn('realtime connection error, will retry');
  };
}

function stopRealtime() {
  if (realtimeES) {
    realtimeES.close();
    realtimeES = null;
  }
  realtimeClientId = null;
  liveSessionsMap.clear();
  topRecord = null;
}

let heartbeatTimer = null;
function startHeartbeat() {
  if (heartbeatTimer) return;
  // Bump our `updated` field on a steady cadence so we don't go stale in
  // others' staleness filter during long stretches with no merges.
  heartbeatTimer = setInterval(() => scheduleLivePatch(), HEARTBEAT_INTERVAL_MS);
}
function stopHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

let staleTickTimer = null;
function startStaleTick() {
  if (staleTickTimer) return;
  // Re-render periodically so rows that quietly went stale (e.g. a tab
  // crashed without firing pagehide) drop out without waiting for an event.
  staleTickTimer = setInterval(() => {
    const pruneCutoff = Date.now() - LIVE_FRESH_MS * 2;
    for (const [id, r] of liveSessionsMap) {
      if (new Date(r.updated).getTime() < pruneCutoff) liveSessionsMap.delete(id);
    }
    renderLadder();
  }, STALE_TICK_INTERVAL_MS);
}
function stopStaleTick() {
  if (staleTickTimer) clearInterval(staleTickTimer);
  staleTickTimer = null;
}

async function setupLiveLadder() {
  await createLiveSession();
  startRealtime();
  startHeartbeat();
  startStaleTick();
}

function teardownLiveLadder() {
  stopHeartbeat();
  stopStaleTick();
  stopRealtime();
  deleteLiveSession();
}

function computeLadderWindow() {
  const you = { id: 'you', name: 'YOU', score, kind: 'you' };
  const cutoff = Date.now() - LIVE_FRESH_MS;
  let above = null, below = null;
  for (const r of liveSessionsMap.values()) {
    if (r.id === sessionId) continue;
    if (new Date(r.updated).getTime() < cutoff) continue;
    if (r.score > score) {
      if (!above || r.score < above.score) above = r;
    } else if (r.score < score) {
      if (!below || r.score > below.score) below = r;
    }
  }
  const aboveSlot = above
    ? { id: `live:${above.id}`, name: above.name, score: above.score, kind: 'live' }
    : null;
  const belowSlot = below
    ? { id: `live:${below.id}`, name: below.name, score: below.score, kind: 'live' }
    : null;
  const topShow = topRecord
    ? { id: `top:${topRecord.id}`, name: topRecord.name, score: topRecord.score, kind: 'top' }
    : null;
  const candidates = [you];
  if (topShow) candidates.push(topShow);
  if (aboveSlot) candidates.push(aboveSlot);
  if (belowSlot) candidates.push(belowSlot);
  // On score ties, prefer top → live → you so the static TOP reference
  // sits above the leader's matching live row when both are present.
  const tieOrder = { top: 0, live: 1, you: 2 };
  candidates.sort((a, b) => (b.score - a.score) || (tieOrder[a.kind] - tieOrder[b.kind]));
  const yourIdx = candidates.findIndex(c => c.kind === 'you');
  // Start one above you, but slide the window up if we'd otherwise truncate
  // (e.g. you're at the bottom of 3 candidates — without the slide, TOP at
  // index 0 would fall outside the 3-row window).
  const start = Math.max(0, Math.min(yourIdx - 1, candidates.length - 3));
  return candidates.slice(start, start + 3);
}

function renderLadder() {
  const ladder = document.getElementById('ladder');
  if (!ladder) return;
  const slots = computeLadderWindow();
  const newKeys = slots.map(c => c.id);

  // FLIP: capture previous row positions by id so persistent rows can slide.
  const oldTops = new Map();
  for (const li of ladder.children) {
    oldTops.set(li.dataset.id, li.getBoundingClientRect().top);
  }

  ladder.innerHTML = '';
  for (const c of slots) {
    const li = document.createElement('li');
    li.className = `rung is-${c.kind}`;
    li.dataset.id = c.id;
    const left = document.createElement('span');
    left.className = 'rung-name';
    if (c.kind === 'live') {
      const dot = document.createElement('span');
      dot.className = 'rung-status live';
      left.appendChild(dot);
    } else if (c.kind === 'top') {
      const crown = document.createElement('span');
      crown.className = 'rung-crown';
      crown.textContent = '👑';
      left.appendChild(crown);
    }
    left.appendChild(document.createTextNode(c.name || ''));
    const right = document.createElement('span');
    right.className = 'rung-score';
    right.textContent = c.score;
    li.append(left, right);
    ladder.appendChild(li);
  }

  // FLIP: invert + play for rows that moved.
  for (const li of ladder.children) {
    const oldTop = oldTops.get(li.dataset.id);
    if (oldTop === undefined) continue;
    const dy = oldTop - li.getBoundingClientRect().top;
    if (!dy) continue;
    li.style.transition = 'none';
    li.style.transform = `translateY(${dy}px)`;
    requestAnimationFrame(() => {
      li.style.transition = '';
      li.style.transform = '';
    });
  }

  const lineupChanged =
    newKeys.length !== prevWindowKeys.length ||
    newKeys.some((k, i) => k !== prevWindowKeys[i]);
  if (lineupChanged && prevWindowKeys.length > 0) {
    const youRow = ladder.querySelector('.is-you');
    if (youRow) {
      youRow.classList.remove('pulse');
      void youRow.offsetWidth;
      youRow.classList.add('pulse');
    }
    const wasTop = prevWindowKeys[0] === 'you';
    const isTop = newKeys[0] === 'you';
    // Only celebrate when there's actually someone to overtake.
    if (isTop && !wasTop && newKeys.length > 1) fireTopConfetti();
  }
  prevWindowKeys = newKeys;
}

function fireTopConfetti() {
  const palette = ['#ffd700', '#ff6f3d', '#4ade80', '#60a5fa', '#f472b6', '#fff5c2'];
  for (let i = 0; i < 70; i++) {
    particles.push({
      x: PF_LEFT + Math.random() * PF_W,
      y: PF_TOP + 4,
      vx: (Math.random() - 0.5) * 3,
      vy: 1 + Math.random() * 2.5,
      life: 90 + Math.random() * 50, max: 140,
      color: palette[i % palette.length],
      size: 3 + Math.random() * 2.5,
      gravity: 0.16,
    });
  }
}

function dedupeByName(entries) {
  const seen = new Set();
  const out = [];
  for (const e of entries) {
    if (seen.has(e.name)) continue;
    seen.add(e.name);
    out.push(e);
  }
  return out;
}

async function fetchLeaderboard() {
  const filter = encodeURIComponent(`game="${GAME_ID}"`);
  const url = `${PB_URL}/api/collections/scores/records?filter=${filter}&sort=-score&perPage=${FETCH_SIZE}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
  const data = await res.json();
  return dedupeByName(data.items || []);
}
function loadLastName() {
  return localStorage.getItem(NAME_KEY) || '';
}
function saveLastName(name) {
  localStorage.setItem(NAME_KEY, name);
}
function serializeState() {
  const drinks = Composite.allBodies(engine.world)
    .filter(b => b.isDrink && !b.merging)
    .map(b => ({
      tier: b.tier,
      x: b.position.x,
      y: b.position.y,
      vx: b.velocity.x,
      vy: b.velocity.y,
      angle: b.angle,
      av: b.angularVelocity,
    }));
  return { score, maxTier, currentTier, nextTier, drinks };
}
function saveState() {
  if (gameOver) return;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(serializeState()));
  } catch {}
}
function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function clearState() {
  localStorage.removeItem(STATE_KEY);
}

let saveTimer = null;
function startSaveTimer() {
  if (saveTimer) return;
  saveTimer = setInterval(saveState, SAVE_INTERVAL_MS);
}
function stopSaveTimer() {
  if (saveTimer) clearInterval(saveTimer);
  saveTimer = null;
}

async function pushScore(name, points, tier) {
  const res = await fetch(`${PB_URL}/api/collections/scores/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game: GAME_ID, name, score: points, tier }),
  });
  if (!res.ok) throw new Error(`Score submit failed: ${res.status}`);
}

function setLeaderboardMessage(text) {
  const list = document.getElementById('leaderboardList');
  list.innerHTML = '';
  const li = document.createElement('li');
  li.className = 'empty';
  li.textContent = text;
  list.appendChild(li);
}

function appendLeaderboardRow(list, entry, rank, opts = {}) {
  const li = document.createElement('li');
  if (opts.isUser) li.classList.add('is-user');
  if (opts.separated) li.classList.add('separated');
  const rankEl = document.createElement('span');
  rankEl.className = 'rank';
  rankEl.textContent = rank === 1 ? '👑' : `#${rank}`;
  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = entry.name;
  const sc = document.createElement('span');
  sc.className = 'score';
  sc.textContent = entry.score;
  li.append(rankEl, name);
  if (typeof entry.tier === 'number' && TIERS[entry.tier]) {
    const drink = document.createElement('img');
    drink.className = 'drink';
    drink.src = TIERS[entry.tier].img.src;
    drink.alt = '';
    li.append(drink);
  }
  li.append(sc);
  list.appendChild(li);
}

async function renderLeaderboard() {
  const list = document.getElementById('leaderboardList');
  setLeaderboardMessage('loading…');
  const userName = loadLastName();
  let entries;
  try {
    entries = await fetchLeaderboard();
  } catch {
    setLeaderboardMessage('leaderboard unavailable');
    return;
  }
  list.innerHTML = '';
  if (entries.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'be the first to score';
    list.appendChild(li);
    return;
  }
  const userIdx = userName ? entries.findIndex(e => e.name === userName) : -1;
  const top = entries.slice(0, TOP_ENTRIES);
  top.forEach((entry, i) => {
    const isUser = i === userIdx;
    appendLeaderboardRow(list, entry, i + 1, { isUser });
  });
  if (userIdx >= TOP_ENTRIES) {
    appendLeaderboardRow(list, entries[userIdx], userIdx + 1, {
      isUser: true,
      separated: true,
    });
  }
}

function showLeaderboard() {
  document.body.classList.add('menu');
  document.getElementById('gameover').classList.remove('show');
  return renderLeaderboard();
}

function startGame() {
  const bodies = Composite.allBodies(engine.world);
  for (const body of bodies) {
    if (body.isDrink) World.remove(engine.world, body);
  }
  score = 0;
  maxTier = 0;
  particles = [];
  merges = [];
  overTimers.clear();
  gameOver = false;
  currentTier = pickStarter();
  nextTier = pickStarter();
  document.getElementById('nextImg').src = TIERS[nextTier].img.src;
  aiming = true;
  document.getElementById('hint').style.opacity = '';
  document.body.classList.remove('menu');
  document.getElementById('gameover').classList.remove('show');
  clearState();
  startSaveTimer();
  prevWindowKeys = [];
  renderLadder();
  setupLiveLadder();
}

function resumeGame(state) {
  const bodies = Composite.allBodies(engine.world);
  for (const body of bodies) {
    if (body.isDrink) World.remove(engine.world, body);
  }
  particles = [];
  merges = [];
  overTimers.clear();
  score = state.score || 0;
  maxTier = state.maxTier || 0;
  currentTier = state.currentTier ?? pickStarter();
  nextTier = state.nextTier ?? pickStarter();
  for (const d of state.drinks || []) {
    const drink = createDrink(d.x, d.y, d.tier, d.vx || 0, d.vy || 0);
    Body.setAngle(drink, d.angle || 0);
    Body.setAngularVelocity(drink, d.av || 0);
    World.add(engine.world, drink);
  }
  document.getElementById('nextImg').src = TIERS[nextTier].img.src;
  gameOver = false;
  aiming = true;
  document.getElementById('hint').style.opacity = '0';
  document.body.classList.remove('menu');
  document.getElementById('gameover').classList.remove('show');
  startSaveTimer();
  prevWindowKeys = [];
  renderLadder();
  setupLiveLadder();
}

function endGame() {
  gameOver = true;
  stopSaveTimer();
  teardownLiveLadder();
  clearState();
  document.getElementById('finalScore').textContent = score;
  const input = document.getElementById('nameInput');
  input.value = loadLastName();
  document.getElementById('gameover').classList.add('show');
  setTimeout(() => input.focus(), 100);
}

let submitting = false;
async function submitScore() {
  if (submitting) return;
  const raw = document.getElementById('nameInput').value || '';
  const name = raw.trim().slice(0, 20) || 'Anonymous';
  saveLastName(name);
  const btn = document.getElementById('submit');
  submitting = true;
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = 'Submitting…';
  try {
    await pushScore(name, score, maxTier);
  } catch {
    btn.textContent = 'Retry';
    btn.disabled = false;
    submitting = false;
    return;
  }
  btn.disabled = false;
  btn.textContent = original;
  submitting = false;
  showLeaderboard();
}

function pickStarter() {
  const r = Math.random();
  if (r < 0.4) return 0;
  if (r < 0.7) return 1;
  if (r < 0.9) return 2;
  return 3;
}

function pointerX(clientX) {
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * (W / rect.width);
  const r = TIERS[currentTier].radius;
  return Math.max(PF_LEFT + r + 4, Math.min(PF_RIGHT - r - 4, x));
}
canvas.addEventListener('mousemove', (e) => { launcherX = pointerX(e.clientX); });
canvas.addEventListener('mousedown', (e) => { launcherX = pointerX(e.clientX); tryLaunch(); });
canvas.addEventListener('touchmove', (e) => {
  if (e.touches[0]) launcherX = pointerX(e.touches[0].clientX);
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchstart', (e) => {
  if (e.touches[0]) launcherX = pointerX(e.touches[0].clientX);
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchend', () => tryLaunch());

function tryLaunch() {
  if (!aiming || gameOver) return;
  const drink = createDrink(launcherX, LAUNCHER_Y, currentTier, 0, -LAUNCH_SPEED);
  World.add(engine.world, drink);
  aiming = false;
  document.getElementById('hint').style.opacity = '0';
  setTimeout(() => {
    if (gameOver) return;
    currentTier = nextTier;
    nextTier = pickStarter();
    document.getElementById('nextImg').src = TIERS[nextTier].img.src;
    aiming = true;
  }, 380);
}

Events.on(engine, 'collisionStart', (event) => {
  for (const pair of event.pairs) {
    const { bodyA: a, bodyB: b } = pair;
    if (!a.isDrink || !b.isDrink) continue;
    if (a.tier !== b.tier) continue;
    if (a.merging || b.merging) continue;

    a.merging = true; b.merging = true;
    const x = (a.position.x + b.position.x) / 2;
    const y = (a.position.y + b.position.y) / 2;
    const vx = (a.velocity.x + b.velocity.x) / 2;
    const vy = (a.velocity.y + b.velocity.y) / 2;
    const tier = a.tier;
    const newTier = tier + 1;

    const palette = ['#fff5c2', '#ffb15a', '#ff7a3d', '#ffd89b'];
    for (let i = 0; i < 14; i++) {
      const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const sp = 2 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        life: 28 + Math.random() * 14, max: 40,
        color: palette[i % palette.length],
        size: 2 + Math.random() * 3,
      });
    }
    merges.push({ x, y, r: TIERS[tier].radius, life: 18, max: 18 });

    World.remove(engine.world, a);
    World.remove(engine.world, b);

    if (newTier < TIERS.length) {
      const merged = createDrink(x, y, newTier, vx * 0.4, vy * 0.4);
      merged.popScale = 0.55;
      World.add(engine.world, merged);
      score += (newTier + 1) * 12;
    } else {
      score += 600;
    }
    renderLadder();
    scheduleLivePatch();
  }
});

function checkGameOver() {
  if (gameOver) return;
  const bodies = Composite.allBodies(engine.world);
  const now = performance.now();
  for (const body of bodies) {
    if (!body.isDrink) continue;
    if (now - body.spawnTime < 600) continue;
    const r = TIERS[body.tier].radius;
    const slow = Math.abs(body.velocity.y) < 0.4 && Math.abs(body.velocity.x) < 0.4;
    const pastLine = body.position.y - r > LAUNCH_LINE_Y;
    if (pastLine && slow) {
      const t = (overTimers.get(body.id) || 0) + 1;
      overTimers.set(body.id, t);
      if (t > 80) {
        endGame();
        return;
      }
    } else {
      overTimers.delete(body.id);
    }
  }
}

function updateEffects() {
  particles = particles.filter(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.gravity) {
      p.vy += p.gravity;
      p.vx *= 0.99;
    } else {
      p.vx *= 0.93; p.vy *= 0.93;
    }
    p.life--;
    return p.life > 0;
  });
  merges = merges.filter(m => { m.life--; return m.life > 0; });

  const bodies = Composite.allBodies(engine.world);
  for (const body of bodies) {
    if (body.isDrink && body.popScale < 1) {
      body.popScale += (1 - body.popScale) * 0.18;
      if (1 - body.popScale < 0.005) body.popScale = 1;
    }
  }
}

function loop() {
  if (!gameOver) {
    Engine.update(engine, 1000 / 60);
    checkGameOver();
  }
  updateEffects();
  draw();
  requestAnimationFrame(loop);
}

function drawTable() {
  // Outer rim — darker stained wood that frames the playfield.
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#6a4220';
  ctx.fillRect(2, 2, W - 4, H - 4);

  // Wood top, clipped to the playfield so grain/planks don't leak onto the rim.
  ctx.save();
  ctx.beginPath();
  ctx.rect(PF_LEFT, PF_TOP, PF_W, PF_H);
  ctx.clip();

  const g = ctx.createLinearGradient(0, PF_TOP, 0, PF_BOTTOM);
  g.addColorStop(0, '#b8895a');
  g.addColorStop(0.5, '#a07248');
  g.addColorStop(1, '#7e5634');
  ctx.fillStyle = g;
  ctx.fillRect(PF_LEFT, PF_TOP, PF_W, PF_H);

  ctx.strokeStyle = 'rgba(50, 28, 12, 0.55)';
  ctx.lineWidth = 2;
  const plankCount = 4;
  for (let i = 1; i < plankCount; i++) {
    const x = PF_LEFT + (PF_W * i) / plankCount + Math.sin(i * 1.7) * 4;
    ctx.beginPath();
    ctx.moveTo(x, PF_TOP); ctx.lineTo(x, PF_BOTTOM);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(60, 30, 10, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const y = PF_TOP + (i * 11.3) % PF_H;
    ctx.beginPath();
    ctx.moveTo(PF_LEFT, y);
    ctx.bezierCurveTo(
      PF_LEFT + PF_W * 0.3, y + Math.sin(i) * 3,
      PF_LEFT + PF_W * 0.7, y + Math.cos(i) * 3,
      PF_RIGHT, y
    );
    ctx.stroke();
  }
  const cx = (PF_LEFT + PF_RIGHT) / 2;
  const cy = (PF_TOP + PF_BOTTOM) / 2;
  const vg = ctx.createRadialGradient(cx, cy, PF_W * 0.3, cx, cy, PF_W * 0.85);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vg;
  ctx.fillRect(PF_LEFT, PF_TOP, PF_W, PF_H);

  ctx.restore();

  // Inset shadow at the playfield edge — gives the rim a sense of depth.
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(PF_LEFT - 0.5, PF_TOP - 0.5, PF_W + 1, PF_H + 1);
}

function drawLaunchLine() {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 248, 220, 0.7)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(PF_LEFT + 12, LAUNCH_LINE_Y);
  ctx.lineTo(PF_RIGHT - 12, LAUNCH_LINE_Y);
  ctx.stroke();
  ctx.restore();
}

function drawDrink(x, y, tier, scale = 1) {
  const t = TIERS[tier];
  const size = t.radius * 2.1 * scale;
  ctx.save();
  ctx.translate(x, y);
  if (t.img.complete && t.img.naturalWidth > 0) {
    const iw = t.img.naturalWidth;
    const ih = t.img.naturalHeight;
    const fit = size / Math.max(iw, ih);
    const w = iw * fit;
    const h = ih * fit;
    ctx.drawImage(t.img, -w / 2, -h / 2, w, h);
  } else {
    ctx.fillStyle = 'rgba(255, 248, 220, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, t.radius * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    const a = p.life / p.max;
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawMergeFlashes() {
  for (const m of merges) {
    const t = 1 - m.life / m.max;
    ctx.globalAlpha = (1 - t) * 0.6;
    ctx.strokeStyle = '#fff5c2';
    ctx.lineWidth = 4 * (1 - t);
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r * (1 + t * 1.4), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawAimer() {
  if (!aiming || gameOver) return;
  const t = TIERS[currentTier];
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 248, 220, 0.45)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(launcherX, LAUNCHER_Y - t.radius);
  ctx.lineTo(launcherX, PF_TOP + 14);
  ctx.stroke();
  ctx.restore();

  const bob = Math.sin(performance.now() / 220) * 2;
  drawDrink(launcherX, LAUNCHER_Y + bob, currentTier, 1);
}

function draw() {
  drawTable();
  drawLaunchLine();
  drawMergeFlashes();

  // Depth-sort drinks: smaller Y (further up the table) drawn first,
  // so drinks closer to the player overlap them.
  const drinks = Composite.allBodies(engine.world)
    .filter(b => b.isDrink)
    .sort((a, b) => a.position.y - b.position.y);
  for (const body of drinks) {
    drawDrink(body.position.x, body.position.y, body.tier, body.popScale || 1);
  }

  drawParticles();
  drawAimer();
}

document.getElementById('play').addEventListener('click', startGame);
document.getElementById('submit').addEventListener('click', submitScore);
document.getElementById('nameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitScore();
});

document.getElementById('nextImg').src = TIERS[nextTier].img.src;

window.addEventListener('pagehide', () => {
  if (!gameOver) saveState();
  if (sessionId) {
    // keepalive lets the request survive the page going away
    fetch(liveUrl(`/${sessionId}`), { method: 'DELETE', keepalive: true }).catch(() => {});
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && !gameOver) saveState();
});

const savedState = loadState();
if (savedState && Array.isArray(savedState.drinks) && savedState.drinks.length > 0) {
  resumeGame(savedState);
} else {
  showLeaderboard();
}
loop();
