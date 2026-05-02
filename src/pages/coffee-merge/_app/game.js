import { Engine, World, Bodies, Body, Events, Composite } from 'matter-js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const W = 420, H = 640;
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
const TIERS = TIER_FILES.map((file, i) => {
  const t = i / (TIER_FILES.length - 1);
  const radius = Math.round(TIER_MIN_R * Math.pow(TIER_MAX_R / TIER_MIN_R, t));
  const img = new Image();
  img.src = `/coffee-merge/${file}`;
  return { file, radius, img };
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
  Bodies.rectangle(W/2, -wallT/2, W*2, wallT, { isStatic: true, restitution: 0.4 }),
  Bodies.rectangle(W/2, H + wallT/2, W*2, wallT, { isStatic: true, restitution: 0.4 }),
  Bodies.rectangle(-wallT/2, H/2, wallT, H*2, { isStatic: true, restitution: 0.4 }),
  Bodies.rectangle(W + wallT/2, H/2, wallT, H*2, { isStatic: true, restitution: 0.4 }),
]);

function createDrink(x, y, tier, vx = 0, vy = 0) {
  const t = TIERS[tier];
  const body = Bodies.circle(x, y, t.radius, {
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
  if (vx || vy) Body.setVelocity(body, { x: vx, y: vy });
  return body;
}

let score = 0;
let currentTier = pickStarter();
let nextTier = pickStarter();
let aiming = true;
let launcherX = W / 2;
const LAUNCHER_Y = H - 48;
const LAUNCH_LINE_Y = H - 92;
let gameOver = false;
let particles = [];
let merges = [];
const overTimers = new Map();

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
  return Math.max(r + 4, Math.min(W - r - 4, x));
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
    document.getElementById('scoreVal').textContent = score;
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
        gameOver = true;
        document.getElementById('finalScore').textContent = score;
        document.getElementById('gameover').classList.add('show');
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
    p.vx *= 0.93; p.vy *= 0.93;
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
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#b8895a');
  g.addColorStop(0.5, '#a07248');
  g.addColorStop(1, '#7e5634');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(50, 28, 12, 0.55)';
  ctx.lineWidth = 2;
  const plankCount = 4;
  for (let i = 1; i < plankCount; i++) {
    const x = (W * i) / plankCount + Math.sin(i * 1.7) * 4;
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, H);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(60, 30, 10, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const y = (i * 11.3) % H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(W*0.3, y + Math.sin(i)*3, W*0.7, y + Math.cos(i)*3, W, y);
    ctx.stroke();
  }
  const vg = ctx.createRadialGradient(W/2, H/2, W*0.3, W/2, H/2, W*0.85);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

function drawLaunchLine() {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 248, 220, 0.7)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(12, LAUNCH_LINE_Y);
  ctx.lineTo(W - 12, LAUNCH_LINE_Y);
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
  ctx.lineTo(launcherX, 28);
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

document.getElementById('restart').addEventListener('click', () => {
  const bodies = Composite.allBodies(engine.world);
  for (const body of bodies) {
    if (body.isDrink) World.remove(engine.world, body);
  }
  score = 0;
  document.getElementById('scoreVal').textContent = 0;
  particles = [];
  merges = [];
  overTimers.clear();
  gameOver = false;
  currentTier = pickStarter();
  nextTier = pickStarter();
  document.getElementById('nextImg').src = TIERS[nextTier].img.src;
  aiming = true;
  document.getElementById('hint').style.opacity = '';
  document.getElementById('gameover').classList.remove('show');
});

document.getElementById('nextImg').src = TIERS[nextTier].img.src;
loop();
