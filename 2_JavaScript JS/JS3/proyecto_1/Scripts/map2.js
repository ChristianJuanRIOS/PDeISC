// ============================================
// MAPA DEL NIVEL 2 - CIUDAD ESTILO JUEGO
// ============================================
// Reemplaza map.js para el nivel 2.
// Funciones con los mismos nombres para compatibilidad.

var CITY_LAYOUT = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0],
    [0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0],
    [0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0],
    [0,1,0,0,0,0,1,1,1,0,1,1,1,0,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

var CITY_ROWS = CITY_LAYOUT.length;
var CITY_COLS = CITY_LAYOUT[0].length;

// ============================================
// PALETA DE COLORES CIUDAD
// ============================================

var BUILDING_COLORS = [
    { main: '#D32F2F', dark: '#9A0007', light: '#FF6659' },
    { main: '#1976D2', dark: '#004BA0', light: '#63A4FF' },
    { main: '#F57C00', dark: '#BB6100', light: '#FFAA40' },
    { main: '#7B1FA2', dark: '#4A0072', light: '#AE52D4' },
    { main: '#00796B', dark: '#004B40', light: '#39A896' },
    { main: '#C2185B', dark: '#880E4F', light: '#F06292' },
    { main: '#455A64', dark: '#1C313A', light: '#718792' },
    { main: '#E65100', dark: '#AC1900', light: '#FF833A' },
];

var CITY_VIS = {
    road: '#505050',
    roadAlt: '#4A4A4A',
    sidewalk: '#8A8A8A',
    sidewalkLight: '#9E9E9E',
    lineYellow: '#FFD54F',
    lineWhite: '#C8C8C8',
    window: '#FFF9C4',
    windowDark: '#3E2723',
    crosswalk: 'rgba(255,255,255,0.25)',
    shadow: 'rgba(0,0,0,0.18)',
    skyNight: '#0a0e27',
    skyBottom: '#1a237e',
    moonGlow: 'rgba(200,210,255,0.08)',
};

// ============================================
// UTILIDADES
// ============================================

function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    return ctx;
}

function isMazePath(col, col2, row, row2) {
    const mc = Math.floor(col / COLS * CITY_COLS);
    const mr = Math.floor(row / ROWS * CITY_ROWS);
    if (mr < 0 || mr >= CITY_ROWS || mc < 0 || mc >= CITY_COLS) return false;
    return CITY_LAYOUT[mr][mc] === 1;
}

function getBuildingColors(mr, mc) {
    const br = Math.floor(mr / 2);
    const bc = Math.floor(mc / 3);
    const idx = ((br * 7 + bc * 13 + 50) % BUILDING_COLORS.length + BUILDING_COLORS.length) % BUILDING_COLORS.length;
    return BUILDING_COLORS[idx];
}

function isWindowLit(mr, mc, face, i) {
    const code = face === 'l' ? 1 : face === 'r' ? 2 : face === 't' ? 3 : 4;
    return ((mr * 31 + mc * 17 + code * 7 + i * 13 + 99) % 10) > 3;
}

// ============================================
// DIBUJAR CELDA DE EDIFICIO
// ============================================

function drawBuildingCell(x, y, w, h, mr, mc) {
    const colors = getBuildingColors(mr, mc);
    const offset = Math.max(2, w * 0.09);

    // Sombra 3D (desplazada abajo-derecha)
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(x + offset, y + offset, w, h);

    // Cara principal
    ctx.fillStyle = colors.dark;
    ctx.fillRect(x, y, w, h);

    // Techo (color principal, más chico)
    ctx.fillStyle = colors.main;
    ctx.fillRect(x, y, w - offset, h - offset);

    // Borde superior claro (luz de arriba)
    ctx.fillStyle = colors.light;
    ctx.fillRect(x + 1, y + 1, w - offset - 2, Math.max(1.5, offset * 0.5));

    // Borde izquierdo claro
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + 1, y + 1, Math.max(1.5, offset * 0.5), h - offset - 2);

    // Ventanas en caras que dan a la calle
    drawBuildingWindows(x, y, w, h, mr, mc);
}

// ============================================
// VENTANAS DE EDIFICIOS
// ============================================

function drawBuildingWindows(x, y, w, h, mr, mc) {
    const faces = [];
    if (mc > 0 && CITY_LAYOUT[mr][mc - 1] === 1) faces.push('l');
    if (mc < CITY_COLS - 1 && CITY_LAYOUT[mr][mc + 1] === 1) faces.push('r');
    if (mr > 0 && CITY_LAYOUT[mr - 1][mc] === 1) faces.push('t');
    if (mr < CITY_ROWS - 1 && CITY_LAYOUT[mr + 1][mc] === 1) faces.push('b');

    const winS = Math.max(2, w * 0.14);
    const margin = w * 0.18;
    const gap = w * 0.12;

    for (const face of faces) {
        for (let i = 0; i < 2; i++) {
            ctx.fillStyle = isWindowLit(mr, mc, face, i) ? CITY_VIS.window : CITY_VIS.windowDark;
            switch (face) {
                case 'l':
                    ctx.fillRect(x + margin * 0.5, y + margin + i * (winS + gap), winS, winS);
                    break;
                case 'r':
                    ctx.fillRect(x + w - margin * 0.5 - winS, y + margin + i * (winS + gap), winS, winS);
                    break;
                case 't':
                    ctx.fillRect(x + margin + i * (winS + gap), y + margin * 0.5, winS, winS);
                    break;
                case 'b':
                    ctx.fillRect(x + margin + i * (winS + gap), y + h - margin * 0.5 - winS, winS, winS);
                    break;
            }
        }
    }
}

// ============================================
// DIBUJAR CELDA DE CALLE
// ============================================

function drawRoadCell(x, y, w, h, mr, mc) {
    // Asfalto base
    const noise = ((mr * 7 + mc * 13) % 5);
    ctx.fillStyle = noise < 2 ? CITY_VIS.road : CITY_VIS.roadAlt;
    ctx.fillRect(x, y, w, h);

    // Textura sutil del asfalto
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    if ((mr + mc) % 2 === 0) ctx.fillRect(x, y, w, h);

    // Aceras en bordes que tocan edificios
    drawSidewalks(x, y, w, h, mr, mc);

    // Marcas en el camino
    drawRoadMarkings(x, y, w, h, mr, mc);
}

// ============================================
// ACERAS
// ============================================

function drawSidewalks(x, y, w, h, mr, mc) {
    const sw = Math.max(2, w * 0.1);

    ctx.fillStyle = CITY_VIS.sidewalk;
    if (mr > 0 && CITY_LAYOUT[mr - 1][mc] === 0) {
        ctx.fillRect(x, y, w, sw);
        ctx.fillStyle = CITY_VIS.sidewalkLight;
        ctx.fillRect(x, y, w, Math.max(1, sw * 0.4));
    }
    ctx.fillStyle = CITY_VIS.sidewalk;
    if (mr < CITY_ROWS - 1 && CITY_LAYOUT[mr + 1][mc] === 0) {
        ctx.fillRect(x, y + h - sw, w, sw);
        ctx.fillStyle = CITY_VIS.sidewalkLight;
        ctx.fillRect(x, y + h - Math.max(1, sw * 0.4), w, Math.max(1, sw * 0.4));
    }
    ctx.fillStyle = CITY_VIS.sidewalk;
    if (mc > 0 && CITY_LAYOUT[mr][mc - 1] === 0) {
        ctx.fillRect(x, y, sw, h);
        ctx.fillStyle = CITY_VIS.sidewalkLight;
        ctx.fillRect(x, y, Math.max(1, sw * 0.4), h);
    }
    ctx.fillStyle = CITY_VIS.sidewalk;
    if (mc < CITY_COLS - 1 && CITY_LAYOUT[mr][mc + 1] === 0) {
        ctx.fillRect(x + w - sw, y, sw, h);
        ctx.fillStyle = CITY_VIS.sidewalkLight;
        ctx.fillRect(x + w - Math.max(1, sw * 0.4), y, Math.max(1, sw * 0.4), h);
    }
}

// ============================================
// MARCAS EN EL CAMINO (líneas, cruces)
// ============================================

function drawRoadMarkings(x, y, w, h, mr, mc) {
    const isH = (mc > 0 && CITY_LAYOUT[mr][mc - 1] === 1) && (mc < CITY_COLS - 1 && CITY_LAYOUT[mr][mc + 1] === 1);
    const isV = (mr > 0 && CITY_LAYOUT[mr - 1][mc] === 1) && (mr < CITY_ROWS - 1 && CITY_LAYOUT[mr + 1][mc] === 1);

    ctx.lineWidth = Math.max(1, w * 0.045);

    // Línea central discontinua
    if (isH && !isV) {
        ctx.strokeStyle = CITY_VIS.lineYellow;
        ctx.setLineDash([w * 0.22, w * 0.18]);
        ctx.beginPath();
        ctx.moveTo(x, y + h / 2);
        ctx.lineTo(x + w, y + h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    } else if (isV && !isH) {
        ctx.strokeStyle = CITY_VIS.lineWhite;
        ctx.setLineDash([h * 0.22, h * 0.18]);
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w / 2, y + h);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Cruce peatonal en intersecciones
    if (isH && isV) {
        ctx.fillStyle = CITY_VIS.crosswalk;
        const stripeW = Math.max(2, w * 0.09);
        const stripeGap = Math.max(1.5, w * 0.07);
        for (let i = 0; i < 3; i++) {
            const sx = x + w * 0.2 + i * (stripeW + stripeGap);
            ctx.fillRect(sx, y, stripeW, h);
        }
    }
}

// ============================================
// DECORACIONES URBANAS
// ============================================

function drawCityDecorations(cellW, cellH) {
    for (let mr = 0; mr < CITY_ROWS; mr++) {
        for (let mc = 0; mc < CITY_COLS; mc++) {
            if (CITY_LAYOUT[mr][mc] !== 1) continue;
            const hash = ((mr * 11 + mc * 23 + 7) % 40);
            const x = mc * cellW;
            const y = mr * cellH;
            const cx = x + cellW / 2;
            const cy = y + cellH / 2;

            if (hash === 5) {
                // Farola
                drawStreetLamp(cx, cy, cellW);
            } else if (hash === 12) {
                // Tapas de alcantarilla
                drawManhole(cx, cy, cellW);
            }
        }
    }
}

function drawStreetLamp(cx, cy, size) {
    const r = size * 0.04;
    // Poste
    ctx.fillStyle = '#616161';
    ctx.fillRect(cx - r, cy - r * 2, r * 2, r * 4);
    // Luz
    ctx.fillStyle = 'rgba(255, 235, 150, 0.7)';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 2.5, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
    // Resplandor
    ctx.fillStyle = 'rgba(255, 235, 150, 0.08)';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawManhole(cx, cy, size) {
    const r = size * 0.1;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(80,80,80,0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Líneas de la tapa
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.6, cy);
    ctx.lineTo(cx + r * 0.6, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.6);
    ctx.lineTo(cx, cy + r * 0.6);
    ctx.stroke();
}

function drawCityTree(cx, cy, size) {
    const r = size * 0.15;
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(cx + 1, cy + r * 0.8, r * 0.7, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tronco
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(cx - r * 0.12, cy - r * 0.1, r * 0.24, r * 0.6);
    // Copa
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.4, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(cx - r * 0.1, cy - r * 0.55, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// FONDO PRINCIPAL DEL MAPA
// ============================================

function drawMapBackground() {
    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / CITY_COLS;
    const cellH = ch / CITY_ROWS;

    // Fondo base (color de edificios para los bordes)
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(0, 0, cw, ch);

    // Dibujar celda a celda
    for (let mr = 0; mr < CITY_ROWS; mr++) {
        for (let mc = 0; mc < CITY_COLS; mc++) {
            const x = mc * cellW;
            const y = mr * cellH;
            if (CITY_LAYOUT[mr][mc] === 1) {
                drawRoadCell(x, y, cellW, cellH, mr, mc);
            } else {
                drawBuildingCell(x, y, cellW, cellH, mr, mc);
            }
        }
    }

    // Decoraciones urbanas
    drawCityDecorations(cellW, cellH);

    // Viñeta sutil
    const vignette = ctx.createRadialGradient(cw / 2, ch / 2, cw * 0.3, cw / 2, ch / 2, cw * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);
}

// ============================================
// HUD CIUDAD
// ============================================

function drawHUD() {
    // Panel inferior estilo ciudad
    ctx.fillStyle = 'rgba(15, 20, 35, 0.9)';
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(100, 140, 200, 0.25)';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 15, canvas.height - 50, canvas.width - 30, 40, 10);
    ctx.stroke();

    // Línea decorativa azul
    ctx.fillStyle = 'rgba(100, 140, 200, 0.12)';
    ctx.fillRect(25, canvas.height - 47, canvas.width - 50, 2);

    // Vidas
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let livesText = '';
    for (let i = 0; i < lives; i++) livesText += '🐍';
    ctx.fillStyle = '#81C784';
    ctx.fillText(livesText, 30, canvas.height - 30);

    // Puntuación
    ctx.textAlign = 'right';
    ctx.fillStyle = '#90CAF9';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🐭 ' + score, canvas.width - 30, canvas.height - 30);

    // Indicador de pausa
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(144, 202, 249, 0.35)';
    ctx.font = '13px Arial';
    ctx.fillText('P pausa · ESC menú', canvas.width / 2, canvas.height - 30);
}

// ============================================
// PAUSA
// ============================================

function drawPausedBackground() {
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPaused() {
    drawPausedBackground();
    const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = `rgba(144, 202, 249, ${pulse})`;
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#90CAF9';
    ctx.fillText('Presiona P para continuar', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('Presiona ESC para salir al menú', canvas.width / 2, canvas.height / 2 + 80);
}

// ============================================
// FONDO DE MENÚ - CIELINIO NOCTURNO
// ============================================

function drawForestMenuBackground() {
    const cw = canvas.width;
    const ch = canvas.height;

    // Cielo nocturno
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch * 0.55);
    skyGrad.addColorStop(0, '#050820');
    skyGrad.addColorStop(0.5, '#0d1540');
    skyGrad.addColorStop(1, '#1a237e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Estrellas
    for (let i = 0; i < 80; i++) {
        const sx = (i * 137 + 50) % cw;
        const sy = (i * 89 + 20) % (ch * 0.5);
        const brightness = 0.3 + ((i * 7) % 10) * 0.07;
        const twinkle = Math.sin(menuAnimationFrame * 0.02 + i * 1.7) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(220, 230, 255, ${brightness * twinkle})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Luna
    const moonX = cw * 0.8;
    const moonY = ch * 0.12;
    ctx.fillStyle = 'rgba(200, 210, 240, 0.06)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(200, 210, 240, 0.1)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E8EAF6';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C5CAE9';
    ctx.beginPath();
    ctx.arc(moonX - 5, moonY - 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 7, moonY + 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Silueta de edificios
    drawCitySkyline(cw, ch);

    // Calle inferior
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(0, ch * 0.88, cw, ch * 0.12);
    ctx.fillStyle = '#3A3A3A';
    ctx.fillRect(0, ch * 0.88, cw, 2);

    // Líneas de calle
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(0, ch * 0.94);
    ctx.lineTo(cw, ch * 0.94);
    ctx.stroke();
    ctx.setLineDash([]);

    // Niebla urbana
    ctx.fillStyle = 'rgba(100, 130, 180, 0.05)';
    ctx.fillRect(0, 0, cw, ch);
}

function drawCitySkyline(cw, ch) {
    const baseY = ch * 0.88;

    // Edificios de fondo (más oscuros, más altos)
    const backBuildings = [
        { x: 0, w: 60, h: 180 },
        { x: 55, w: 45, h: 140 },
        { x: 95, w: 70, h: 220 },
        { x: 160, w: 50, h: 160 },
        { x: 205, w: 80, h: 250 },
        { x: 280, w: 55, h: 190 },
        { x: 330, w: 65, h: 210 },
        { x: 390, w: 50, h: 150 },
        { x: 435, w: 75, h: 240 },
        { x: 505, w: 60, h: 170 },
        { x: 560, w: 70, h: 200 },
        { x: 625, w: 55, h: 230 },
        { x: 675, w: 80, h: 160 },
        { x: 750, w: 50, h: 190 },
        { x: 795, w: 70, h: 250 },
        { x: 860, w: 60, h: 140 },
        { x: 915, w: 75, h: 210 },
    ];

    ctx.fillStyle = '#0d1030';
    for (const b of backBuildings) {
        const bx = b.x + Math.sin(menuAnimationFrame * 0.001 + b.x * 0.01) * 0.5;
        ctx.fillRect(bx, baseY - b.h, b.w, b.h);
    }

    // Edificios de frente (más claros, variados)
    const frontBuildings = [
        { x: 10, w: 55, h: 130, color: '#151838' },
        { x: 60, w: 40, h: 100, color: '#181c40' },
        { x: 105, w: 65, h: 160, color: '#141735' },
        { x: 175, w: 50, h: 120, color: '#191d42' },
        { x: 230, w: 70, h: 190, color: '#12152e' },
        { x: 305, w: 55, h: 140, color: '#171b3d' },
        { x: 365, w: 60, h: 170, color: '#13162f' },
        { x: 430, w: 50, h: 110, color: '#1a1e45' },
        { x: 485, w: 75, h: 200, color: '#111428' },
        { x: 565, w: 55, h: 130, color: '#181c40' },
        { x: 625, w: 65, h: 180, color: '#141735' },
        { x: 695, w: 50, h: 150, color: '#191d42' },
        { x: 750, w: 60, h: 120, color: '#161a3a' },
        { x: 815, w: 70, h: 210, color: '#10132a' },
        { x: 890, w: 55, h: 140, color: '#181c40' },
        { x: 950, w: 60, h: 160, color: '#13162f' },
    ];

    for (const b of frontBuildings) {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, baseY - b.h, b.w, b.h);

        // Ventanas iluminadas
        const winW = 3, winH = 4, gapX = 7, gapY = 8;
        for (let wy = baseY - b.h + 8; wy < baseY - 8; wy += gapY) {
            for (let wx = b.x + 5; wx < b.x + b.w - 5; wx += gapX) {
                const lit = ((wx * 7 + wy * 13 + 33) % 10) > 5;
                const flicker = Math.sin(menuAnimationFrame * 0.01 + wx * 0.1 + wy * 0.1) > -0.8;
                if (lit && flicker) {
                    ctx.fillStyle = 'rgba(255, 224, 130, 0.8)';
                } else {
                    ctx.fillStyle = 'rgba(30, 35, 60, 0.6)';
                }
                ctx.fillRect(wx, wy, winW, winH);
            }
        }
    }
}

// ============================================
// COMPATIBILIDAD (funciones vacías)
// ============================================

function initMap() {
    obstacles = generateObstacles();
}

function drawModernTrees() { /* Sin árboles modernos en ciudad */ }
function drawModernTree() { /* Sin árboles modernos en ciudad */ }
function drawModernVegetation() { /* Sin vegetación moderna en ciudad */ }
// ============================================
// COLISIONES — usa CITY_LAYOUT (nivel 2)
// ============================================

function isOnPath(col, row) {
    const mc = Math.floor(col / COLS * CITY_COLS);
    const mr = Math.floor(row / ROWS * CITY_ROWS);
    if (mr < 0 || mr >= CITY_ROWS || mc < 0 || mc >= CITY_COLS) return false;
    return CITY_LAYOUT[mr][mc] === 1;
}

function getPathCells() {
    const cells = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (isOnPath(col, row)) cells.push({ x: col, y: row });
        }
    }
    return cells;
}