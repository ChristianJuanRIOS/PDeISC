// ============================================
// MAPA DEL NIVEL 3 - DESIERTO - LABERINTO ESTILO JUEGO
// Más dificultad: pasillos estrechos, más dead-ends, más muros
// NOTA VELOCIDAD: En tu archivo principal de juego (game.js o similar),
// busca la variable que controla la velocidad del snake (probablemente
// gameSpeed, baseSpeed, tickInterval, o similar) y para el nivel 3
// reduzca el intervalo un ~20-25%. Ejemplo: si nivel 1 usa 150ms,
// nivel 3 debería usar ~110-115ms.
// ============================================

// Definición del laberinto: 1 = camino (arena), 0 = muro (roca desértica)
// Diseño más agresivo: muchos pasillos de 1 celda, dead-ends frecuentes
var MAZE_LAYOUT = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0],
    [0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,0],
    [0,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,0],
    [0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,0],
    [0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0],
    [0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1,0],
    [0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
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
// DIBUJAR CELDA DEL DESIERTO
// ============================================

function drawMazeCell(x, y, w, h, isPath) {
    if (isPath) {
        // Arena dorada del camino
        const pathGrad = ctx.createLinearGradient(x, y, x + w * 0.3, y + h);
        pathGrad.addColorStop(0, '#F2D680');
        pathGrad.addColorStop(0.3, '#E8C860');
        pathGrad.addColorStop(0.7, '#DDB850');
        pathGrad.addColorStop(1, '#D0A840');
        ctx.fillStyle = pathGrad;
        ctx.fillRect(x, y, w, h);

        // Textura de granos de arena
        ctx.fillStyle = 'rgba(190, 150, 50, 0.12)';
        const col = Math.floor(x / w);
        const row = Math.floor(y / h);
        if ((col + row) % 2 === 0) {
            ctx.fillRect(x, y, w, h);
        }
        // Puntos de arena sueltos
        ctx.fillStyle = 'rgba(170, 130, 40, 0.18)';
        const seed = col * 31 + row * 17;
        for (let i = 0; i < 3; i++) {
            const sx = x + ((seed * (i + 1) * 7) % 100) / 100 * w;
            const sy = y + ((seed * (i + 1) * 13) % 100) / 100 * h;
            ctx.beginPath();
            ctx.arc(sx, sy, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        // Roca desértica / arenisca compacta
        const col = Math.floor(x / w);
        const row = Math.floor(y / h);
        const noise = Math.sin(col * 0.41 + row * 0.33) * Math.cos(col * 0.17 + row * 0.23);
        let rockColor;
        if (noise > 0.35) rockColor = '#B86B3A';
        else if (noise > 0.05) rockColor = '#A55D30';
        else if (noise > -0.25) rockColor = '#8E4F28';
        else rockColor = '#7A4220';
        ctx.fillStyle = rockColor;
        ctx.fillRect(x, y, w, h);

        // Capas de sedimento sutiles
        ctx.fillStyle = 'rgba(60, 30, 10, 0.08)';
        if (row % 3 === 0) {
            ctx.fillRect(x, y + h * 0.4, w, h * 0.15);
        }
        if (row % 4 === 1) {
            ctx.fillRect(x, y + h * 0.7, w, h * 0.1);
        }
    }
}

// ============================================
// FONDO PRINCIPAL DEL DESIERTO
// ============================================

function drawMapBackground() {
    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / MAZE_COLS;
    const cellH = ch / MAZE_ROWS;

    // ===== FONDO BASE ARENISCA =====
    ctx.fillStyle = '#8E4F28';
    ctx.fillRect(0, 0, cw, ch);

    // ===== DIBUJAR LABERINTO CELDA A CELDA =====
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            const x = mc * cellW;
            const y = mr * cellH;
            drawMazeCell(x, y, cellW, cellH, MAZE_LAYOUT[mr][mc] === 1);
        }
    }

    // ===== BORDES DE CAMINOS (sombra entre arena y roca) =====
    ctx.strokeStyle = 'rgba(100, 55, 20, 0.45)';
    ctx.lineWidth = 1.5;
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const x = mc * cellW;
            const y = mr * cellH;
            if (mr === 0 || MAZE_LAYOUT[mr-1][mc] !== 1) {
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cellW, y); ctx.stroke();
            }
            if (mr === MAZE_ROWS-1 || MAZE_LAYOUT[mr+1][mc] !== 1) {
                ctx.beginPath(); ctx.moveTo(x, y + cellH); ctx.lineTo(x + cellW, y + cellH); ctx.stroke();
            }
            if (mc === 0 || MAZE_LAYOUT[mr][mc-1] !== 1) {
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cellH); ctx.stroke();
            }
            if (mc === MAZE_COLS-1 || MAZE_LAYOUT[mr][mc+1] !== 1) {
                ctx.beginPath(); ctx.moveTo(x + cellW, y); ctx.lineTo(x + cellW, y + cellH); ctx.stroke();
            }
        }
    }

    // ===== LÍNEAS DE GRILLA EN EL CAMINO =====
    drawPathGrid(cellW, cellH);

    // ===== CACTUS SOBRE LAS CELDAS DE ROCA =====
    drawMazeTrees(cellW, cellH);

    // ===== PIEDRAS DESÉRTICAS =====
    drawMazeRocks(cellW, cellH);

    // ===== DECORACIONES EXTRA (calaveras, huesos, flores) =====
    drawMazeDecorations(cellW, cellH);

    // ===== DUNAS DE FONDO (ondas sutiles) =====
    drawSandDunes(cw, ch);

    // ===== VIÑETA CÁLIDA EN LOS BORDES =====
    const vignette = ctx.createRadialGradient(cw/2, ch/2, cw * 0.25, cw/2, ch/2, cw * 0.78);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.7, 'rgba(0,0,0,0.05)');
    vignette.addColorStop(1, 'rgba(80, 30, 0, 0.3)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);

    // ===== RESPLANDOR SOLAR SUTIL (esquina superior derecha) =====
    const sunGlow = ctx.createRadialGradient(cw * 0.88, ch * 0.08, 0, cw * 0.88, ch * 0.08, cw * 0.4);
    sunGlow.addColorStop(0, 'rgba(255, 240, 180, 0.25)');
    sunGlow.addColorStop(0.3, 'rgba(255, 220, 120, 0.1)');
    sunGlow.addColorStop(1, 'rgba(255, 200, 80, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, cw, ch);
}

// ============================================
// GRILLA EN EL CAMINO
// ============================================

function drawPathGrid(cellW, cellH) {
    const gw = canvas.width / COLS;
    const gh = canvas.height / ROWS;

    ctx.save();
    ctx.strokeStyle = 'rgba(160, 120, 40, 0.12)';
    ctx.lineWidth = 0.8;

    for (let gx = 0; gx <= COLS; gx++) {
        const px = gx * gw;
        let inPath = false;
        let segStart = 0;
        for (let gy = 0; gy <= ROWS; gy++) {
            const onPath = gy < ROWS && isOnPath(gx < COLS ? gx : gx - 1, gy) &&
                           (gx > 0 && isOnPath(gx - 1, gy));
            if (onPath && !inPath) { segStart = gy * gh; inPath = true; }
            else if (!onPath && inPath) {
                ctx.beginPath();
                ctx.moveTo(px, segStart);
                ctx.lineTo(px, gy * gh);
                ctx.stroke();
                inPath = false;
            }
        }
    }

    for (let gy = 0; gy <= ROWS; gy++) {
        const py = gy * gh;
        let inPath = false;
        let segStart = 0;
        for (let gx = 0; gx <= COLS; gx++) {
            const onPath = gx < COLS && isOnPath(gx, gy < ROWS ? gy : gy - 1) &&
                           (gy > 0 && isOnPath(gx, gy - 1));
            if (onPath && !inPath) { segStart = gx * gw; inPath = true; }
            else if (!onPath && inPath) {
                ctx.beginPath();
                ctx.moveTo(segStart, py);
                ctx.lineTo(gx * gw, py);
                ctx.stroke();
                inPath = false;
            }
        }
    }

    ctx.restore();
}

// ============================================
// PIEDRAS DESÉRTICAS
// ============================================

function drawMazeRocks(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;

            const treeHash = (mr * 7 + mc * 13) % 10;
            if (treeHash < 4) continue;

            const hash = (mr * 17 + mc * 11) % 14;
            if (hash > 4) continue;

            const cx = (mc + 0.5 + (Math.sin(mr * 2.1 + mc) * 0.3)) * cellW;
            const cy = (mr + 0.6 + (Math.cos(mr + mc * 1.7) * 0.2)) * cellH;
            const sizeVar = 0.5 + ((mr * 5 + mc * 3) % 10) * 0.06;
            drawDesertRock(cx, cy, cellW * 0.3 * sizeVar);
        }
    }
}

function drawDesertRock(x, y, r) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.1, y + r * 0.4, r * 0.9, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Piedra base — tono rojizo desértico
    const grad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.25, r * 0.05, x, y, r * 1.05);
    grad.addColorStop(0,   '#C4845A');
    grad.addColorStop(0.4, '#A8694A');
    grad.addColorStop(0.8, '#8A5038');
    grad.addColorStop(1,   '#6E3E28');
    ctx.fillStyle = grad;

    // Forma angular de roca desértica
    ctx.beginPath();
    ctx.moveTo(x - r * 0.6, y + r * 0.2);
    ctx.lineTo(x - r * 0.75, y - r * 0.15);
    ctx.lineTo(x - r * 0.45, y - r * 0.75);
    ctx.lineTo(x + r * 0.05, y - r * 0.9);
    ctx.lineTo(x + r * 0.55, y - r * 0.7);
    ctx.lineTo(x + r * 0.85, y - r * 0.2);
    ctx.lineTo(x + r * 0.7, y + r * 0.35);
    ctx.lineTo(x + r * 0.15, y + r * 0.5);
    ctx.closePath();
    ctx.fill();

    // Contorno
    ctx.strokeStyle = 'rgba(60, 25, 10, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Líneas de estratificación (capas de sedimento)
    ctx.strokeStyle = 'rgba(60, 25, 10, 0.15)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.5, y - r * 0.1);
    ctx.lineTo(x + r * 0.6, y - r * 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r * 0.35, y + r * 0.15);
    ctx.lineTo(x + r * 0.5, y + r * 0.1);
    ctx.stroke();

    // Highlight
    ctx.fillStyle = 'rgba(255, 220, 180, 0.15)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.2, y - r * 0.45, r * 0.3, r * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// CACTUS DEL DESIERTO (reemplaza árboles)
// ============================================

function drawMazeTrees(cellW, cellH) {
    const cactusSpots = [];
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] === 0) {
                const hash = (mr * 7 + mc * 13) % 10;
                if (hash < 4) {
                    cactusSpots.push({ mr, mc });
                }
            }
        }
    }

    for (const { mr, mc } of cactusSpots) {
        const cx = (mc + 0.5) * cellW;
        const cy = (mr + 0.5) * cellH;
        const sizeFactor = 0.45 + ((mr * 3 + mc * 5) % 10) * 0.07;
        const type = (mr * 11 + mc * 7) % 3; // 0=saguaro, 1=cactus pequeño, 2=cactus redondo
        if (type === 0) drawSaguaroCactus(cx, cy, cellW * 0.4 * sizeFactor);
        else if (type === 1) drawSmallCactus(cx, cy, cellW * 0.35 * sizeFactor);
        else drawRoundCactus(cx, cy, cellW * 0.35 * sizeFactor);
    }
}

// ============================================
// CACTUS SAGUARO (el clásico grande con brazos)
// ============================================

function drawSaguaroCactus(x, y, r) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.15, y + r * 0.5, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyW = r * 0.28;

    // --- Brazo izquierdo ---
    ctx.fillStyle = '#2D8B30';
    ctx.beginPath();
    ctx.moveTo(x - bodyW, y - r * 0.1);
    ctx.lineTo(x - bodyW, y - r * 0.5);
    ctx.quadraticCurveTo(x - bodyW, y - r * 0.7, x - bodyW - r * 0.35, y - r * 0.7);
    ctx.quadraticCurveTo(x - bodyW - r * 0.55, y - r * 0.7, x - bodyW - r * 0.55, y - r * 0.9);
    ctx.quadraticCurveTo(x - bodyW - r * 0.55, y - r * 1.1, x - bodyW - r * 0.35, y - r * 1.1);
    ctx.lineTo(x - bodyW - r * 0.15, y - r * 1.1);
    ctx.quadraticCurveTo(x - bodyW, y - r * 1.1, x - bodyW, y - r * 0.9);
    ctx.lineTo(x - bodyW, y - r * 0.1);
    ctx.closePath();
    ctx.fill();

    // Highlight brazo izq
    ctx.fillStyle = 'rgba(100, 200, 100, 0.2)';
    ctx.fillRect(x - bodyW - r * 0.4, y - r * 1.05, bodyW * 0.5, r * 0.3);

    // --- Brazo derecho ---
    ctx.fillStyle = '#2D8B30';
    ctx.beginPath();
    ctx.moveTo(x + bodyW, y + r * 0.05);
    ctx.lineTo(x + bodyW, y - r * 0.35);
    ctx.quadraticCurveTo(x + bodyW, y - r * 0.55, x + bodyW + r * 0.3, y - r * 0.55);
    ctx.quadraticCurveTo(x + bodyW + r * 0.5, y - r * 0.55, x + bodyW + r * 0.5, y - r * 0.8);
    ctx.quadraticCurveTo(x + bodyW + r * 0.5, y - r * 1.0, x + bodyW + r * 0.3, y - r * 1.0);
    ctx.lineTo(x + bodyW + r * 0.1, y - r * 1.0);
    ctx.quadraticCurveTo(x + bodyW, y - r * 1.0, x + bodyW, y - r * 0.8);
    ctx.lineTo(x + bodyW, y + r * 0.05);
    ctx.closePath();
    ctx.fill();

    // Highlight brazo der
    ctx.fillStyle = 'rgba(100, 200, 100, 0.2)';
    ctx.fillRect(x + bodyW + r * 0.15, y - r * 0.95, bodyW * 0.5, r * 0.25);

    // --- Tronco principal ---
    const trunkGrad = ctx.createLinearGradient(x - bodyW, 0, x + bodyW, 0);
    trunkGrad.addColorStop(0, '#1F6B22');
    trunkGrad.addColorStop(0.3, '#2D8B30');
    trunkGrad.addColorStop(0.6, '#38A03C');
    trunkGrad.addColorStop(1, '#1F6B22');
    ctx.fillStyle = trunkGrad;

    ctx.beginPath();
    ctx.moveTo(x - bodyW, y + r * 0.5);
    ctx.lineTo(x - bodyW * 0.85, y - r * 0.85);
    ctx.quadraticCurveTo(x, y - r * 1.1, x + bodyW * 0.85, y - r * 0.85);
    ctx.lineTo(x + bodyW, y + r * 0.5);
    ctx.closePath();
    ctx.fill();

    // Líneas verticales del tronco (costillas del saguaro)
    ctx.strokeStyle = 'rgba(20, 80, 25, 0.25)';
    ctx.lineWidth = 0.7;
    for (let i = -2; i <= 2; i++) {
        const lx = x + i * bodyW * 0.35;
        ctx.beginPath();
        ctx.moveTo(lx, y + r * 0.45);
        ctx.quadraticCurveTo(lx, y - r * 0.2, lx + i * 0.3, y - r * 0.8);
        ctx.stroke();
    }

    // Espinas
    ctx.strokeStyle = 'rgba(200, 220, 150, 0.5)';
    ctx.lineWidth = 0.5;
    const spinePositions = [
        [x - bodyW, y - r * 0.2], [x + bodyW, y - r * 0.15],
        [x - bodyW, y - r * 0.5], [x + bodyW, y - r * 0.45],
        [x, y - r * 0.9],
    ];
    for (const [sx, sy] of spinePositions) {
        const angle = (sx < x) ? -0.5 : 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * r * 0.15, sy - r * 0.12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle + 1) * r * 0.12, sy + r * 0.08);
        ctx.stroke();
    }

    // Flower on top (small pink flower)
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(x, y - r * 1.0, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y - r * 1.0, r * 0.04, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// CACTUS PEQUEÑO (tipo órgano)
// ============================================

function drawSmallCactus(x, y, r) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.08, y + r * 0.4, r * 0.35, r * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createLinearGradient(x - r * 0.2, 0, x + r * 0.2, 0);
    grad.addColorStop(0, '#1F6B22');
    grad.addColorStop(0.5, '#2D8B30');
    grad.addColorStop(1, '#1F6B22');
    ctx.fillStyle = grad;

    // Tres tallos
    const stems = [
        { ox: -r * 0.2, h: r * 0.8, w: r * 0.15 },
        { ox: 0, h: r * 1.0, w: r * 0.18 },
        { ox: r * 0.22, h: r * 0.7, w: r * 0.14 },
    ];
    for (const s of stems) {
        ctx.beginPath();
        ctx.moveTo(x + s.ox - s.w, y + r * 0.35);
        ctx.lineTo(x + s.ox - s.w * 0.8, y - s.h + r * 0.35);
        ctx.quadraticCurveTo(x + s.ox, y - s.h - r * 0.1, x + s.ox + s.w * 0.8, y - s.h + r * 0.35);
        ctx.lineTo(x + s.ox + s.w, y + r * 0.35);
        ctx.closePath();
        ctx.fill();
    }

    // Espinas
    ctx.strokeStyle = 'rgba(200, 220, 150, 0.4)';
    ctx.lineWidth = 0.4;
    for (const s of stems) {
        for (let j = 0; j < 3; j++) {
            const sy = y + r * 0.35 - (j + 1) * s.h * 0.3;
            ctx.beginPath();
            ctx.moveTo(x + s.ox - s.w, sy);
            ctx.lineTo(x + s.ox - s.w - r * 0.1, sy - r * 0.05);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + s.ox + s.w, sy);
            ctx.lineTo(x + s.ox + s.w + r * 0.1, sy - r * 0.05);
            ctx.stroke();
        }
    }
}

// ============================================
// CACTUS REDONDO (tipo barril)
// ============================================

function drawRoundCactus(x, y, r) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.08, y + r * 0.4, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo redondo
    const grad = ctx.createRadialGradient(x - r * 0.15, y - r * 0.1, r * 0.05, x, y, r * 0.55);
    grad.addColorStop(0, '#3DA840');
    grad.addColorStop(0.5, '#2D8B30');
    grad.addColorStop(1, '#1A5E1D');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.05, r * 0.45, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Costillas horizontales
    ctx.strokeStyle = 'rgba(20, 70, 22, 0.3)';
    ctx.lineWidth = 0.8;
    for (let i = -2; i <= 2; i++) {
        const ry = y - r * 0.05 + i * r * 0.18;
        ctx.beginPath();
        ctx.moveTo(x - r * 0.38, ry);
        ctx.quadraticCurveTo(x, ry + i * r * 0.04, x + r * 0.38, ry);
        ctx.stroke();
    }

    // Espinas en grupos
    ctx.strokeStyle = 'rgba(220, 230, 160, 0.5)';
    ctx.lineWidth = 0.5;
    const spGroups = [
        { a: -0.6, d: 0.42 }, { a: -0.2, d: 0.47 }, { a: 0.2, d: 0.46 },
        { a: 0.6, d: 0.4 }, { a: -0.4, d: 0.15 }, { a: 0.4, d: 0.15 },
        { a: 0, d: 0.48 },
    ];
    for (const sg of spGroups) {
        const sx = x + Math.cos(sg.a) * r * sg.d;
        const sy = y - r * 0.05 + Math.sin(sg.a) * r * sg.d;
        const nx = Math.cos(sg.a);
        const ny = Math.sin(sg.a);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + nx * r * 0.15, sy + ny * r * 0.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + nx * r * 0.12 - ny * r * 0.08, sy + ny * r * 0.12 + nx * r * 0.08);
        ctx.stroke();
    }

    // Flor arriba
    ctx.fillStyle = '#FF6B8A';
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.08, y - r * 0.52 + Math.sin(a) * r * 0.04, r * 0.07, r * 0.04, a, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y - r * 0.52, r * 0.04, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// DUNAS DE ARENA (efecto de fondo sutil)
// ============================================

function drawSandDunes(cw, ch) {
    ctx.save();
    ctx.globalAlpha = 0.06;

    // Duna 1
    ctx.fillStyle = '#FFE0A0';
    ctx.beginPath();
    ctx.moveTo(0, ch * 0.3);
    ctx.quadraticCurveTo(cw * 0.25, ch * 0.15, cw * 0.5, ch * 0.28);
    ctx.quadraticCurveTo(cw * 0.75, ch * 0.4, cw, ch * 0.25);
    ctx.lineTo(cw, ch * 0.35);
    ctx.quadraticCurveTo(cw * 0.75, ch * 0.5, cw * 0.5, ch * 0.38);
    ctx.quadraticCurveTo(cw * 0.25, ch * 0.25, 0, ch * 0.4);
    ctx.closePath();
    ctx.fill();

    // Duna 2
    ctx.fillStyle = '#FFD890';
    ctx.beginPath();
    ctx.moveTo(0, ch * 0.65);
    ctx.quadraticCurveTo(cw * 0.3, ch * 0.55, cw * 0.6, ch * 0.68);
    ctx.quadraticCurveTo(cw * 0.85, ch * 0.78, cw, ch * 0.6);
    ctx.lineTo(cw, ch * 0.72);
    ctx.quadraticCurveTo(cw * 0.85, ch * 0.88, cw * 0.6, ch * 0.78);
    ctx.quadraticCurveTo(cw * 0.3, ch * 0.65, 0, ch * 0.75);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// ============================================
// DECORACIONES DEL DESIERTO
// ============================================

function drawMazeDecorations(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const hash = (mr * 11 + mc * 17) % 25;
            const x = (mc + 0.5) * cellW;
            const y = (mr + 0.5) * cellH;

            if (hash === 2) {
                // Pequeña flor desértica
                drawDesertFlower(x, y, cellW * 0.06);
            } else if (hash === 6) {
                // Piedrecilla en el camino
                ctx.fillStyle = 'rgba(160, 120, 70, 0.35)';
                ctx.beginPath();
                ctx.ellipse(x, y, cellW * 0.07, cellH * 0.04, 0.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (hash === 10) {
                // Huella en la arena
                ctx.fillStyle = 'rgba(180, 140, 80, 0.2)';
                ctx.beginPath();
                ctx.ellipse(x - 2, y, 3, 4.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(x + 4, y + 5, 2.5, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (hash === 14) {
                // Pequeña hueso
                ctx.fillStyle = 'rgba(230, 220, 200, 0.35)';
                ctx.beginPath();
                ctx.ellipse(x, y, 5, 2, 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x - 5, y - 1.5, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + 5, y + 1.5, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Calaveras en esquinas de roca junto a caminos
    for (let mr = 1; mr < MAZE_ROWS - 1; mr++) {
        for (let mc = 1; mc < MAZE_COLS - 1; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;
            const adj = MAZE_LAYOUT[mr-1][mc] + MAZE_LAYOUT[mr+1][mc] +
                        MAZE_LAYOUT[mr][mc-1] + MAZE_LAYOUT[mr][mc+1];
            if (adj === 0) continue;
            const hash = (mr * 9 + mc * 19) % 30;
            if (hash !== 5) continue;

            const sx = (mc + 0.5) * cellW;
            const sy = (mr + 0.65) * cellH;
            drawDesertSkull(sx, sy, cellW * 0.12);
        }
    }

    // Arbusto desértico en algunas esquinas
    for (let mr = 1; mr < MAZE_ROWS - 1; mr++) {
        for (let mc = 1; mc < MAZE_COLS - 1; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;
            const adj = MAZE_LAYOUT[mr-1][mc] + MAZE_LAYOUT[mr+1][mc] +
                        MAZE_LAYOUT[mr][mc-1] + MAZE_LAYOUT[mr][mc+1];
            if (adj === 0) continue;
            const hash = (mr * 13 + mc * 7) % 25;
            if (hash !== 8) continue;

            const bx = (mc + 0.5) * cellW;
            const by = (mr + 0.7) * cellH;
            const bs = cellW * 0.15;
            drawDesertBush(bx, by, bs);
        }
    }
}

function drawDesertFlower(x, y, r) {
    // Tallo
    ctx.strokeStyle = 'rgba(100, 140, 50, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + r * 2);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Pétalos
    const colors = ['#FF6B8A', '#FFB347', '#FF69B4', '#FFA07A'];
    const col = colors[Math.floor(Math.abs(x * 7 + y * 3)) % colors.length];
    ctx.fillStyle = col;
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.5, r * 0.3, a, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawDesertSkull(x, y, r) {
    ctx.fillStyle = 'rgba(230, 220, 200, 0.45)';
    // Cráneo
    ctx.beginPath();
    ctx.arc(x, y - r * 0.3, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    // Mandíbula
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x - r * 0.4, y + r * 0.1, r * 0.8, r * 0.35, r * 0.15)
                  : ctx.fillRect(x - r * 0.4, y + r * 0.1, r * 0.8, r * 0.35);
    ctx.fill();
    // Ojos (vacíos)
    ctx.fillStyle = 'rgba(80, 50, 30, 0.5)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.2, y - r * 0.35, r * 0.15, r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + r * 0.2, y - r * 0.35, r * 0.15, r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nariz
    ctx.beginPath();
    ctx.moveTo(x, y - r * 0.12);
    ctx.lineTo(x - r * 0.08, y + r * 0.05);
    ctx.lineTo(x + r * 0.08, y + r * 0.05);
    ctx.closePath();
    ctx.fill();
}

function drawDesertBush(x, y, r) {
    // Arbusto seco desértico
    ctx.fillStyle = 'rgba(120, 90, 40, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(150, 115, 55, 0.5)';
    ctx.beginPath();
    ctx.arc(x - r * 0.4, y - r * 0.2, r * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + r * 0.35, y - r * 0.15, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(170, 135, 70, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y - r * 0.35, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// FUNCIONES DE COMPATIBILIDAD (menú, etc.)
// ============================================

function drawModernTrees() {
    // Los cactus se dibujan en drawMazeTrees desde drawMapBackground
}

function drawModernTree(x, y, size) {
    const r = size * CELL * 0.7;
    drawSaguaroCactus(x, y, r * 0.5);
}

function drawModernVegetation() {
    // La vegetación desértica está en drawMazeDecorations
}

// ============================================
// FONDO DEL MENÚ (tema desierto)
// ============================================

function drawForestMenuBackground() {
    const DESERT = {
        skyTop: '#1A0A2E',
        skyMid: '#4A1942',
        skyBottom: '#C84B31',
        sand1: '#D4A54A',
        sand2: '#C89838',
        sand3: '#BC8C30',
        shadow: 'rgba(0,0,0,0.1)',
        rockDark: '#6E3E28',
        rockMid: '#8A5038',
        rockLight: '#A8694A',
        fog: 'rgba(180, 120, 40, 0.08)',
        cactusDark: '#1F6B22',
        cactusMid: '#2D8B30',
        cactusLight: '#38A03C',
        starColor: 'rgba(255, 255, 200, 0.6)',
    };

    // Cielo nocturno desértico
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.45);
    skyGrad.addColorStop(0, DESERT.skyTop);
    skyGrad.addColorStop(0.5, DESERT.skyMid);
    skyGrad.addColorStop(1, DESERT.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.45);

    // Estrellas
    ctx.fillStyle = DESERT.starColor;
    for (let i = 0; i < 40; i++) {
        const sx = (i * 97 + 13) % canvas.width;
        const sy = (i * 53 + 7) % (canvas.height * 0.35);
        const ss = 0.5 + (i % 3) * 0.5;
        const twinkle = Math.sin(menuAnimationFrame * 0.03 + i * 2) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle * 0.7;
        ctx.beginPath();
        ctx.arc(sx, sy, ss, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Luna
    ctx.fillStyle = 'rgba(255, 240, 200, 0.9)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, canvas.height * 0.12, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = DESERT.skyTop;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8 + 8, canvas.height * 0.12 - 3, 22, 0, Math.PI * 2);
    ctx.fill();

    // Arena del suelo
    for (let row = 5; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * CELL;
            const y = row * CELL;
            const noise = Math.sin(col * 0.25) * Math.cos(row * 0.18 + menuAnimationFrame * 0.005);
            let sandColor;
            if (noise > 0.3) sandColor = DESERT.sand1;
            else if (noise > 0) sandColor = DESERT.sand2;
            else sandColor = DESERT.sand3;
            ctx.fillStyle = sandColor;
            ctx.fillRect(x, y, CELL, CELL);
        }
    }

    // Dunas en el horizonte
    ctx.fillStyle = 'rgba(180, 130, 50, 0.4)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.42);
    ctx.quadraticCurveTo(canvas.width * 0.2, canvas.height * 0.35, canvas.width * 0.4, canvas.height * 0.43);
    ctx.quadraticCurveTo(canvas.width * 0.6, canvas.height * 0.5, canvas.width * 0.8, canvas.height * 0.4);
    ctx.quadraticCurveTo(canvas.width * 0.95, canvas.height * 0.35, canvas.width, canvas.height * 0.42);
    ctx.lineTo(canvas.width, canvas.height * 0.5);
    ctx.lineTo(0, canvas.height * 0.5);
    ctx.closePath();
    ctx.fill();

    // Cactus decorativos
    for (let i = 0; i < 5; i++) {
        const cx = 80 + i * 180 + Math.sin(menuAnimationFrame * 0.003 + i) * 3;
        const cy = canvas.height - 60;
        const s = 25 + (i % 3) * 8;
        if (i % 3 === 0) drawSaguaroCactus(cx, cy, s);
        else if (i % 3 === 1) drawSmallCactus(cx, cy, s);
        else drawRoundCactus(cx, cy, s);
    }

    // Partículas de arena flotando
    for (let i = 0; i < 20; i++) {
        const px = (i * 97 + menuAnimationFrame * 1.5) % canvas.width;
        const py = (i * 157 + menuAnimationFrame * 0.8) % (canvas.height * 0.7) + canvas.height * 0.1;
        ctx.fillStyle = 'rgba(220, 180, 100, 0.3)';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.ellipse(px, py, 2, 1, Math.sin(menuAnimationFrame * 0.008 + i) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Niebla cálida
    ctx.fillStyle = DESERT.fog;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDecorativeTree(x, y, size) {
    drawSaguaroCactus(x, y, size * 0.5);
}

// ============================================
// HUD MEJORADO (tema desierto)
// ============================================

function drawHUD() {
    // Panel inferior estilo cuero desértico
    ctx.fillStyle = 'rgba(60, 30, 10, 0.9)';
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.fill();

    // Borde dorado
    ctx.strokeStyle = 'rgba(200, 160, 60, 0.4)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.stroke();

    // Línea decorativa
    ctx.fillStyle = 'rgba(200, 160, 60, 0.12)';
    ctx.fillRect(25, canvas.height - 47, canvas.width - 50, 2);

    // Vidas
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let livesText = '';
    for (let i = 0; i < lives; i++) livesText += '🐍';
    ctx.fillStyle = '#90EE90';
    ctx.fillText(livesText, 30, canvas.height - 30);

    // Puntuación
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🐭' + score, canvas.width - 30, canvas.height - 30);

    // Indicador de pausa
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(200, 160, 60, 0.45)';
    ctx.font = '13px Arial';
    ctx.fillText('P pausa · ESC menú', canvas.width / 2, canvas.height - 30);
}

function initMap() {
    obstacles = generateObstacles();
}

// ============================================
// FONDO DE PAUSA (tema desierto)
// ============================================

function drawPausedBackground() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#1A0A2E');
    skyGrad.addColorStop(0.5, '#2A1030');
    skyGrad.addColorStop(1, '#0A0508');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPaused() {
    drawPausedBackground();
    const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = `rgba(255, 200, 60, ${pulse})`;
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#DDB850';
    ctx.fillText('Presiona P para continuar', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillStyle = '#A8863A';
    ctx.fillText('Presiona ESC para salir al menú', canvas.width / 2, canvas.height / 2 + 80);
}