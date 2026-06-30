/* ================================================================
   POC-MAN: ELEMENTAL EDITION
   Movimiento fluido + Ignis lanza bolas de fuego
   ================================================================ */

/* ============================
   CONSTANTES DEL MAPA
   ============================ */
const C = 28;
const COLS = 19;
const ROWS = 21;
const W = COLS * C;
const H = ROWS * C;

const WALL = 1, DOT = 0, POWER = 2, EMPTY = 3, GHOUSE = 4;

const MAP_SRC = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,2,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,2,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1],
  [3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3],
  [1,1,1,1,0,1,3,1,1,4,1,1,3,1,0,1,1,1,1],
  [0,0,0,0,0,3,3,1,4,4,4,1,3,3,0,0,0,0,0],
  [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
  [3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3],
  [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,2,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,2,1],
  [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

/* ============================
   ESTADO GLOBAL
   ============================ */
let map = [], score = 0, lives = 3, level = 1, dotsLeft = 0;
let hiScore = parseInt(localStorage.getItem('pocman_hi') || '0');
let difficulty = 'normal';
let gameState = 'menu';
let scaredTimer = 0, ghostEatCombo = 0;
let frameCount = 0, lastTime = 0, accumulator = 0;
const TICK = 1000 / 60;

const SPEEDS = {
  easy:   { pac: 100, ghost: 165, ghostScared: 290 },
  normal: { pac: 75,  ghost: 115, ghostScared: 230 },
  hard:   { pac: 68,  ghost: 90, ghostScared: 170 },
};

/* ============================
   PAC-MAN
   ============================ */
let pac = {
  tx: 9, ty: 15,
  prevTx: 9, prevTy: 15,
  dx: 0, dy: 0,
  ndx: 0, ndy: 0,
  vx: 0, vy: 0,
  moveT: 0,
  mouth: 0, mouthD: 1,
  slowed: false,
  dead: false,
  deathAnim: 0,
  _interval: 95,
};

/* ============================
   FANTASMAS
   ============================ */
const GHOST_DEFS = [
  { type: 'ignis',   tx: 8,  ty: 9, color: '#ff4400', color2: '#ff8800', name: 'IGNIS' },
  { type: 'glacius', tx: 9,  ty: 9, color: '#00ccff', color2: '#88eeff', name: 'GLACIUS' },
  { type: 'voltar',  tx: 10, ty: 9, color: '#ffee00', color2: '#ffffaa', name: 'VOLTAR' },
  { type: 'terra',   tx: 9,  ty: 9, color: '#44cc44', color2: '#88ff88', name: 'TERRA' },
];

let ghosts = [];
let brokenWalls = [];
let particles = [];
let flashEffects = [];
let fireballs = [];

const canvas = document.getElementById('gc');
const ctx = canvas.getContext('2d');


/* ================================================================
   UTILIDADES
   ================================================================ */
function isWalkable(x, y, isGhost) {
  if (y === 9 && (x < 0 || x >= COLS)) return true;
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  const t = map[y][x];
  if (t === WALL) return false;
  if (t === GHOUSE) return !!isGhost;
  return true;
}

function wrapX(x) {
  if (x < 0) return COLS - 1;
  if (x >= COLS) return 0;
  return x;
}

function dist(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function calcVisual(ent) {
  const interval = ent._interval || 95;
  const t = Math.min(ent.moveT / interval, 1);

  let fromX = ent.prevTx * C + C / 2;
  let toX   = ent.tx * C + C / 2;
  let fromY = ent.prevTy * C + C / 2;
  let toY   = ent.ty * C + C / 2;

  if (Math.abs(toX - fromX) > W / 2) {
    if (toX < fromX) toX += W;
    else fromX += W;
  }

  ent.vx = lerp(fromX, toX, t);
  ent.vy = lerp(fromY, toY, t);

  if (ent.vx >= W) ent.vx -= W;
  if (ent.vx < 0) ent.vx += W;
}


/* ================================================================
   MAPA
   ================================================================ */
function resetMap() {
  map = MAP_SRC.map(r => [...r]);
  dotsLeft = 0;
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      if (map[y][x] === DOT || map[y][x] === POWER) dotsLeft++;
}


/* ================================================================
   INICIALIZACIÓN
   ================================================================ */
function initPac() {
  pac.tx = 9; pac.ty = 15;
  pac.prevTx = 9; pac.prevTy = 15;
  pac.dx = 0; pac.dy = 0;
  pac.ndx = 0; pac.ndy = 0;
  pac.vx = pac.tx * C + C / 2;
  pac.vy = pac.ty * C + C / 2;
  pac.moveT = 0;
  pac.mouth = 0; pac.mouthD = 1;
  pac.slowed = false;
  pac.dead = false;
  pac.deathAnim = 0;
}

function initGhosts() {
  ghosts = GHOST_DEFS.map((d, i) => ({
    type: d.type,
    tx: d.tx, ty: d.ty,
    prevTx: d.tx, prevTy: d.ty,
    dx: 0, dy: 0,
    vx: d.tx * C + C / 2,
    vy: d.ty * C + C / 2,
    color: d.color, color2: d.color2, name: d.name,
    moveT: i * 60,
    inHouse: true,
    scared: false,
    eaten: false,
    exitTimer: i * 120 + 60,
    _interval: SPEEDS[difficulty].ghost,
    voltarT: 480,
    terraT: 900,
    ignisCooldownT: 300,
  }));
  brokenWalls = [];
  flashEffects = [];
  particles = [];
  fireballs = [];
}


/* ================================================================
   PANTALLAS
   ================================================================ */
function showScr(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'sc-screen') loadScores();
  if (id === 'menu-screen') document.getElementById('mhi').textContent = hiScore;
}

function setDiff(d) {
  difficulty = d;
  document.querySelectorAll('.obtn').forEach(b => b.classList.toggle('ac', b.dataset.d === d));
}

function loadScores() {
  const scores = JSON.parse(localStorage.getItem('pocman_scores') || '[]');
  const el = document.getElementById('sclist');
  if (!scores.length) { el.innerHTML = '<span class="sce">SIN REGISTROS</span>'; return; }
  el.innerHTML = scores.slice(0, 8).map((s, i) => `${i + 1}. ${String(s).padStart(8, '0')}`).join('<br>');
}

function saveScore(s) {
  const scores = JSON.parse(localStorage.getItem('pocman_scores') || '[]');
  scores.push(s);
  scores.sort((a, b) => b - a);
  localStorage.setItem('pocman_scores', JSON.stringify(scores.slice(0, 10)));
  if (s > hiScore) { hiScore = s; localStorage.setItem('pocman_hi', String(hiScore)); }
}

function showOverlay(text, duration) {
  const ov = document.getElementById('ov');
  document.getElementById('ovt').textContent = text;
  ov.classList.add('active');
  setTimeout(() => ov.classList.remove('active'), duration || 1500);
}


/* ================================================================
   FLUJO DEL JUEGO
   ================================================================ */
function startGame() {
  score = 0; lives = 3; level = 1;
  resetMap(); initPac(); initGhosts();
  scaredTimer = 0; ghostEatCombo = 0; frameCount = 0;
  gameState = 'playing';
  showScr('game-screen');
  updateHUD(); updateAbilityBar();
  if ('ontouchstart' in window) document.getElementById('tctrl').style.display = 'block';
}

function nextLevel() {
  level++;
  resetMap(); initPac(); initGhosts();
  scaredTimer = 0; ghostEatCombo = 0;
  gameState = 'playing';
  updateHUD();
  showOverlay('NIVEL ' + level, 1500);
}

function updateHUD() {
  document.getElementById('hscore').textContent = score;
  document.getElementById('hlevel').textContent = level;
  let h = '';
  for (let i = 0; i < lives; i++) h += '\u2665';
  document.getElementById('hlives').textContent = h;
}

function updateAbilityBar() {
  const bar = document.getElementById('abar');
  const colors = { ignis: '#ff4400', glacius: '#00ccff', voltar: '#ffee00', terra: '#44cc44' };
  bar.innerHTML = ghosts.map(g => {
    let pct = 0;
    if (g.type === 'ignis') pct = Math.max(0, 100 - (g.ignisCooldownT / 300) * 100);
    else if (g.type === 'voltar') pct = Math.max(0, 100 - (g.voltarT / 480) * 100);
    else if (g.type === 'terra') pct = Math.max(0, 100 - (g.terraT / 900) * 100);
    return `<div class="abox" style="border-color:${colors[g.type]}44;background:${colors[g.type]}11" title="${g.name}">
      <div class="abar-fill" style="height:${pct}%;background:${colors[g.type]}88"></div>
    </div>`;
  }).join('');
}


/* ================================================================
   INPUT
   ================================================================ */
function setDir(d) {
  if (gameState !== 'playing' || pac.dead) return;
  const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  if (dirs[d]) { pac.ndx = dirs[d][0]; pac.ndy = dirs[d][1]; }
}

document.addEventListener('keydown', e => {
  const m = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
  };
  if (m[e.key]) { e.preventDefault(); setDir(m[e.key]); }
  if (e.key === 'Escape') {
    if (gameState === 'playing') { gameState = 'paused'; showOverlay('PAUSA', 99999); }
    else if (gameState === 'paused') { gameState = 'playing'; document.getElementById('ov').classList.remove('active'); }
  }
});


/* ================================================================
   PARTÍCULAS
   ================================================================ */
function addParticle(x, y, color, life, vx, vy, size) {
  particles.push({ x, y, color, life, maxLife: life, vx: vx || 0, vy: vy || 0, size: size || 2 });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy -= 0.02; p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.size * (p.life / p.maxLife)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}


/* ================================================================
   BOLAS DE FUEGO (IGNIS)
   ================================================================ */
function spawnFireball(g) {
  const dirX = g.dx || 0;
  const dirY = g.dy || -1;
  fireballs.push({
    x: g.vx,
    y: g.vy,
    dx: dirX * 3.5,
    dy: dirY * 3.5,
    life: 180,
    radius: 7,
  });
  flashEffects.push({ x: g.vx, y: g.vy, timer: 12, color: '#ff6600' });
}

function createFireExplosion(x, y) {
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 / 16) * i;
    const speed = 1.5 + Math.random() * 2.5;
    addParticle(x, y,
      Math.random() > 0.3 ? '#ff4400' : '#ffaa00',
      30 + Math.random() * 15,
      Math.cos(a) * speed,
      Math.sin(a) * speed,
      3 + Math.random() * 2
    );
  }
  flashEffects.push({ x, y, timer: 10, color: '#ff8800' });
}

function updateFireballs(dt) {
  for (let i = fireballs.length - 1; i >= 0; i--) {
    const fb = fireballs[i];
    fb.x += fb.dx;
    fb.y += fb.dy;
    fb.life -= 1;

    // Colisión con paredes
    const gridX = Math.floor(fb.x / C);
    const gridY = Math.floor(fb.y / C);
    if (gridX < 0 || gridX >= COLS || gridY < 0 || gridY >= ROWS || map[gridY][gridX] === WALL) {
      createFireExplosion(fb.x, fb.y);
      fireballs.splice(i, 1);
      continue;
    }

    // Colisión con Pac-Man
    if (!pac.dead) {
      const fdx = fb.x - pac.vx, fdy = fb.y - pac.vy;
      if (Math.sqrt(fdx * fdx + fdy * fdy) < C * 0.7) {
        createFireExplosion(fb.x, fb.y);
        fireballs.splice(i, 1);
        pacDie();
        continue;
      }
    }

    // Expiración por tiempo
    if (fb.life <= 0) {
      createFireExplosion(fb.x, fb.y);
      fireballs.splice(i, 1);
      continue;
    }

    // Estela de partículas
    if (frameCount % 2 === 0) {
      addParticle(
        fb.x + (Math.random() - 0.5) * 6,
        fb.y + (Math.random() - 0.5) * 6,
        Math.random() > 0.5 ? '#ff4400' : '#ffcc00',
        12,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        2.5
      );
    }
  }
}

function drawFireballs() {
  for (const fb of fireballs) {
    const pulse = 1 + Math.sin(frameCount * 0.4) * 0.2;
    const r = fb.radius * pulse;

    // Resplandor exterior
    const grad = ctx.createRadialGradient(fb.x, fb.y, 0, fb.x, fb.y, r * 2.5);
    grad.addColorStop(0, 'rgba(255,170,0,0.4)');
    grad.addColorStop(0.5, 'rgba(255,68,0,0.15)');
    grad.addColorStop(1, 'rgba(255,68,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(fb.x, fb.y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo
    const core = ctx.createRadialGradient(fb.x, fb.y, 0, fb.x, fb.y, r);
    core.addColorStop(0, '#ffffcc');
    core.addColorStop(0.4, '#ffaa00');
    core.addColorStop(1, '#ff4400');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(fb.x, fb.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}


/* ================================================================
   PAC-MAN (movimiento fluido por progreso)
   ================================================================ */
function updatePac(dt) {
  if (pac.dead) { pac.deathAnim += dt; return; }

  const interval = SPEEDS[difficulty].pac;
  pac._interval = interval;
  pac.moveT += dt;

  // Ralentización por Glacius
  pac.slowed = false;
  if (scaredTimer <= 0) {
    for (const g of ghosts) {
      if (g.type === 'glacius' && !g.inHouse && !g.eaten &&
          dist(g.tx, g.ty, pac.tx, pac.ty) <= 5) {
        pac.slowed = true; break;
      }
    }
  }

  const effectiveInterval = pac.slowed ? interval * 1.8 : interval;

  while (pac.moveT >= effectiveInterval) {
    pac.moveT -= effectiveInterval;

    pac.prevTx = pac.tx;
    pac.prevTy = pac.ty;

    // Intentar girar
    const nx = wrapX(pac.tx + pac.ndx);
    const ny = pac.ty + pac.ndy;
    if ((pac.ndx !== 0 || pac.ndy !== 0) && isWalkable(nx, ny, false)) {
      pac.dx = pac.ndx;
      pac.dy = pac.ndy;
    }

    // Mover
    const mx = wrapX(pac.tx + pac.dx);
    const my = pac.ty + pac.dy;
    if (isWalkable(mx, my, false)) {
      pac.tx = mx;
      pac.ty = my;
    }

    // Comer
    const tile = map[pac.ty]?.[pac.tx];
    if (tile === DOT) { map[pac.ty][pac.tx] = EMPTY; score += 10; dotsLeft--; }
    else if (tile === POWER) { map[pac.ty][pac.tx] = EMPTY; score += 50; dotsLeft--; activateScared(); }

    // Nivel completo
    if (dotsLeft <= 0) {
      gameState = 'levelup';
      showOverlay('NIVEL COMPLETO', 2000);
      setTimeout(nextLevel, 2000);
      return;
    }

    updateHUD();
  }

  calcVisual(pac);

  // Boca
  if (pac.dx !== 0 || pac.dy !== 0) {
    pac.mouth += 0.15 * pac.mouthD;
    if (pac.mouth > 0.9) pac.mouthD = -1;
    if (pac.mouth < 0.05) pac.mouthD = 1;
  }
}

function activateScared() {
  scaredTimer = 1200;
  ghostEatCombo = 0;
  ghosts.forEach(g => { if (!g.inHouse && !g.eaten) g.scared = true; });
}

function pacDie() {
  pac.dead = true;
  pac.deathAnim = 0;
  lives--;
  updateHUD();
  setTimeout(() => {
    if (lives <= 0) {
      gameState = 'gameover';
      saveScore(score);
      document.getElementById('goscore').textContent = score;
      document.getElementById('gohi').textContent = hiScore;
      setTimeout(() => showScr('go-screen'), 800);
    } else {
      initPac();
      ghosts.forEach((g, i) => {
        g.tx = GHOST_DEFS[i].tx; g.ty = GHOST_DEFS[i].ty;
        g.prevTx = g.tx; g.prevTy = g.ty;
        g.vx = g.tx * C + C / 2; g.vy = g.ty * C + C / 2;
        g.inHouse = true; g.scared = false; g.eaten = false;
        g.exitTimer = i * 120 + 60;
      });
      brokenWalls = []; fireballs = []; scaredTimer = 0;
      gameState = 'playing';
    }
  }, 1200);
}


/* ================================================================
   FANTASMAS (movimiento fluido por progreso)
   ================================================================ */
function updateGhosts(dt) {
  if (scaredTimer > 0) {
    scaredTimer -= dt;
    if (scaredTimer <= 0) { scaredTimer = 0; ghosts.forEach(g => g.scared = false); }
  }

  const spd = SPEEDS[difficulty].ghost;
  const spdS = SPEEDS[difficulty].ghostScared;

  for (const g of ghosts) {
    g._interval = g.scared ? spdS : spd;

    // Comido: regresar rápido
    if (g.eaten) {
      g.moveT += dt * 3;
      while (g.moveT >= spd) {
        g.moveT -= spd;
        g.prevTx = g.tx; g.prevTy = g.ty;
        moveGhostToward(g, 9, 8);
        if (g.tx === 9 && g.ty === 8) {
          g.eaten = false; g.inHouse = true; g.exitTimer = 120;
          g.prevTx = 9; g.prevTy = 9;
          g.tx = 9; g.ty = 9;
        }
      }
      calcVisual(g);
      continue;
    }

    // Salida de la casa
    if (g.inHouse) {
      g.exitTimer -= dt;
      if (g.exitTimer <= 0) {
        if (g.ty > 7) {
          g.prevTy = g.ty;
          g.ty--;
          g.moveT = 0;
        } else {
          g.inHouse = false;
          g.prevTx = 9; g.prevTy = 8;
          g.tx = 9; g.ty = 7;
          g.dx = 0; g.dy = -1;
          g.moveT = 0;
        }
      }
      calcVisual(g);
      continue;
    }

    // Movimiento normal
    const interval = g.scared ? spdS : spd;
    g.moveT += dt;
    while (g.moveT >= interval) {
      g.moveT -= interval;
      g.prevTx = g.tx; g.prevTy = g.ty;
      moveGhost(g);
    }

    calcVisual(g);

    // Habilidades
    if (!g.scared) {
      switch (g.type) {
        case 'ignis':   updateIgnis(g);   break;
        case 'glacius': updateGlacius(g); break;
        case 'voltar':  updateVoltar(g);  break;
        case 'terra':   updateTerra(g);   break;
      }
    }
  }

  // Paredes rotas
  for (let i = brokenWalls.length - 1; i >= 0; i--) {
    brokenWalls[i].timer -= dt;
    if (brokenWalls[i].timer <= 0) {
      map[brokenWalls[i].y][brokenWalls[i].x] = WALL;
      brokenWalls.splice(i, 1);
    }
  }

  // Flashes
  for (let i = flashEffects.length - 1; i >= 0; i--) {
    flashEffects[i].timer -= dt;
    if (flashEffects[i].timer <= 0) flashEffects.splice(i, 1);
  }

  updateAbilityBar();
}

function moveGhostToward(g, tx, ty) {
  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  let bestDir = null, bestDist = 9999;
  for (const [ddx, ddy] of dirs) {
    const nx = wrapX(g.tx + ddx), ny = g.ty + ddy;
    const isRev = ddx === -g.dx && ddy === -g.dy && (g.dx !== 0 || g.dy !== 0);
    if (isWalkable(nx, ny, true) && !isRev) {
      const d = dist(nx, ny, tx, ty);
      if (d < bestDist) { bestDist = d; bestDir = [ddx, ddy]; }
    }
  }
  if (bestDir) {
    g.dx = bestDir[0]; g.dy = bestDir[1];
    g.tx = wrapX(g.tx + g.dx); g.ty = g.ty + g.dy;
  }
}

function moveGhost(g) {
  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  const isRev = (dx, dy) => dx === -g.dx && dy === -g.dy && (g.dx !== 0 || g.dy !== 0);

  // Modo asustado: huir
  if (g.scared) {
    let bestDir = null, bestDist = -1;
    const sh = [...dirs]; shuffle(sh);
    for (const [ddx, ddy] of sh) {
      const nx = wrapX(g.tx + ddx), ny = g.ty + ddy;
      if (isWalkable(nx, ny, true) && !isRev(ddx, ddy)) {
        const d = dist(nx, ny, pac.tx, pac.ty);
        if (d > bestDist) { bestDist = d; bestDir = [ddx, ddy]; }
      }
    }
    if (bestDir) { g.dx = bestDir[0]; g.dy = bestDir[1]; }
    const nx = wrapX(g.tx + g.dx), ny = g.ty + g.dy;
    if (isWalkable(nx, ny, true)) { g.tx = nx; g.ty = ny; }
    return;
  }

  // Modo normal
  let targetX = pac.tx, targetY = pac.ty;

  switch (g.type) {
    case 'ignis':
      break;
    case 'glacius':
      targetX = wrapX(pac.tx + pac.dx * 4);
      targetY = pac.ty + pac.dy * 4;
      break;
    case 'voltar':
      if (Math.random() < 0.5) {
        const sh2 = [...dirs].filter(([dx, dy]) => !isRev(dx, dy));
        shuffle(sh2);
        for (const [ddx, ddy] of sh2) {
          const nx = wrapX(g.tx + ddx), ny = g.ty + ddy;
          if (isWalkable(nx, ny, true)) {
            g.dx = ddx; g.dy = ddy;
            const nnx = wrapX(g.tx + g.dx), nny = g.ty + g.dy;
            if (isWalkable(nnx, nny, true)) { g.tx = nnx; g.ty = nny; }
            return;
          }
        }
      }
      break;
    case 'terra':
      if (dist(g.tx, g.ty, pac.tx, pac.ty) > 7) {
        const sh3 = [...dirs].filter(([dx, dy]) => !isRev(dx, dy));
        shuffle(sh3);
        for (const [ddx, ddy] of sh3) {
          const nx = wrapX(g.tx + ddx), ny = g.ty + ddy;
          if (isWalkable(nx, ny, true)) {
            g.dx = ddx; g.dy = ddy;
            const nnx = wrapX(g.tx + g.dx), nny = g.ty + g.dy;
            if (isWalkable(nnx, nny, true)) { g.tx = nnx; g.ty = nny; }
            return;
          }
        }
      }
      break;
  }

  let bestDir = null, bestDist2 = 9999;
  const sh4 = [...dirs]; shuffle(sh4);
  for (const [ddx, ddy] of sh4) {
    const nx = wrapX(g.tx + ddx), ny = g.ty + ddy;
    if (isWalkable(nx, ny, true) && !isRev(ddx, ddy)) {
      const d = dist(nx, ny, targetX, targetY);
      if (d < bestDist2) { bestDist2 = d; bestDir = [ddx, ddy]; }
    }
  }

  if (bestDir) { g.dx = bestDir[0]; g.dy = bestDir[1]; }
  const fnx = wrapX(g.tx + g.dx), fny = g.ty + g.dy;
  if (isWalkable(fnx, fny, true)) { g.tx = fnx; g.ty = fny; }
}


/* ================================================================
   HABILIDADES ELEMENTALES
   ================================================================ */

/** IGNIS: lanza una bola de fuego cada 5 segundos en su dirección */
function updateIgnis(g) {
  if (g.ignisCooldownT > 0) {
    g.ignisCooldownT -= 1;
  }

  if (g.ignisCooldownT <= 0) {
    g.ignisCooldownT = 300; // 5 segundos
    spawnFireball(g);

    // Partículas de disparo
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i;
      addParticle(g.vx, g.vy, '#ff6600', 15,
        Math.cos(a) * 2, Math.sin(a) * 2, 2.5);
    }
  }

  // Lligeras partículas de fuego ambiental
  if (frameCount % 5 === 0) {
    addParticle(
      g.vx + (Math.random() - 0.5) * 10,
      g.vy - 6,
      Math.random() > 0.5 ? '#ff660066' : '#ffaa0044',
      14,
      (Math.random() - 0.5) * 0.3,
      -0.6 - Math.random() * 0.4,
      2
    );
  }
}

/** GLACIUS: partículas de hielo cerca de Pac-Man */
function updateGlacius(g) {
  if (dist(g.tx, g.ty, pac.tx, pac.ty) <= 6 && frameCount % 4 === 0) {
    addParticle(
      g.vx + (Math.random() - 0.5) * 20,
      g.vy + (Math.random() - 0.5) * 20,
      Math.random() > 0.5 ? '#88eeff' : '#ffffff',
      25,
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.8,
      2
    );
  }
}

/** VOLTAR: teletransporte aleatorio cada ~8 segundos */
function updateVoltar(g) {
  g.voltarT -= 1;
  if (g.voltarT <= 0) {
    g.voltarT = 480 + Math.random() * 120;

    const candidates = [];
    for (let y = 1; y < ROWS - 1; y++) {
      for (let x = 1; x < COLS - 1; x++) {
        if (isWalkable(x, y, true) && map[y][x] !== GHOUSE && dist(x, y, pac.tx, pac.ty) > 5) {
          candidates.push({ x, y });
        }
      }
    }

    if (candidates.length > 0) {
      flashEffects.push({ x: g.vx, y: g.vy, timer: 15, color: '#ffee00' });
      const dest = candidates[Math.floor(Math.random() * candidates.length)];
      g.tx = dest.x; g.ty = dest.y;
      g.prevTx = dest.x; g.prevTy = dest.y;
      g.vx = g.tx * C + C / 2; g.vy = g.ty * C + C / 2;
      flashEffects.push({ x: g.vx, y: g.vy, timer: 15, color: '#ffee00' });
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i;
        addParticle(g.vx, g.vy, '#ffee00', 20, Math.cos(a) * 3, Math.sin(a) * 3, 2.5);
      }
    }
  }

  if (frameCount % 2 === 0) {
    const a = Math.random() * Math.PI * 2;
    const r = 14 + Math.random() * 4;
    addParticle(g.vx + Math.cos(a) * r, g.vy + Math.sin(a) * r,
      '#ffff88', 10, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 1.5);
  }
}

/** TERRA: rompe una pared interna cada ~15 segundos */
function updateTerra(g) {
  g.terraT -= 1;
  if (g.terraT <= 0) {
    g.terraT = 900 + Math.random() * 180;

    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    shuffle(dirs);

    for (const [ddx, ddy] of dirs) {
      const nx = g.tx + ddx, ny = g.ty + ddy;
      if (nx > 0 && nx < COLS - 1 && ny > 0 && ny < ROWS - 1 && map[ny][nx] === WALL) {
        let open = 0;
        for (const [dx2, dy2] of dirs) {
          const cx = nx + dx2, cy = ny + dy2;
          if (cx >= 0 && cx < COLS && cy >= 0 && cy < ROWS && map[cy][cx] !== WALL) open++;
        }
        if (open >= 2) {
          map[ny][nx] = EMPTY;
          brokenWalls.push({ x: nx, y: ny, timer: 480 });
          for (let i = 0; i < 8; i++) {
            addParticle(nx * C + C / 2, ny * C + C / 2,
              Math.random() > 0.5 ? '#886644' : '#aa8866', 30,
              (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3 - 1, 3);
          }
          break;
        }
      }
    }
  }

  if (frameCount % 6 === 0) {
    addParticle(g.vx + (Math.random() - 0.5) * 10, g.vy + 10,
      '#665533', 18, (Math.random() - 0.5) * 0.5, 0.3, 2);
  }
}


/* ================================================================
   COLISIONES
   ================================================================ */
function checkCollisions() {
  for (const g of ghosts) {
    if (g.inHouse || g.eaten) continue;
    if (g.tx === pac.tx && g.ty === pac.ty) {
      if (g.scared) {
        g.eaten = true; g.scared = false;
        ghostEatCombo++;
        score += 200 * Math.pow(2, ghostEatCombo - 1);
        updateHUD();
        for (let i = 0; i < 10; i++) {
          addParticle(g.vx, g.vy, g.color, 25,
            (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 3);
        }
      } else {
        pacDie();
      }
    }
  }
}


/* ================================================================
   RENDERIZADO
   ================================================================ */
function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  drawMaze();
  drawBrokenWalls();
  drawDots();
  drawFireballs();
  drawPac();
  drawGhosts();
  drawParticles();
  drawFlashes();
  drawSlowedEffect();
  drawCenterMark();
}

function drawMaze() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (map[y][x] === WALL && !brokenWalls.find(b => b.x === x && b.y === y)) {
        const px = x * C, py = y * C;
        ctx.fillStyle = '#0c0c2a';
        ctx.fillRect(px + 1, py + 1, C - 2, C - 2);
        ctx.strokeStyle = '#3344cc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (y > 0 && map[y - 1][x] !== WALL) { ctx.moveTo(px, py + 1); ctx.lineTo(px + C, py + 1); }
        if (y < ROWS - 1 && map[y + 1][x] !== WALL) { ctx.moveTo(px, py + C - 1); ctx.lineTo(px + C, py + C - 1); }
        if (x > 0 && map[y][x - 1] !== WALL) { ctx.moveTo(px + 1, py); ctx.lineTo(px + 1, py + C); }
        if (x < COLS - 1 && map[y][x + 1] !== WALL) { ctx.moveTo(px + C - 1, py); ctx.lineTo(px + C - 1, py + C); }
        ctx.stroke();
      }
    }
  }
  ctx.fillStyle = '#ff88cc';
  ctx.fillRect(9 * C + 2, 8 * C + C - 4, C - 4, 4);
}

function drawBrokenWalls() {
  for (const bw of brokenWalls) {
    const px = bw.x * C, py = bw.y * C;
    ctx.fillStyle = '#332211';
    ctx.fillRect(px + 1, py + 1, C - 2, C - 2);
    ctx.strokeStyle = '#554422';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + 4, py + 4); ctx.lineTo(px + C / 2, py + C / 2); ctx.lineTo(px + C - 6, py + C - 8);
    ctx.moveTo(px + C - 4, py + 6); ctx.lineTo(px + C / 3, py + C - 4);
    ctx.stroke();
    const pct = bw.timer / 480;
    ctx.fillStyle = `rgba(68,204,68,${pct * 0.3})`;
    ctx.fillRect(px + 1, py + 1, C - 2, C - 2);
  }
}

function drawDots() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = x * C + C / 2, py = y * C + C / 2;
      if (map[y][x] === DOT) {
        ctx.fillStyle = '#ffcc44';
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
      } else if (map[y][x] === POWER) {
        const pulse = 0.6 + Math.sin(frameCount * 0.1) * 0.4;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#ffcc44';
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function drawPac() {
  if (pac.dead) {
    const progress = Math.min(pac.deathAnim / 60, 1);
    const angle = Math.PI * progress;
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.moveTo(pac.vx, pac.vy);
    ctx.arc(pac.vx, pac.vy, C / 2 - 2, angle, Math.PI * 2 - angle);
    ctx.closePath();
    ctx.fill();
    return;
  }

  if (pac.slowed) {
    ctx.strokeStyle = '#00ccff44';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(pac.vx, pac.vy, C / 2 + 2, 0, Math.PI * 2); ctx.stroke();
  }

  const mouthAngle = pac.mouth * 0.4;
  let startAngle = 0;
  if (pac.dx === 1) startAngle = 0;
  else if (pac.dx === -1) startAngle = Math.PI;
  else if (pac.dy === -1) startAngle = -Math.PI / 2;
  else if (pac.dy === 1) startAngle = Math.PI / 2;

  ctx.fillStyle = '#ffdd00';
  ctx.shadowColor = '#ffdd0066';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(pac.vx, pac.vy);
  ctx.arc(pac.vx, pac.vy, C / 2 - 2, startAngle + mouthAngle, startAngle + Math.PI * 2 - mouthAngle);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawGhosts() {
  for (const g of ghosts) {
    const x = g.vx, y = g.vy, r = C / 2 - 2;

    if (g.eaten) { drawGhostEyes(x, y, g.dx, g.dy); continue; }

    if (g.scared) {
      const flash = scaredTimer < 120 && Math.floor(frameCount / 8) % 2 === 0;
      ctx.fillStyle = flash ? '#ffffff' : '#2222dd';
      drawGhostBody(x, y, r);
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x - 4, y - 2, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 4, y - 2, 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 6, y + 4);
      for (let i = 0; i < 5; i++) ctx.lineTo(x - 6 + i * 3, y + 4 + (i % 2 === 0 ? -2 : 2));
      ctx.stroke();
      continue;
    }

    const grad = ctx.createRadialGradient(x, y - 4, 0, x, y, r + 4);
    grad.addColorStop(0, g.color2);
    grad.addColorStop(1, g.color);
    ctx.fillStyle = grad;
    drawGhostBody(x, y, r);

    ctx.shadowColor = g.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(0,0,0,0)';
    drawGhostBody(x, y, r);
    ctx.shadowBlur = 0;

    drawGhostEyes(x, y, g.dx, g.dy);
    drawGhostEffect(g, x, y, r);
  }
}

function drawGhostBody(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y - 2, r, Math.PI, 0);
  ctx.lineTo(x + r, y + r - 2);
  const wave = Math.sin(frameCount * 0.15) * 2;
  for (let i = 0; i <= 4; i++) {
    ctx.lineTo(x + r - (r * 2 / 4) * i, y + r - 2 + (i % 2 === 0 ? 4 + wave : -1 - wave));
  }
  ctx.closePath();
  ctx.fill();
}

function drawGhostEyes(x, y, dx, dy) {
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(x - 5, y - 3, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 5, y - 3, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  const px = dx * 2, py = dy * 2;
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(x - 5 + px, y - 3 + py, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5 + px, y - 3 + py, 2, 0, Math.PI * 2); ctx.fill();
}

function drawGhostEffect(g, x, y, r) {
  switch (g.type) {
    case 'ignis':
      ctx.fillStyle = '#ff880088';
      for (let i = 0; i < 3; i++) {
        const fx = x - 6 + i * 6 + Math.sin(frameCount * 0.2 + i) * 3;
        const fy = y - r - 2 - Math.random() * 4;
        ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
      }
      // Indicador de cooldown: brillo cuando está listo para disparar
      if (g.ignisCooldownT <= 30) {
        ctx.strokeStyle = `rgba(255,100,0,${0.5 + Math.sin(frameCount * 0.3) * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, r + 5, 0, Math.PI * 2); ctx.stroke();
      }
      break;
    case 'glacius':
      ctx.strokeStyle = '#aaeeff44'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - r + 2, y - 4); ctx.lineTo(x + r - 2, y - 6);
      ctx.moveTo(x - r + 4, y); ctx.lineTo(x + r - 4, y + 2);
      ctx.stroke();
      break;
    case 'voltar':
      ctx.strokeStyle = '#ffff6666'; ctx.lineWidth = 1;
      const angle = frameCount * 0.1;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = angle + (Math.PI * 2 / 6) * i;
        const rx = x + Math.cos(a) * (r + 3), ry = y + Math.sin(a) * (r + 1);
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx + (Math.random() - 0.5) * 4, ry + (Math.random() - 0.5) * 4);
      }
      ctx.closePath(); ctx.stroke();
      break;
    case 'terra':
      ctx.fillStyle = '#22662244';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x - 5 + (i % 2) * 10, y + (i < 2 ? -4 : 4), 3, 3);
      }
      break;
  }
}

function drawFlashes() {
  for (const f of flashEffects) {
    const a = f.timer / 15;
    ctx.globalAlpha = a * 0.6;
    ctx.fillStyle = f.color;
    ctx.beginPath(); ctx.arc(f.x, f.y, 20 * (1 - a) + 5, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawSlowedEffect() {
  if (pac.slowed) {
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.6);
    grad.addColorStop(0, 'rgba(0,204,255,0)');
    grad.addColorStop(1, 'rgba(0,100,200,0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }
}

function drawCenterMark() {
  if (pac.dx === 0 && pac.dy === 0 && !pac.dead) {
    ctx.fillStyle = 'rgba(255,221,0,0.15)';
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', 9 * C + C / 2, 15 * C + C / 2 + 1);
  }
}


/* ================================================================
   GAME LOOP
   ================================================================ */
function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);

  if (!lastTime) { lastTime = timestamp; return; }

  let dt = timestamp - lastTime;
  lastTime = timestamp;
  if (dt > 100) dt = 100;

  if (gameState === 'playing') {
    accumulator += dt;
    while (accumulator >= TICK) {
      frameCount++;
      updatePac(TICK);
      updateGhosts(TICK);
      updateFireballs(TICK);
      updateParticles();
      if (!pac.dead) checkCollisions();
      accumulator -= TICK;
    }
  }

  if (gameState === 'playing' || gameState === 'levelup' || gameState === 'gameover') {
    draw();
  }
}


/* ================================================================
   INICIO
   ================================================================ */
document.getElementById('mhi').textContent = hiScore;
if ('ontouchstart' in window) document.getElementById('tctrl').style.display = 'block';
requestAnimationFrame(gameLoop);