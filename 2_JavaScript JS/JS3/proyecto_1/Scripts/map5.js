// ============================================
// MAPA DEL NIVEL 5 - VOLCÁNICO - MUY DIFÍCIL
// Pasillos de 1 celda, muchos dead-ends, sin atajos
// ============================================

var MAZE_LAYOUT = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0],
    [0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0],
    [0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,0],
    [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0],
    [0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1,0],
    [0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0],
    [0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,0,1,1,1,0],
    [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

var MAZE_ROWS = MAZE_LAYOUT.length;
var MAZE_COLS = MAZE_LAYOUT[0].length;

function isOnPath(gridX, gridY) {
    const mc = Math.floor(gridX / COLS * MAZE_COLS);
    const mr = Math.floor(gridY / ROWS * MAZE_ROWS);
    if (mr < 0 || mr >= MAZE_ROWS || mc < 0 || mc >= MAZE_COLS) return false;
    return MAZE_LAYOUT[mr][mc] === 1;
}

function getPathCells() {
    const cells = [];
    for (let gy = 0; gy < ROWS; gy++) {
        for (let gx = 0; gx < COLS; gx++) {
            if (isOnPath(gx, gy)) cells.push({ x: gx, y: gy });
        }
    }
    return cells;
}

// ============================================
// DIBUJAR CELDA VOLCÁNICA
// ============================================

function drawMazeCell(x, y, w, h, isPath) {
    const col = Math.floor(x / w);
    const row = Math.floor(y / h);
    const noise = Math.sin(col * 0.41 + row * 0.33) * Math.cos(col * 0.19 + row * 0.27);

    if (isPath) {
        // Roca volcánica oscura (caminos)
        const lavaGrad = ctx.createLinearGradient(x, y, x + w * 0.3, y + h);
        if (noise > 0.3) {
            lavaGrad.addColorStop(0, '#2A1510');
            lavaGrad.addColorStop(0.5, '#221008');
            lavaGrad.addColorStop(1, '#1A0A05');
        } else if (noise > -0.1) {
            lavaGrad.addColorStop(0, '#251210');
            lavaGrad.addColorStop(0.5, '#1E0E08');
            lavaGrad.addColorStop(1, '#160805');
        } else {
            lavaGrad.addColorStop(0, '#201010');
            lavaGrad.addColorStop(0.5, '#180C06');
            lavaGrad.addColorStop(1, '#100604');
        }
        ctx.fillStyle = lavaGrad;
        ctx.fillRect(x, y, w, h);

        // Grietas con lava incandescente
        const crackSeed = (col * 31 + row * 17) % 20;
        if (crackSeed < 8) {
            ctx.strokeStyle = `rgba(255, ${80 + crackSeed * 12}, 0, ${0.3 + Math.sin(Date.now() * 0.003 + col + row) * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            const cx1 = x + ((crackSeed * 7) % 100) / 100 * w;
            const cy1 = y + ((crackSeed * 13) % 100) / 100 * h;
            const cx2 = x + ((crackSeed * 11 + 30) % 100) / 100 * w;
            const cy2 = y + ((crackSeed * 9 + 40) % 100) / 100 * h;
            ctx.moveTo(cx1, cy1);
            ctx.lineTo(cx2, cy2);
            if (crackSeed < 4) {
                const cx3 = x + ((crackSeed * 7 + 60) % 100) / 100 * w;
                const cy3 = y + ((crackSeed * 13 + 50) % 100) / 100 * h;
                ctx.lineTo(cx3, cy3);
            }
            ctx.stroke();

            // Brillo de la grieta
            ctx.fillStyle = `rgba(255, 150, 30, ${0.08 + Math.sin(Date.now() * 0.004 + crackSeed) * 0.05})`;
            ctx.beginPath();
            ctx.arc(cx1, cy1, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Textura de roca porosa
        ctx.fillStyle = 'rgba(60, 25, 10, 0.15)';
        if ((col + row) % 4 === 0) {
            ctx.fillRect(x, y, w * 0.3, h * 0.3);
        }
    } else {
        // Roca volcánica muy oscura (muros)
        let rockColor;
        if (noise > 0.35) rockColor = '#120805';
        else if (noise > 0.05) rockColor = '#0E0604';
        else if (noise > -0.2) rockColor = '#0A0403';
        else rockColor = '#060302';
        ctx.fillStyle = rockColor;
        ctx.fillRect(x, y, w, h);

        // Brillo de lava en los bordes de los muros (se dibuja después)
        if (noise > 0.15) {
            ctx.fillStyle = 'rgba(80, 20, 0, 0.2)';
            ctx.fillRect(x, y, w, h);
        }
    }
}

// ============================================
// FONDO PRINCIPAL VOLCÁNICO
// ============================================

function drawMapBackground() {
    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / MAZE_COLS;
    const cellH = ch / MAZE_ROWS;

    // Fondo base casi negro
    ctx.fillStyle = '#080302';
    ctx.fillRect(0, 0, cw, ch);

    // Dibujar laberinto
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            const x = mc * cellW;
            const y = mr * cellH;
            drawMazeCell(x, y, cellW, cellH, MAZE_LAYOUT[mr][mc] === 1);
        }
    }

    // Bordes con brillo de lava
    ctx.lineWidth = 2;
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const x = mc * cellW;
            const y = mr * cellH;
            const pulse = Math.sin(Date.now() * 0.003 + mc * 0.5 + mr * 0.7) * 0.15 + 0.45;

            if (mr === 0 || MAZE_LAYOUT[mr-1][mc] !== 1) {
                const g = ctx.createLinearGradient(x, y, x, y + 4);
                g.addColorStop(0, `rgba(255, 100, 0, ${pulse})`);
                g.addColorStop(1, 'rgba(255, 60, 0, 0)');
                ctx.strokeStyle = g;
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cellW, y); ctx.stroke();
            }
            if (mr === MAZE_ROWS-1 || MAZE_LAYOUT[mr+1][mc] !== 1) {
                const g = ctx.createLinearGradient(x, y + cellH, x, y + cellH - 4);
                g.addColorStop(0, `rgba(255, 100, 0, ${pulse})`);
                g.addColorStop(1, 'rgba(255, 60, 0, 0)');
                ctx.strokeStyle = g;
                ctx.beginPath(); ctx.moveTo(x, y + cellH); ctx.lineTo(x + cellW, y + cellH); ctx.stroke();
            }
            if (mc === 0 || MAZE_LAYOUT[mr][mc-1] !== 1) {
                const g = ctx.createLinearGradient(x, y, x + 4, y);
                g.addColorStop(0, `rgba(255, 100, 0, ${pulse})`);
                g.addColorStop(1, 'rgba(255, 60, 0, 0)');
                ctx.strokeStyle = g;
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cellH); ctx.stroke();
            }
            if (mc === MAZE_COLS-1 || MAZE_LAYOUT[mr][mc+1] !== 1) {
                const g = ctx.createLinearGradient(x + cellW, y, x + cellW - 4, y);
                g.addColorStop(0, `rgba(255, 100, 0, ${pulse})`);
                g.addColorStop(1, 'rgba(255, 60, 0, 0)');
                ctx.strokeStyle = g;
                ctx.beginPath(); ctx.moveTo(x + cellW, y); ctx.lineTo(x + cellW, y + cellH); ctx.stroke();
            }
        }
    }

    drawPathGrid(cellW, cellH);
    drawMazeTrees(cellW, cellH);
    drawMazeRocks(cellW, cellH);
    drawMazeDecorations(cellW, cellH);
    drawEmbers(cw, ch);
    drawLavaPools(cellW, cellH);

    // Viñeta roja oscura
    const vignette = ctx.createRadialGradient(cw/2, ch/2, cw * 0.2, cw/2, ch/2, cw * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.5, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(40, 5, 0, 0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);

    // Resplandor rojo general desde abajo
    const bottomGlow = ctx.createLinearGradient(0, ch * 0.7, 0, ch);
    bottomGlow.addColorStop(0, 'rgba(0,0,0,0)');
    bottomGlow.addColorStop(1, 'rgba(120, 20, 0, 0.12)');
    ctx.fillStyle = bottomGlow;
    ctx.fillRect(0, ch * 0.7, cw, ch * 0.3);
}

// ============================================
// GRILLA (grietas tenues en la roca)
// ============================================

function drawPathGrid(cellW, cellH) {
    const gw = canvas.width / COLS;
    const gh = canvas.height / ROWS;

    ctx.save();
    ctx.strokeStyle = 'rgba(80, 30, 5, 0.18)';
    ctx.lineWidth = 0.6;

    for (let gx = 0; gx <= COLS; gx++) {
        const px = gx * gw;
        let inPath = false, segStart = 0;
        for (let gy = 0; gy <= ROWS; gy++) {
            const onPath = gy < ROWS && isOnPath(gx < COLS ? gx : gx - 1, gy) && (gx > 0 && isOnPath(gx - 1, gy));
            if (onPath && !inPath) { segStart = gy * gh; inPath = true; }
            else if (!onPath && inPath) { ctx.beginPath(); ctx.moveTo(px, segStart); ctx.lineTo(px, gy * gh); ctx.stroke(); inPath = false; }
        }
    }
    for (let gy = 0; gy <= ROWS; gy++) {
        const py = gy * gh;
        let inPath = false, segStart = 0;
        for (let gx = 0; gx <= COLS; gx++) {
            const onPath = gx < COLS && isOnPath(gx, gy < ROWS ? gy : gy - 1) && (gy > 0 && isOnPath(gx, gy - 1));
            if (onPath && !inPath) { segStart = gx * gw; inPath = true; }
            else if (!onPath && inPath) { ctx.beginPath(); ctx.moveTo(segStart, py); ctx.lineTo(gx * gw, py); ctx.stroke(); inPath = false; }
        }
    }
    ctx.restore();
}

// ============================================
// ROCAS VOLCÁNICAS
// ============================================

function drawMazeRocks(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;
            const treeHash = (mr * 7 + mc * 13) % 10;
            if (treeHash < 5) continue;
            const hash = (mr * 17 + mc * 11) % 15;
            if (hash > 5) continue;
            const cx = (mc + 0.5 + (Math.sin(mr * 2.1 + mc) * 0.25)) * cellW;
            const cy = (mr + 0.6 + (Math.cos(mr + mc * 1.7) * 0.15)) * cellH;
            const sizeVar = 0.5 + ((mr * 5 + mc * 3) % 10) * 0.055;
            drawVolcanicRock(cx, cy, cellW * 0.28 * sizeVar);
        }
    }
}

function drawVolcanicRock(x, y, r) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.1, y + r * 0.4, r * 0.85, r * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createRadialGradient(x - r * 0.15, y - r * 0.2, r * 0.05, x, y, r * 1.05);
    grad.addColorStop(0, '#3A2015');
    grad.addColorStop(0.4, '#2A1510');
    grad.addColorStop(0.8, '#1A0A08');
    grad.addColorStop(1, '#100505');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(x - r * 0.6, y + r * 0.2);
    ctx.lineTo(x - r * 0.7, y - r * 0.2);
    ctx.lineTo(x - r * 0.4, y - r * 0.8);
    ctx.lineTo(x + r * 0.15, y - r * 0.85);
    ctx.lineTo(x + r * 0.6, y - r * 0.65);
    ctx.lineTo(x + r * 0.8, y - r * 0.1);
    ctx.lineTo(x + r * 0.65, y + r * 0.35);
    ctx.lineTo(x + r * 0.1, y + r * 0.45);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(60, 20, 5, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Grieta con brillo de lava
    const pulse = Math.sin(Date.now() * 0.004 + x * 0.01) * 0.2 + 0.5;
    ctx.strokeStyle = `rgba(255, 80, 0, ${pulse * 0.4})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.2, y - r * 0.5);
    ctx.lineTo(x + r * 0.1, y - r * 0.1);
    ctx.lineTo(x - r * 0.05, y + r * 0.2);
    ctx.stroke();

    // Brillo de la grieta
    ctx.fillStyle = `rgba(255, 120, 20, ${pulse * 0.15})`;
    ctx.beginPath();
    ctx.arc(x + r * 0.1, y - r * 0.1, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// ÁRBOLES VOLCÁNICOS (troncos quemados)
// ============================================

function drawMazeTrees(cellW, cellH) {
    const treeSpots = [];
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] === 0) {
                const hash = (mr * 7 + mc * 13) % 10;
                if (hash < 5) treeSpots.push({ mr, mc });
            }
        }
    }

    for (const { mr, mc } of treeSpots) {
        const cx = (mc + 0.5) * cellW;
        const cy = (mr + 0.5) * cellH;
        const sizeFactor = 0.5 + ((mr * 3 + mc * 5) % 10) * 0.07;
        const type = (mr * 11 + mc * 7) % 4;
        if (type === 0) drawBurntTree(cx, cy, cellW * 0.4 * sizeFactor);
        else if (type === 1) drawCharredStump(cx, cy, cellW * 0.35 * sizeFactor);
        else if (type === 2) drawDeadBranch(cx, cy, cellW * 0.35 * sizeFactor);
        else drawLavaVent(cx, cy, cellW * 0.3 * sizeFactor);
    }
}

function drawBurntTree(x, y, r) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.08, y + r * 0.45, r * 0.45, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tronco carbonizado
    const trunkGrad = ctx.createLinearGradient(x - r * 0.1, 0, x + r * 0.1, 0);
    trunkGrad.addColorStop(0, '#1A0A05');
    trunkGrad.addColorStop(0.5, '#2A1510');
    trunkGrad.addColorStop(1, '#1A0A05');
    ctx.fillStyle = trunkGrad;
    ctx.fillRect(x - r * 0.1, y - r * 0.3, r * 0.2, r * 0.75);

    // Rama rota
    ctx.strokeStyle = '#201008';
    ctx.lineWidth = r * 0.08;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 0.2);
    ctx.lineTo(x - r * 0.4, y - r * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - r * 0.15);
    ctx.lineTo(x + r * 0.35, y - r * 0.55);
    ctx.stroke();

    // Brillo de brasas en la base
    const pulse = Math.sin(Date.now() * 0.005 + x) * 0.2 + 0.4;
    ctx.fillStyle = `rgba(255, 80, 0, ${pulse * 0.25})`;
    ctx.beginPath();
    ctx.arc(x, y + r * 0.4, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
}

function drawCharredStump(x, y, r) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.2, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createRadialGradient(x, y - r * 0.1, 0, x, y - r * 0.1, r * 0.4);
    grad.addColorStop(0, '#2A1510');
    grad.addColorStop(0.6, '#1A0A05');
    grad.addColorStop(1, '#100505');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.1, r * 0.35, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Anillos expuestos
    ctx.strokeStyle = 'rgba(60, 25, 10, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.1, r * 0.2, r * 0.14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.1, r * 0.1, r * 0.07, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Brasa
    const p = Math.sin(Date.now() * 0.006 + y) * 0.15 + 0.3;
    ctx.fillStyle = `rgba(255, 60, 0, ${p})`;
    ctx.beginPath();
    ctx.arc(x - r * 0.1, y - r * 0.15, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
}

function drawDeadBranch(x, y, r) {
    ctx.strokeStyle = '#1A0A05';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - r * 0.3, y + r * 0.3);
    ctx.quadraticCurveTo(x, y, x + r * 0.4, y - r * 0.5);
    ctx.stroke();

    ctx.lineWidth = r * 0.06;
    ctx.beginPath();
    ctx.moveTo(x + r * 0.1, y - r * 0.15);
    ctx.lineTo(x + r * 0.5, y - r * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + r * 0.25, y - r * 0.35);
    ctx.lineTo(x - r * 0.1, y - r * 0.6);
    ctx.stroke();
}

function drawLavaVent(x, y, r) {
    // Abertura en el suelo
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.5);
    grad.addColorStop(0, '#FF6000');
    grad.addColorStop(0.3, '#CC3300');
    grad.addColorStop(0.7, '#661500');
    grad.addColorStop(1, '#1A0A05');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.4, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brillo
    const pulse = Math.sin(Date.now() * 0.005 + x * 0.1) * 0.2 + 0.5;
    const glow = ctx.createRadialGradient(x, y - r * 0.3, 0, x, y - r * 0.3, r * 0.8);
    glow.addColorStop(0, `rgba(255, 100, 0, ${pulse * 0.2})`);
    glow.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y - r * 0.3, r * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Humo
    const time = Date.now() * 0.002;
    for (let i = 0; i < 4; i++) {
        const sy = y - r * 0.5 - i * r * 0.35;
        const sx = x + Math.sin(time + i * 1.5) * r * 0.2;
        const sr = r * (0.15 + i * 0.08);
        const alpha = 0.12 - i * 0.025;
        ctx.fillStyle = `rgba(60, 40, 30, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================
// BRASAS Y PARTÍCULAS DE FUEGO
// ============================================

function drawEmbers(cw, ch) {
    const time = Date.now() * 0.001;
    const rng = (function() {
        let s = 88;
        return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })();

    for (let i = 0; i < 60; i++) {
        const baseX = rng() * cw;
        const baseSpeed = 10 + rng() * 25;
        const baseSize = 0.8 + rng() * 2;
        const drift = rng() * 15 + 5;
        const lifePhase = rng() * Math.PI * 2;

        const fx = baseX + Math.sin(time * 0.8 + i * 0.9) * drift;
        const fy = ((time * baseSpeed + i * 89) % (ch + 30)) - 15;
        const life = Math.sin(time * 2 + lifePhase) * 0.5 + 0.5;

        const r = 255;
        const g = Math.floor(50 + life * 150);
        const b = 0;
        const alpha = life * (0.3 + rng() * 0.4);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(fx, fy, baseSize * (0.5 + life * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Resplandor de las brasas grandes
        if (baseSize > 2 && life > 0.6) {
            const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, baseSize * 3);
            glow.addColorStop(0, `rgba(255, 120, 0, ${life * 0.1})`);
            glow.addColorStop(1, 'rgba(255, 60, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(fx, fy, baseSize * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ============================================
// POZAS DE LAVA EN LOS CAMINOS
// ============================================

function drawLavaPools(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const hash = (mr * 23 + mc * 19) % 35;
            if (hash !== 5 && hash !== 15) continue;

            const x = (mc + 0.5) * cellW;
            const y = (mr + 0.5) * cellH;
            const r = cellW * (hash === 5 ? 0.2 : 0.15);

            // Lava base
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, '#FFB020');
            grad.addColorStop(0.3, '#FF6600');
            grad.addColorStop(0.6, '#CC3300');
            grad.addColorStop(1, 'rgba(100, 15, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Costra oscura parcial
            ctx.fillStyle = 'rgba(30, 10, 5, 0.4)';
            ctx.beginPath();
            ctx.ellipse(x + r * 0.2, y - r * 0.1, r * 0.35, r * 0.2, 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Resplandor
            const pulse = Math.sin(Date.now() * 0.004 + mr + mc) * 0.1 + 0.2;
            const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
            glow.addColorStop(0, `rgba(255, 100, 0, ${pulse})`);
            glow.addColorStop(1, 'rgba(255, 40, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ============================================
// DECORACIONES VOLCÁNICAS
// ============================================

function drawMazeDecorations(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const hash = (mr * 11 + mc * 17) % 30;
            const x = (mc + 0.5) * cellW;
            const y = (mr + 0.5) * cellH;

            if (hash === 3) {
                // Pequeña cicatriz de lava
                ctx.strokeStyle = 'rgba(200, 60, 0, 0.25)';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(x - cellW * 0.15, y - cellH * 0.1);
                ctx.lineTo(x + cellW * 0.05, y + cellH * 0.05);
                ctx.lineTo(x + cellW * 0.18, y - cellH * 0.05);
                ctx.stroke();
            } else if (hash === 8) {
                // Ceniza pequeña
                ctx.fillStyle = 'rgba(80, 60, 50, 0.3)';
                ctx.beginPath();
                ctx.ellipse(x, y, cellW * 0.06, cellH * 0.04, 0.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (hash === 14) {
                // Cristal de obsidiana
                drawObsidian(x, y, cellW * 0.07);
            } else if (hash === 20) {
                // Escoria volcánica
                ctx.fillStyle = 'rgba(40, 15, 8, 0.5)';
                ctx.beginPath();
                ctx.arc(x, y, cellW * 0.08, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(60, 20, 10, 0.3)';
                ctx.beginPath();
                ctx.arc(x + 2, y - 1, cellW * 0.05, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawObsidian(x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.5);

    const grad = ctx.createLinearGradient(-r, -r, r, r);
    grad.addColorStop(0, '#1A1020');
    grad.addColorStop(0.3, '#2A1530');
    grad.addColorStop(0.6, '#150A18');
    grad.addColorStop(1, '#0A0510');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -r * 1.2);
    ctx.lineTo(r * 0.6, -r * 0.3);
    ctx.lineTo(r * 0.5, r * 0.8);
    ctx.lineTo(-r * 0.3, r * 1.0);
    ctx.lineTo(-r * 0.7, r * 0.2);
    ctx.closePath();
    ctx.fill();

    // Brillo especular
    ctx.fillStyle = 'rgba(150, 100, 180, 0.15)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.1, -r * 0.3, r * 0.25, r * 0.1, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ============================================
// COMPATIBILIDAD
// ============================================

function drawModernTrees() {}

function drawModernTree(x, y, size) {
    drawBurntTree(x, y, size * CELL * 0.35);
}

function drawModernVegetation() {}

// ============================================
// FONDO DEL MENÚ (volcánico)
// ============================================

function drawForestMenuBackground() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#0A0200');
    skyGrad.addColorStop(0.3, '#1A0800');
    skyGrad.addColorStop(0.6, '#3A1200');
    skyGrad.addColorStop(1, '#1A0800');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Resplandor del cráter
    const craterGlow = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.15, 0, canvas.width * 0.5, canvas.height * 0.15, 200);
    craterGlow.addColorStop(0, 'rgba(255, 120, 0, 0.25)');
    craterGlow.addColorStop(0.3, 'rgba(255, 60, 0, 0.12)');
    craterGlow.addColorStop(1, 'rgba(255, 30, 0, 0)');
    ctx.fillStyle = craterGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

    // Columna de humo
    const time = Date.now() * 0.001;
    for (let i = 0; i < 10; i++) {
        const sx = canvas.width * 0.5 + Math.sin(time * 0.4 + i * 1.2) * (i * 6);
        const sy = canvas.height * 0.1 - i * 18;
        const sr = 15 + i * 10;
        ctx.fillStyle = `rgba(50, 35, 25, ${0.1 - i * 0.008})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
    }

    // Suelo volcánico
    ctx.fillStyle = '#1A0800';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    // Línea de lava en el suelo
    const lavaGrad = ctx.createLinearGradient(0, canvas.height * 0.72, 0, canvas.height * 0.76);
    lavaGrad.addColorStop(0, 'rgba(255, 80, 0, 0.3)');
    lavaGrad.addColorStop(0.5, 'rgba(255, 150, 0, 0.15)');
    lavaGrad.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.fillStyle = lavaGrad;
    ctx.fillRect(0, canvas.height * 0.72, canvas.width, canvas.height * 0.04);

    // Árboles quemados
    for (let i = 0; i < 5; i++) {
        const tx = 70 + i * 160;
        const ty = canvas.height * 0.68;
        drawBurntTree(tx, ty, 30 + (i % 3) * 8);
    }

    // Brasas
    drawEmbers(canvas.width, canvas.height);

    // Niebla de ceniza
    ctx.fillStyle = 'rgba(60, 30, 10, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDecorativeTree(x, y, size) {
    drawBurntTree(x, y, size * 0.35);
}

// ============================================
// HUD (volcánico)
// ============================================

function drawHUD() {
    ctx.fillStyle = 'rgba(15, 3, 0, 0.92)';
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 60, 0, 0.4)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 80, 0, 0.12)';
    ctx.fillRect(25, canvas.height - 47, canvas.width - 50, 2);

    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let livesText = '';
    for (let i = 0; i < lives; i++) livesText += '🐍';
    ctx.fillStyle = '#FF8A65';
    ctx.fillText(livesText, 30, canvas.height - 30);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFAB40';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🐭' + score, canvas.width - 30, canvas.height - 30);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(200, 80, 30, 0.4)';
    ctx.font = '13px Arial';
    ctx.fillText('P pausa · ESC menú', canvas.width / 2, canvas.height - 30);
}

function initMap() {
    obstacles = generateObstacles();
}

// ============================================
// PAUSA (volcánico)
// ============================================

function drawPausedBackground() {
    ctx.fillStyle = '#0A0200';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPaused() {
    drawPausedBackground();
    const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = `rgba(255, 138, 101, ${pulse})`;
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#FF8A65';
    ctx.fillText('Presiona P para continuar', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillStyle = '#FF5722';
    ctx.fillText('Presiona ESC para salir al menú', canvas.width / 2, canvas.height / 2 + 80);
}