// ============================================
// MAPA DEL NIVEL 1 - LABERINTO BOSQUE ESTILO JUEGO
// ============================================

// Definición del laberinto: 1 = camino (amarillo), 0 = césped (verde)
// Se define como rejilla relativa, se escala al canvas
var MAZE_LAYOUT = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0],
    [0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0],
    [0,1,0,1,0,0,1,0,1,0,0,0,0,1,0,0,1,0,1,0],
    [0,1,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,0],
    [0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0],
    [0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0],
    [0,1,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,0,1,0,1,0,0,1,0,1,0,1,1,1,1,0],
    [0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0],
    [0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

var MAZE_ROWS = MAZE_LAYOUT.length;
var MAZE_COLS = MAZE_LAYOUT[0].length;

// Convierte coordenadas de grilla del juego (col, row en CELL) a celda del laberinto
// y devuelve true si es camino transitable
function isOnPath(gridX, gridY) {
    const mc = Math.floor(gridX / COLS * MAZE_COLS);
    const mr = Math.floor(gridY / ROWS * MAZE_ROWS);
    if (mr < 0 || mr >= MAZE_ROWS || mc < 0 || mc >= MAZE_COLS) return false;
    return MAZE_LAYOUT[mr][mc] === 1;
}

// Lista de todas las celdas de juego que caen sobre camino (para spawn de comida)
function getPathCells() {
    const cells = [];
    for (let gy = 0; gy < ROWS; gy++) {
        for (let gx = 0; gx < COLS; gx++) {
            if (isOnPath(gx, gy)) cells.push({ x: gx, y: gy });
        }
    }
    return cells;
}

function drawMazeCell(x, y, w, h, isPath) {
    if (isPath) {
        // Camino amarillo/beige estilo cartoon
        const pathGrad = ctx.createLinearGradient(x, y, x, y + h);
        pathGrad.addColorStop(0, '#F0D060');
        pathGrad.addColorStop(0.4, '#E8C840');
        pathGrad.addColorStop(1, '#D4B030');
        ctx.fillStyle = pathGrad;
        ctx.fillRect(x, y, w, h);

        // Textura sutil del camino
        ctx.fillStyle = 'rgba(200, 160, 20, 0.15)';
        if ((Math.floor(x / w) + Math.floor(y / h)) % 2 === 0) {
            ctx.fillRect(x, y, w, h);
        }
    } else {
        // Césped verde con variación
        const col = Math.floor(x / w);
        const row = Math.floor(y / h);
        const noise = Math.sin(col * 0.37 + row * 0.29) * Math.cos(col * 0.13 + row * 0.17);
        let grassColor;
        if (noise > 0.4) grassColor = '#5BAD45';
        else if (noise > 0.1) grassColor = '#4E9E38';
        else if (noise > -0.2) grassColor = '#428F2C';
        else grassColor = '#367F20';
        ctx.fillStyle = grassColor;
        ctx.fillRect(x, y, w, h);
    }
}

function drawMapBackground() {
    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / MAZE_COLS;
    const cellH = ch / MAZE_ROWS;

    // ===== FONDO BASE VERDE =====
    ctx.fillStyle = '#428F2C';
    ctx.fillRect(0, 0, cw, ch);

    // ===== DIBUJAR LABERINTO CELDA A CELDA =====
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            const x = mc * cellW;
            const y = mr * cellH;
            drawMazeCell(x, y, cellW, cellH, MAZE_LAYOUT[mr][mc] === 1);
        }
    }

    // ===== BORDES DE LOS CAMINOS (línea oscura entre camino y césped) =====
    ctx.strokeStyle = 'rgba(180, 140, 20, 0.5)';
    ctx.lineWidth = 1.5;
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const x = mc * cellW;
            const y = mr * cellH;
            // Borde superior si hay césped arriba
            if (mr === 0 || MAZE_LAYOUT[mr-1][mc] !== 1) {
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cellW, y); ctx.stroke();
            }
            // Borde inferior
            if (mr === MAZE_ROWS-1 || MAZE_LAYOUT[mr+1][mc] !== 1) {
                ctx.beginPath(); ctx.moveTo(x, y + cellH); ctx.lineTo(x + cellW, y + cellH); ctx.stroke();
            }
            // Borde izquierdo
            if (mc === 0 || MAZE_LAYOUT[mr][mc-1] !== 1) {
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cellH); ctx.stroke();
            }
            // Borde derecho
            if (mc === MAZE_COLS-1 || MAZE_LAYOUT[mr][mc+1] !== 1) {
                ctx.beginPath(); ctx.moveTo(x + cellW, y); ctx.lineTo(x + cellW, y + cellH); ctx.stroke();
            }
        }
    }

    // ===== LÍNEAS DE GRILLA EN EL CAMINO (secciones visibles) =====
    drawPathGrid(cellW, cellH);

    // ===== ÁRBOLES SOBRE LAS CELDAS DE CÉSPED =====
    drawMazeTrees(cellW, cellH);

    // ===== PIEDRAS EN EL CÉSPED =====
    drawMazeRocks(cellW, cellH);

    // ===== DECORACIONES EXTRA =====
    drawMazeDecorations(cellW, cellH);

    // ===== VIÑETA SUTIL EN LOS BORDES =====
    const vignette = ctx.createRadialGradient(cw/2, ch/2, cw * 0.3, cw/2, ch/2, cw * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);
}

// ============================================
// GRILLA EN EL CAMINO (líneas de sección)
// ============================================

function drawPathGrid(cellW, cellH) {
    // Calcula el tamaño de celda de juego en píxeles
    const gw = canvas.width / COLS;
    const gh = canvas.height / ROWS;

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.10)';
    ctx.lineWidth = 0.8;

    // Líneas verticales — solo dentro de celdas de camino
    for (let gx = 0; gx <= COLS; gx++) {
        const px = gx * gw;
        // Recorrer verticalmente y dibujar solo segmentos sobre camino
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

    // Líneas horizontales — solo dentro de celdas de camino
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
// PIEDRAS EN EL CÉSPED
// ============================================

function drawMazeRocks(cellW, cellH) {
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;

            // Si esta celda ya tiene árbol, no poner piedra
            const treeHash = (mr * 7 + mc * 13) % 10;
            if (treeHash < 5) continue; // tiene árbol

            const hash = (mr * 17 + mc * 11) % 12;
            if (hash > 3) continue; // no le toca piedra

            const cx = (mc + 0.5 + (Math.sin(mr * 2.1 + mc) * 0.28)) * cellW;
            const cy = (mr + 0.62 + (Math.cos(mr + mc * 1.7) * 0.18)) * cellH;
            const sizeVar = 0.55 + ((mr * 5 + mc * 3) % 10) * 0.055; // 0.55–1.1
            drawCartoonRock(cx, cy, cellW * 0.28 * sizeVar);
        }
    }
}

function drawCartoonRock(x, y, r) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.13)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.12, y + r * 0.45, r * 0.85, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Piedra base — gris verdoso
    const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.2, r * 0.05, x, y, r * 1.05);
    grad.addColorStop(0,   '#B0B8A8');
    grad.addColorStop(0.5, '#8E9882');
    grad.addColorStop(1,   '#6A7260');
    ctx.fillStyle = grad;

    // Forma irregular de la piedra (polígono suavizado)
    ctx.beginPath();
    ctx.moveTo(x - r * 0.55, y + r * 0.15);
    ctx.bezierCurveTo(x - r * 0.7,  y - r * 0.3,  x - r * 0.3,  y - r * 0.9,  x + r * 0.1,  y - r * 0.85);
    ctx.bezierCurveTo(x + r * 0.55, y - r * 0.8,  x + r * 0.95, y - r * 0.35, x + r * 0.85, y + r * 0.2);
    ctx.bezierCurveTo(x + r * 0.7,  y + r * 0.55, x - r * 0.2,  y + r * 0.55, x - r * 0.55, y + r * 0.15);
    ctx.closePath();
    ctx.fill();

    // Contorno sutil
    ctx.strokeStyle = 'rgba(60, 70, 55, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Líneas de fisura
    ctx.strokeStyle = 'rgba(60, 70, 55, 0.2)';
    ctx.lineWidth = 0.7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - r * 0.05, y - r * 0.55);
    ctx.lineTo(x + r * 0.18, y - r * 0.1);
    ctx.lineTo(x + r * 0.05, y + r * 0.22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r * 0.25, y - r * 0.1);
    ctx.lineTo(x - r * 0.05, y + r * 0.18);
    ctx.stroke();

    // Highlight superior (luz)
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.2, y - r * 0.4, r * 0.32, r * 0.18, -0.4, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// ÁRBOLES DEL LABERINTO (sobre celdas de césped)
// ============================================

function drawMazeTrees(cellW, cellH) {
    // Posicionar árboles en celdas de césped (no en caminos)
    // Lista de posiciones [mazeRow, mazeCol] donde poner árboles
    const treeSpots = [];
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] === 0) {
                // Solo plantar árbol en algunas celdas (patrón)
                const hash = (mr * 7 + mc * 13) % 10;
                if (hash < 5) { // ~50% de las celdas de césped tienen árbol
                    treeSpots.push({ mr, mc });
                }
            }
        }
    }

    for (const { mr, mc } of treeSpots) {
        const cx = (mc + 0.5) * cellW;
        const cy = (mr + 0.5) * cellH;
        const sizeFactor = 0.5 + ((mr * 3 + mc * 5) % 10) * 0.07; // 0.5 a 1.2
        drawCartoonTree(cx, cy, cellW * 0.45 * sizeFactor);
    }
}

// ============================================
// ÁRBOL ESTILO CARTOON (como imagen referencia)
// ============================================

function drawCartoonTree(x, y, r) {
    // Sombra ovalada en el suelo
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.1, y + r * 0.35, r * 0.65, r * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tronco
    ctx.fillStyle = '#7B5230';
    ctx.beginPath();
    ctx.roundRect
        ? ctx.roundRect(x - r * 0.13, y - r * 0.1, r * 0.26, r * 0.55, r * 0.05)
        : ctx.rect(x - r * 0.13, y - r * 0.1, r * 0.26, r * 0.55);
    ctx.fill();

    // Tronco highlight
    ctx.fillStyle = '#9B6B40';
    ctx.beginPath();
    ctx.rect(x - r * 0.05, y - r * 0.08, r * 0.08, r * 0.45);
    ctx.fill();

    // Copa - capa base (más oscura)
    ctx.fillStyle = '#3A8A2A';
    ctx.beginPath();
    ctx.arc(x, y - r * 0.45, r * 0.78, 0, Math.PI * 2);
    ctx.fill();

    // Copa - capa media
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(x - r * 0.12, y - r * 0.58, r * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + r * 0.12, y - r * 0.55, r * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // Copa - capa superior (clara, brillo)
    ctx.fillStyle = '#66BB6A';
    ctx.beginPath();
    ctx.arc(x, y - r * 0.78, r * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Highlight blanco suave en la copa
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.arc(x - r * 0.1, y - r * 0.88, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// DECORACIONES DEL LABERINTO
// ============================================

function drawMazeDecorations(cellW, cellH) {
    // Pequeños detalles en los caminos: flores y piedras
    for (let mr = 0; mr < MAZE_ROWS; mr++) {
        for (let mc = 0; mc < MAZE_COLS; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 1) continue;
            const hash = (mr * 11 + mc * 17) % 20;
            const x = (mc + 0.5) * cellW;
            const y = (mr + 0.5) * cellH;

            if (hash === 3) {
                // Pequeña flor en el camino
                ctx.fillStyle = 'rgba(255, 200, 50, 0.55)';
                ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
            } else if (hash === 7) {
                // Piedra pequeña
                ctx.fillStyle = 'rgba(180, 160, 110, 0.4)';
                ctx.beginPath();
                ctx.ellipse(x, y, cellW * 0.08, cellH * 0.05, 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Arbustos pequeños en las esquinas de césped junto a caminos
    for (let mr = 1; mr < MAZE_ROWS - 1; mr++) {
        for (let mc = 1; mc < MAZE_COLS - 1; mc++) {
            if (MAZE_LAYOUT[mr][mc] !== 0) continue;
            // Solo si está adyacente a un camino
            const adj = MAZE_LAYOUT[mr-1][mc] + MAZE_LAYOUT[mr+1][mc] +
                        MAZE_LAYOUT[mr][mc-1] + MAZE_LAYOUT[mr][mc+1];
            if (adj === 0) continue;
            const hash = (mr * 9 + mc * 19) % 15;
            if (hash !== 4) continue;

            const bx = (mc + 0.5) * cellW;
            const by = (mr + 0.75) * cellH;
            const bs = cellW * 0.18;

            ctx.fillStyle = '#2E7D32';
            ctx.beginPath(); ctx.arc(bx, by, bs, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#43A047';
            ctx.beginPath(); ctx.arc(bx - bs * 0.3, by - bs * 0.2, bs * 0.7, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(bx + bs * 0.3, by - bs * 0.15, bs * 0.65, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.arc(bx, by - bs * 0.35, bs * 0.5, 0, Math.PI * 2); ctx.fill();
        }
    }
}

// drawModernTrees y drawModernTree se mantienen para compatibilidad con el menú
function drawModernTrees() {
    // La lógica de árboles del mapa ahora está en drawMazeTrees (llamada desde drawMapBackground)
}

// ============================================
// DIBUJAR ÁRBOL MODERNO
// ============================================

function drawModernTree(x, y, size) {
    const r = size * CELL * 0.7;
    
    // Sombra del árbol
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(x + 3, y + 5, r * 0.7, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tronco (más grueso en la base)
    const trunkGrad = ctx.createLinearGradient(x - r * 0.1, 0, x + r * 0.1, 0);
    trunkGrad.addColorStop(0, '#4E342E');
    trunkGrad.addColorStop(0.5, '#6D4C41');
    trunkGrad.addColorStop(1, '#4E342E');
    ctx.fillStyle = trunkGrad;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.08, y + r * 0.45);
    ctx.lineTo(x - r * 0.05, y - r * 0.05);
    ctx.lineTo(x + r * 0.05, y - r * 0.05);
    ctx.lineTo(x + r * 0.08, y + r * 0.45);
    ctx.closePath();
    ctx.fill();
    
    // Ramas principales
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        const angle = i * 0.8 + 0.2;
        ctx.beginPath();
        ctx.moveTo(x + i * r * 0.06, y - r * 0.05);
        ctx.lineTo(x + Math.sin(angle) * r * 0.3, y - r * 0.2 - Math.abs(i) * r * 0.1);
        ctx.stroke();
    }
    
    // Copa del árbol (capas de follaje redondeado)
    const foliageLayers = [
        { color: '#2E7D32', yOff: -0.35, size: 0.75, xOff: 0 },
        { color: '#388E3C', yOff: -0.5, size: 0.65, xOff: -r * 0.05 },
        { color: '#43A047', yOff: -0.6, size: 0.55, xOff: r * 0.05 },
        { color: '#4CAF50', yOff: -0.7, size: 0.45, xOff: 0 },
        { color: '#66BB6A', yOff: -0.78, size: 0.35, xOff: -r * 0.03 },
    ];
    
    for (const layer of foliageLayers) {
        ctx.fillStyle = layer.color;
        ctx.beginPath();
        ctx.arc(x + layer.xOff, y + (layer.yOff * r), r * layer.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Detalles de luz en las hojas
    ctx.fillStyle = 'rgba(150, 220, 100, 0.1)';
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.3;
        const radius = r * 0.4;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * radius, y - r * 0.5 + Math.sin(angle) * radius * 0.5, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawModernVegetation() {
    // La vegetación ahora está integrada en drawMazeDecorations
}


// ============================================
// FONDO DEL MENÚ
// ============================================

function drawForestMenuBackground() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
    skyGrad.addColorStop(0, FOREST.skyTop);
    skyGrad.addColorStop(1, FOREST.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);
    
    for (let row = 5; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * CELL;
            const y = row * CELL;
            const noise = Math.sin(col * 0.2) * Math.cos(row * 0.2 + menuAnimationFrame * 0.01);
            let grassColor;
            if (noise > 0.3) grassColor = FOREST.grass1;
            else if (noise > 0) grassColor = FOREST.grass2;
            else grassColor = FOREST.grass3;
            ctx.fillStyle = grassColor;
            ctx.fillRect(x, y, CELL, CELL);
        }
    }
    
    for (let i = 0; i < 6; i++) {
        const x = 50 + i * 150 + Math.sin(menuAnimationFrame * 0.005 + i) * 5;
        const y = canvas.height - 100;
        drawDecorativeTree(x, y, 40);
    }
    
    for (let i = 0; i < 30; i++) {
        const lx = (i * 73 + menuAnimationFrame * 2) % canvas.width;
        const ly = (i * 179 + menuAnimationFrame) % (canvas.height * 0.6);
        ctx.fillStyle = FOREST.leafBrown;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.ellipse(lx, ly, 3, 1.5, Math.sin(menuAnimationFrame * 0.01 + i) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = FOREST.fog;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDecorativeTree(x, y, size) {
    ctx.fillStyle = FOREST.shadow;
    ctx.beginPath();
    ctx.ellipse(x + 3, y + 4, size * 0.4, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = FOREST.treeTrunk;
    ctx.fillRect(x - size * 0.08, y - size * 0.2, size * 0.16, size * 0.5);
    ctx.fillStyle = FOREST.leafDark;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.15, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = FOREST.leafMid;
    ctx.beginPath();
    ctx.arc(x - size * 0.1, y - size * 0.35, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size * 0.1, y - size * 0.35, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = FOREST.leafLight;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.55, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// HUD MEJORADO
// ============================================

function drawHUD() {
    // Panel inferior
    ctx.fillStyle = 'rgba(20, 15, 10, 0.85)';
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.stroke();
    
    // Línea decorativa
    ctx.fillStyle = 'rgba(139, 69, 19, 0.15)';
    ctx.fillRect(25, canvas.height - 47, canvas.width - 50, 2);
    
    // Vidas
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let livesText = '';
    for (let i = 0; i < lives; i++) livesText += '♥ ';
    ctx.fillStyle = '#A5D6A7';
    ctx.fillText(livesText, 30, canvas.height - 30);
    
    // Puntuación
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Ratones: ' + score, canvas.width - 30, canvas.height - 30);
    
    // Indicador de pausa
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 213, 79, 0.4)';
    ctx.font = '13px Arial';
    ctx.fillText('P pausa · ESC menú', canvas.width / 2, canvas.height - 30);
}

function initMap() {
    obstacles = generateObstacles();
}

// ============================================
// FONDO DE PAUSA
// ============================================

function drawPausedBackground() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#0a1a0a');
    skyGrad.addColorStop(1, '#051005');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPaused() {
    drawPausedBackground();
    const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = `rgba(255, 213, 79, ${pulse})`;
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#A5D6A7';
    ctx.fillText('Presiona P para continuar', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('Presiona ESC para salir al menú', canvas.width / 2, canvas.height / 2 + 80);
}