// ============================================
// MAPA DEL NIVEL 4 - NIEVE - LABERINTO ESTILO JUEGO
// Caminos blancos como nieve, muros de roca/hielo
// ============================================

var MAZE_LAYOUT = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,1,0],
    [0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0],
    [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0],
    [0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0],
    [0,1,1,1,0,1,1,1,1,0,0,1,1,1,1,0,1,1,1,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    [0,1,1,1,1,1,0,1,1,0,0,1,1,0,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0],
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
// DIBUJAR CELDA DE NIEVE
// ============================================

function drawMazeCell(x, y, w, h, isPath) {
    if (isPath) {
        const col = Math.floor(x / w);
        const row = Math.floor(y / h);
        const noise = Math.sin(col * 0.43 + row * 0.31) * Math.cos(col * 0.19 + row * 0.23);

        const snowGrad = ctx.createLinearGradient(x, y, x + w * 0.2, y + h);
        if (noise > 0.3) {
            snowGrad.addColorStop(0, '#FFFFFF');
            snowGrad.addColorStop(0.5, '#F5F8FC');
            snowGrad.addColorStop(1, '#E8F0F8');
        } else if (noise > -0.1) {
            snowGrad.addColorStop(0, '#F0F5FB');
            snowGrad.addColorStop(0.5, '#E8EFF8');
            snowGrad.addColorStop(1, '#DCE6F2');
        } else {
            snowGrad.addColorStop(0, '#E8EFF8');
            snowGrad.addColorStop(0.5, '#DEE8F4');
            snowGrad.addColorStop(1, '#D0DCF0');
        }
        ctx.fillStyle = snowGrad;
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        if ((col + row) % 3 === 0) {
            ctx.fillRect(x, y, w, h);
        }

        ctx.fillStyle = 'rgba(200, 220, 255, 0.15)';
        const seed = col * 29 + row * 13;
        for (let i = 0; i < 2; i++) {
            const sx = x + ((seed * (i + 1) * 11) % 100) / 100 * w;
            const sy = y + ((seed * (i + 1) * 7) % 100) / 100 * h;
            ctx.beginPath();
            ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        const col = Math.floor(x / w);
        const row = Math.floor(y / h);
        const noise = Math.sin(col * 0.37 + row * 0.29) * Math.cos(col * 0.15 + row * 0.21);
        let rockColor;
        if (noise > 0.35) rockColor = '#5A6A7A';
        else if (noise > 0.05) rockColor = '#4A5A6A';
        else if (noise > -0.2) rockColor = '#3A4A5A';
        else rockColor = '#2E3E4E';
        ctx.fillStyle = rockColor;
        ctx.fillRect(x, y, w, h);

        const snowCapGrad = ctx.createLinearGradient(x, y, x, y + h * 0.4);
        snowCapGrad.addColorStop(0, 'rgba(220, 235, 250, 0.55)');
        snowCapGrad.addColorStop(0.5, 'rgba(200, 220, 240, 0.3)');
        snowCapGrad.addColorStop(1, 'rgba(200, 220, 240, 0)');
        ctx.fillStyle = snowCapGrad;
        ctx.fillRect(x, y, w, h * 0.4);

        if (noise > 0.2) {
            ctx.fillStyle = 'rgba(180, 220, 255, 0.12)';
            ctx.fillRect(x, y, w, h);
        }
    }
}

// ============================================
// FONDO PRINCIPAL DE NIEVE
// ============================================

function drawMapBackground() {
    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / MAZE_COLS;
    const cellH = ch / MAZE_ROWS;

    ctx.fillStyle = '#3A4A5A';
    ctx.fillRect(0, 0, cw, ch);

    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            const x = mc * cellW;
            const y = mr * cellH;
            drawMazeCell(x, y, cellW, cellH, MAZE_LAYOUT[mr][mc] === 1);
        }
    }

    ctx.strokeStyle = 'rgba(60, 80, 110, 0.35)';
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

    drawPathGrid(cellW, cellH);
    drawMazeTrees(cellW, cellH);
    drawMazeRocks(cellW, cellH);
    drawMazeDecorations(cellW, cellH);
    drawFallingSnow(cw, ch);

    const vignette = ctx.createRadialGradient(cw/2, ch/2, cw * 0.25, cw/2, ch/2, cw * 0.78);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.6, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(20, 40, 80, 0.35)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);

    const auroraGlow = ctx.createLinearGradient(0, 0, cw * 0.5, 0);
    auroraGlow.addColorStop(0, 'rgba(0, 200, 150, 0.06)');
    auroraGlow.addColorStop(0.5, 'rgba(0, 150, 220, 0.04)');
    auroraGlow.addColorStop(1, 'rgba(0, 150, 220, 0)');
    ctx.fillStyle = auroraGlow;
    ctx.fillRect(0, 0, cw, ch * 0.3);
}

// ============================================
// GRILLA EN EL CAMINO (surcos en la nieve)
// ============================================

function drawPathGrid(cellW, cellH) {
    const gw = canvas.width / COLS;
    const gh = canvas.height / ROWS;

    ctx.save();
    ctx.strokeStyle = 'rgba(160, 190, 220, 0.15)';
    ctx.lineWidth = 0.7;

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
// ROCAS DE HIELO
// ============================================

function drawMazeRocks(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;
            const treeHash = (mr * 7 + mc * 13) % 10;
            if (treeHash < 4) continue;
            const hash = (mr * 17 + mc * 11) % 14;
            if (hash > 4) continue;
            const cx = (mc + 0.5 + (Math.sin(mr * 2.1 + mc) * 0.28)) * cellW;
            const cy = (mr + 0.6 + (Math.cos(mr + mc * 1.7) * 0.18)) * cellH;
            const sizeVar = 0.5 + ((mr * 5 + mc * 3) % 10) * 0.055;
            drawIceRock(cx, cy, cellW * 0.28 * sizeVar);
        }
    }
}

function drawIceRock(x, y, r) {
    ctx.fillStyle = 'rgba(30, 50, 80, 0.12)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.1, y + r * 0.4, r * 0.85, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.05, x, y, r * 1.05);
    grad.addColorStop(0,   '#A0B8CC');
    grad.addColorStop(0.4, '#7A98B0');
    grad.addColorStop(0.8, '#5A7890');
    grad.addColorStop(1,   '#4A6878');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(x - r * 0.55, y + r * 0.15);
    ctx.bezierCurveTo(x - r * 0.7,  y - r * 0.3,  x - r * 0.3,  y - r * 0.85,  x + r * 0.1,  y - r * 0.8);
    ctx.bezierCurveTo(x + r * 0.55, y - r * 0.75, x + r * 0.9,  y - r * 0.3,  x + r * 0.8,  y + r * 0.2);
    ctx.bezierCurveTo(x + r * 0.65,  y + r * 0.5,  x - r * 0.2,  y + r * 0.5,  x - r * 0.55, y + r * 0.15);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(40, 60, 90, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Nieve acumulada encima de la roca
    ctx.fillStyle = 'rgba(230, 240, 255, 0.7)';
    ctx.beginPath();
    ctx.moveTo(x - r * 0.5, y - r * 0.5);
    ctx.quadraticCurveTo(x - r * 0.3, y - r * 0.9, x + r * 0.1, y - r * 0.8);
    ctx.quadraticCurveTo(x + r * 0.4, y - r * 0.85, x + r * 0.55, y - r * 0.6);
    ctx.quadraticCurveTo(x + r * 0.3, y - r * 0.55, x, y - r * 0.55);
    ctx.quadraticCurveTo(x - r * 0.3, y - r * 0.5, x - r * 0.5, y - r * 0.5);
    ctx.closePath();
    ctx.fill();

    // Brillo de hielo
    ctx.fillStyle = 'rgba(200, 230, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.15, y - r * 0.65, r * 0.2, r * 0.08, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Grieta de hielo
    ctx.strokeStyle = 'rgba(40, 70, 110, 0.2)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.1, y - r * 0.4);
    ctx.lineTo(x + r * 0.15, y + r * 0.05);
    ctx.lineTo(x + r * 0.05, y + r * 0.25);
    ctx.stroke();
}

// ============================================
// PINOS CON NIEVE (reemplazan árboles)
// ============================================

function drawMazeTrees(cellW, cellH) {
    const treeSpots = [];
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] === 0) {
                const hash = (mr * 7 + mc * 13) % 10;
                if (hash < 4) {
                    treeSpots.push({ mr, mc });
                }
            }
        }
    }

    for (const { mr, mc } of treeSpots) {
        const cx = (mc + 0.5) * cellW;
        const cy = (mr + 0.5) * cellH;
        const sizeFactor = 0.5 + ((mr * 3 + mc * 5) % 10) * 0.07;
        const type = (mr * 11 + mc * 7) % 3;
        if (type === 0) drawSnowPine(cx, cy, cellW * 0.45 * sizeFactor);
        else if (type === 1) drawSnowPineShort(cx, cy, cellW * 0.4 * sizeFactor);
        else drawSnowBush(cx, cy, cellW * 0.35 * sizeFactor);
    }
}

// ============================================
// PINO GRANDE CON NIEVE
// ============================================

function drawSnowPine(x, y, r) {
    // Sombra en la nieve
    ctx.fillStyle = 'rgba(30, 50, 80, 0.1)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.08, y + r * 0.5, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tronco
    ctx.fillStyle = '#4A3020';
    ctx.beginPath();
    ctx.rect(x - r * 0.08, y - r * 0.05, r * 0.16, r * 0.55);
    ctx.fill();

    // Nieve al pie del tronco
    ctx.fillStyle = 'rgba(230, 240, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.48, r * 0.2, r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Capas de ramas (de abajo a arriba)
    const layers = [
        { yOff: 0.15, width: 1.0,  color: '#1A4A2E', snowY: 0.08, snowW: 0.75 },
        { yOff: -0.1, width: 0.82, color: '#1E5A35', snowY: -0.15, snowW: 0.65 },
        { yOff: -0.35, width: 0.65, color: '#226A3E', snowY: -0.38, snowW: 0.55 },
        { yOff: -0.55, width: 0.48, color: '#267A47', snowY: -0.58, snowW: 0.4 },
        { yOff: -0.72, width: 0.32, color: '#2A8A50', snowY: -0.75, snowW: 0.25 },
    ];

    for (const layer of layers) {
        const ly = y + layer.yOff * r;
        const lw = r * layer.width;

        // Rama verde
        ctx.fillStyle = layer.color;
        ctx.beginPath();
        ctx.moveTo(x - lw, ly);
        ctx.lineTo(x, ly - r * 0.28);
        ctx.lineTo(x + lw, ly);
        ctx.closePath();
        ctx.fill();

        // Nieve sobre la rama
        ctx.fillStyle = 'rgba(230, 240, 255, 0.75)';
        ctx.beginPath();
        const snowLy = y + layer.snowY * r;
        const snowLw = r * layer.snowW;
        ctx.moveTo(x - snowLw, snowLy + r * 0.04);
        ctx.quadraticCurveTo(x - snowLw * 0.5, snowLy - r * 0.04, x, snowLy - r * 0.03);
        ctx.quadraticCurveTo(x + snowLw * 0.5, snowLy - r * 0.04, x + snowLw, snowLy + r * 0.04);
        ctx.quadraticCurveTo(x + snowLw * 0.5, snowLy + r * 0.08, x, snowLy + r * 0.06);
        ctx.quadraticCurveTo(x - snowLw * 0.5, snowLy + r * 0.08, x - snowLw, snowLy + r * 0.04);
        ctx.closePath();
        ctx.fill();

        // Brillo en la nieve
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x - snowLw * 0.3, snowLy, snowLw * 0.25, r * 0.02, -0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Punta del árbol con nieve
    ctx.fillStyle = '#2E9A55';
    ctx.beginPath();
    ctx.moveTo(x - r * 0.18, y - r * 0.82);
    ctx.lineTo(x, y - r * 1.05);
    ctx.lineTo(x + r * 0.18, y - r * 0.82);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(230, 240, 255, 0.8)';
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.95, r * 0.12, r * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// PINO CORTO CON NIEVE
// ============================================

function drawSnowPineShort(x, y, r) {
    ctx.fillStyle = 'rgba(30, 50, 80, 0.08)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.05, y + r * 0.35, r * 0.35, r * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4A3020';
    ctx.fillRect(x - r * 0.06, y, r * 0.12, r * 0.35);

    const layers = [
        { yOff: 0.05, w: 0.8, color: '#1A4A2E' },
        { yOff: -0.15, w: 0.6, color: '#1E5A35' },
        { yOff: -0.32, w: 0.4, color: '#226A3E' },
    ];

    for (const l of layers) {
        const ly = y + l.yOff * r;
        const lw = r * l.w;
        ctx.fillStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(x - lw, ly);
        ctx.lineTo(x, ly - r * 0.25);
        ctx.lineTo(x + lw, ly);
        ctx.closePath();
        ctx.fill();

        // Nieve
        ctx.fillStyle = 'rgba(230, 240, 255, 0.7)';
        ctx.beginPath();
        ctx.moveTo(x - lw * 0.7, ly - r * 0.02);
        ctx.quadraticCurveTo(x, ly - r * 0.06, x + lw * 0.7, ly - r * 0.02);
        ctx.quadraticCurveTo(x, ly + r * 0.03, x - lw * 0.7, ly - r * 0.02);
        ctx.closePath();
        ctx.fill();
    }
}

// ============================================
// ARBUSTO CON NIEVE
// ============================================

function drawSnowBush(x, y, r) {
    ctx.fillStyle = 'rgba(30, 50, 80, 0.08)';
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.3, r * 0.6, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ramas
    ctx.fillStyle = '#3A5040';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4A6050';
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.15, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + r * 0.2, y - r * 0.1, r * 0.38, 0, Math.PI * 2);
    ctx.fill();

    // Nieve encima
    ctx.fillStyle = 'rgba(230, 240, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.1, y - r * 0.35, r * 0.5, r * 0.15, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + r * 0.15, y - r * 0.3, r * 0.35, r * 0.12, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Brillo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.2, y - r * 0.4, r * 0.15, r * 0.05, -0.2, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// COPOS DE NIEVE CAYENDO
// ============================================

function drawFallingSnow(cw, ch) {
    const time = Date.now() * 0.001;
    // Usar seed determinista para posiciones base
    const rng = (function() {
        let s = 42;
        return function() {
            s = (s * 16807) % 2147483647;
            return (s - 1) / 2147483646;
        };
    })();

    for (let i = 0; i < 80; i++) {
        const baseX = rng() * cw;
        const baseSpeed = 15 + rng() * 30;
        const baseSize = 1 + rng() * 2.5;
        const drift = rng() * 20 + 5;

        const fx = (baseX + Math.sin(time * 0.5 + i * 0.7) * drift) % cw;
        const fy = ((time * baseSpeed + i * 97) % (ch + 20)) - 10;
        const alpha = 0.3 + rng() * 0.4;

        ctx.fillStyle = `rgba(240, 248, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(fx, fy, baseSize, 0, Math.PI * 2);
        ctx.fill();

        // Copos grandes: dibujar cristal
        if (baseSize > 2.5) {
            ctx.strokeStyle = `rgba(220, 235, 255, ${alpha * 0.5})`;
            ctx.lineWidth = 0.5;
            for (let a = 0; a < 6; a++) {
                const angle = (a / 6) * Math.PI * 2 + time * 0.2;
                ctx.beginPath();
                ctx.moveTo(fx, fy);
                ctx.lineTo(fx + Math.cos(angle) * baseSize * 1.2, fy + Math.sin(angle) * baseSize * 1.2);
                ctx.stroke();
            }
        }
    }
}

// ============================================
// DECORACIONES DE NIEVE
// ============================================

function drawMazeDecorations(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const hash = (mr * 11 + mc * 17) % 28;
            const x = (mc + 0.5) * cellW;
            const y = (mr + 0.5) * cellH;

            if (hash === 2) {
                // Huellas en la nieve
                drawSnowFootprints(x, y, cellW * 0.15);
            } else if (hash === 7) {
                // Cristal de hielo en el camino
                drawIceCrystal(x, y, cellW * 0.08);
            } else if (hash === 12) {
                // Montículo de nieve
                ctx.fillStyle = 'rgba(230, 240, 255, 0.5)';
                ctx.beginPath();
                ctx.ellipse(x, y + 2, cellW * 0.12, cellH * 0.06, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.ellipse(x - 1, y, cellW * 0.06, cellH * 0.03, -0.2, 0, Math.PI * 2);
                ctx.fill();
            } else if (hash === 18) {
                // Rama caída con nieve
                ctx.strokeStyle = 'rgba(80, 60, 40, 0.35)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x - cellW * 0.15, y + 3);
                ctx.quadraticCurveTo(x, y - 2, x + cellW * 0.18, y - 1);
                ctx.stroke();
                ctx.fillStyle = 'rgba(230, 240, 255, 0.5)';
                ctx.beginPath();
                ctx.ellipse(x, y - 3, cellW * 0.08, cellH * 0.025, -0.15, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Estalactitas de hielo en bordes de roca junto a camino
    for (let mr = 1; mr < MAZE_ROWS - 1; mr++) {
        for (let mc = 1; mc < MAZE_COLS - 1; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;
            const adj = MAZE_LAYOUT[mr-1][mc] + MAZE_LAYOUT[mr+1][mc] +
                        MAZE_LAYOUT[mr][mc-1] + MAZE_LAYOUT[mr][mc+1];
            if (adj === 0) continue;
            const hash = (mr * 9 + mc * 19) % 20;
            if (hash !== 3) continue;

            const ix = (mc + 0.5) * cellW;
            const iy = (mr + 0.5) * cellH;
            drawIcicle(ix, iy, cellW * 0.06);
        }
    }
}

function drawSnowFootprints(x, y, r) {
    ctx.fillStyle = 'rgba(180, 200, 225, 0.3)';
    // Huella 1
    ctx.beginPath();
    ctx.ellipse(x - r * 0.5, y - r * 0.3, r * 0.35, r * 0.5, -0.15, 0, Math.PI * 2);
    ctx.fill();
    // Huella 2
    ctx.beginPath();
    ctx.ellipse(x + r * 0.4, y + r * 0.4, r * 0.3, r * 0.45, 0.1, 0, Math.PI * 2);
    ctx.fill();
}

function drawIceCrystal(x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.3);

    // Cristal hexagonal
    ctx.fillStyle = 'rgba(180, 220, 255, 0.4)';
    ctx.strokeStyle = 'rgba(150, 200, 255, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Líneas internas
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8);
        ctx.stroke();
    }

    // Brillo central
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawIcicle(x, y, r) {
    // Carámbano colgando
    const grad = ctx.createLinearGradient(x, y - r * 3, x, y + r);
    grad.addColorStop(0, 'rgba(180, 220, 255, 0.6)');
    grad.addColorStop(0.5, 'rgba(200, 235, 255, 0.45)');
    grad.addColorStop(1, 'rgba(220, 240, 255, 0.2)');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(x - r * 0.6, y - r * 2.5);
    ctx.quadraticCurveTo(x - r * 0.4, y - r * 0.5, x, y + r);
    ctx.quadraticCurveTo(x + r * 0.4, y - r * 0.5, x + r * 0.6, y - r * 2.5);
    ctx.closePath();
    ctx.fill();

    // Brillo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.15, y - r * 1.2, r * 0.12, r * 0.5, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Gota en la punta
    ctx.fillStyle = 'rgba(200, 235, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y + r * 0.8, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// FUNCIONES DE COMPATIBILIDAD
// ============================================

function drawModernTrees() {}

function drawModernTree(x, y, size) {
    drawSnowPine(x, y, size * CELL * 0.4);
}

function drawModernVegetation() {}

// ============================================
// FONDO DEL MENÚ (tema nieve)
// ============================================

function drawForestMenuBackground() {
    // Cielo nocturno helado
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.45);
    skyGrad.addColorStop(0, '#0A1525');
    skyGrad.addColorStop(0.4, '#152540');
    skyGrad.addColorStop(1, '#2A4565');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.45);

    // Aurora boreal
    const time = Date.now() * 0.0008;
    for (let i = 0; i < 4; i++) {
        const ax = canvas.width * (0.2 + i * 0.2) + Math.sin(time + i * 1.5) * 40;
        const aurora = ctx.createLinearGradient(ax - 50, 0, ax + 50, canvas.height * 0.4);
        const colors = [
            'rgba(0, 230, 120, 0)',
            'rgba(0, 230, 120, 0.08)',
            'rgba(0, 180, 220, 0.06)',
            'rgba(0, 230, 120, 0)',
        ];
        colors.forEach((c, idx) => aurora.addColorStop(idx / (colors.length - 1), c));
        ctx.fillStyle = aurora;
        ctx.fillRect(ax - 50, 0, 100, canvas.height * 0.4);
    }

    // Estrellas
    for (let i = 0; i < 50; i++) {
        const sx = (i * 97 + 13) % canvas.width;
        const sy = (i * 53 + 7) % (canvas.height * 0.35);
        const tw = Math.abs(Math.sin(Date.now() * 0.002 + i * 0.7));
        ctx.fillStyle = `rgba(200, 230, 255, ${0.3 + tw * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.5 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Luna
    ctx.fillStyle = 'rgba(220, 235, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75, canvas.height * 0.1, 20, 0, Math.PI * 2);
    ctx.fill();
    const moonGlow = ctx.createRadialGradient(canvas.width * 0.75, canvas.height * 0.1, 18, canvas.width * 0.75, canvas.height * 0.1, 60);
    moonGlow.addColorStop(0, 'rgba(200, 225, 255, 0.15)');
    moonGlow.addColorStop(1, 'rgba(200, 225, 255, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75, canvas.height * 0.1, 60, 0, Math.PI * 2);
    ctx.fill();

    // Nieve del suelo
    for (let row = 5; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * CELL;
            const y = row * CELL;
            const noise = Math.sin(col * 0.2) * Math.cos(row * 0.15 + menuAnimationFrame * 0.003);
            let snowColor;
            if (noise > 0.2) snowColor = '#E8F0F8';
            else if (noise > -0.1) snowColor = '#DCE8F4';
            else snowColor = '#D0DCF0';
            ctx.fillStyle = snowColor;
            ctx.fillRect(x, y, CELL, CELL);
        }
    }

    // Ondas del suelo nevado
    ctx.fillStyle = 'rgba(200, 220, 240, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.42);
    for (let x = 0; x <= canvas.width; x += 8) {
        const wave = Math.sin(x * 0.015) * 8 + Math.sin(x * 0.03) * 4;
        ctx.lineTo(x, canvas.height * 0.42 + wave);
    }
    ctx.lineTo(canvas.width, canvas.height * 0.5);
    ctx.lineTo(0, canvas.height * 0.5);
    ctx.closePath();
    ctx.fill();

    // Pinos decorativos
    for (let i = 0; i < 6; i++) {
        const tx = 60 + i * 140 + Math.sin(menuAnimationFrame * 0.003 + i) * 3;
        const ty = canvas.height - 50;
        const s = 30 + (i % 3) * 10;
        drawSnowPine(tx, ty, s);
    }

    // Copos cayendo en el menú
    drawFallingSnow(canvas.width, canvas.height);

    // Niebla fría
    ctx.fillStyle = 'rgba(180, 210, 240, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDecorativeTree(x, y, size) {
    drawSnowPine(x, y, size * 0.4);
}

// ============================================
// HUD (tema nieve)
// ============================================

function drawHUD() {
    ctx.fillStyle = 'rgba(15, 25, 45, 0.9)';
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(130, 180, 220, 0.35)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.stroke();

    ctx.fillStyle = 'rgba(130, 180, 220, 0.12)';
    ctx.fillRect(25, canvas.height - 47, canvas.width - 50, 2);

    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let livesText = '';
    for (let i = 0; i < lives; i++) livesText += '🐍';
    ctx.fillStyle = '#90EE90';
    ctx.fillText(livesText, 30, canvas.height - 30);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#B3E5FC';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🐭' + score, canvas.width - 30, canvas.height - 30);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(130, 180, 220, 0.4)';
    ctx.font = '13px Arial';
    ctx.fillText('P pausa · ESC menú', canvas.width / 2, canvas.height - 30);
}

function initMap() {
    obstacles = generateObstacles();
}

// ============================================
// FONDO DE PAUSA (tema nieve)
// ============================================

function drawPausedBackground() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#0A1525');
    skyGrad.addColorStop(0.5, '#101E30');
    skyGrad.addColorStop(1, '#080F18');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPaused() {
    drawPausedBackground();
    const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = `rgba(179, 229, 252, ${pulse})`;
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#B3E5FC';
    ctx.fillText('Presiona P para continuar', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillStyle = '#81D4FA';
    ctx.fillText('Presiona ESC para salir al menú', canvas.width / 2, canvas.height / 2 + 80);
}