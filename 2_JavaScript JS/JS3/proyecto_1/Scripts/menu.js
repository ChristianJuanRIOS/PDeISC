// MENÚ PRINCIPAL — FONDO CON 5 BIOMAS VERTICALES

let lastTimestamp = 0;

// ── Variables para mini serpiente y candado ────────────────────────────────
let miniSnakeProgress = 0;
let miniSnakeLastTimestamp = 0;
let lockedShakeTime = 0;
let isShaking = false;

function updateMiniSnake(timestamp) {
    if (!miniSnakeLastTimestamp) miniSnakeLastTimestamp = timestamp;
    const delta = (timestamp - miniSnakeLastTimestamp) / 1000;
    miniSnakeLastTimestamp = timestamp;
    miniSnakeProgress += delta * 0.12;
    if (miniSnakeProgress >= 1) miniSnakeProgress -= 1;
}

function triggerLockShake() {
    isShaking = true;
    lockedShakeTime = Date.now();
}

function getShakeOffset() {
    if (!isShaking) return { x: 0, y: 0, rot: 0 };
    const elapsed = (Date.now() - lockedShakeTime) / 1000;
    if (elapsed < 0.6) {
        const decay = 1 - elapsed / 0.6;
        return {
            x: Math.sin(elapsed * 45) * 6 * decay,
            y: Math.cos(elapsed * 50) * 3 * decay,
            rot: Math.sin(elapsed * 40) * 0.04 * decay
        };
    }
    isShaking = false;
    return { x: 0, y: 0, rot: 0 };
}

// ── Paletas por bioma ──────────────────────────────────────────────────────────
const biomas = [
    {
        nombre: "BOSQUE",
        xStart: 0, xEnd: 0.2,
        tipo: "forest",
        sky: ["#0d2b1a", "#1a4a2e", "#2d6e42"],
        ground: "#3a5a2a",
        accent: "#4CAF50"
    },
    {
        nombre: "CIUDAD",
        xStart: 0.2, xEnd: 0.4,
        tipo: "city",
        sky: ["#1a1a2e", "#2d2d4a", "#3a3a5a"],
        ground: "#2a2a3a",
        accent: "#78909C"
    },
    {
        nombre: "DESIERTO",
        xStart: 0.4, xEnd: 0.6,
        tipo: "desert",
        sky: ["#7a3a10", "#c0621a", "#e8a040"],
        ground: "#c2a46b",
        accent: "#F4A460"
    },
    {
        nombre: "NEVADO",
        xStart: 0.6, xEnd: 0.8,
        tipo: "snow",
        sky: ["#1a2a4a", "#2a4a6a", "#4a7a9a"],
        ground: "#dce8f0",
        accent: "#81D4FA"
    },
    {
        nombre: "VOLCÁN",
        xStart: 0.8, xEnd: 1.0,
        tipo: "volcano",
        sky: ["#1a0a00", "#3a1200", "#6a2800"],
        ground: "#1a0a00",
        accent: "#FF5722"
    }
];

// ── Estado de la serpiente viajera ─────────────────────────────────────────────
let snakeX = 0, snakeY = 0;
let snakeAnimProgress = 0;
let snakeTargetIndex = 0;
let caminoPoints = [];

// ── Utilidad: seed determinista para decoración estática ──────────────────────
function seededRand(seed) {
    let s = seed;
    return function () {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

// ══════════════════════════════════════════════════════════════════════════════
//  DIBUJO POR BIOMA
// ══════════════════════════════════════════════════════════════════════════════

function drawBioma(bioma) {
    const startX = canvas.width * bioma.xStart;
    const endX   = canvas.width * bioma.xEnd;
    const w      = endX - startX;
    const h      = canvas.height;

    // Cielo en gradiente vertical
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0,   bioma.sky[0]);
    sky.addColorStop(0.5, bioma.sky[1]);
    sky.addColorStop(1,   bioma.sky[2]);
    ctx.fillStyle = sky;
    ctx.fillRect(startX, 0, w, h);

    // Detalles específicos
    switch (bioma.tipo) {
        case "forest":  drawForest(startX, w, h);  break;
        case "city":    drawCity(startX, w, h);    break;
        case "desert":  drawDesert(startX, w, h);  break;
        case "snow":    drawSnow(startX, w, h);    break;
        case "volcano": drawVolcano(startX, w, h); break;
    }

    // Línea divisoria sutil
    if (bioma.xStart > 0) {
        const grad = ctx.createLinearGradient(startX, 0, startX + 4, 0);
        grad.addColorStop(0, "rgba(255,213,79,0.5)");
        grad.addColorStop(1, "rgba(255,213,79,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(startX, 0, 4, h);
    }

    // Nombre del bioma (parte inferior de cada sección)
    ctx.save();
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "center";
    ctx.letterSpacing = "3px";
    ctx.fillText(bioma.nombre, startX + w / 2, h - 18);
    ctx.restore();
}

// ─── BOSQUE ───────────────────────────────────────────────────────────────────
function drawForest(sx, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, 0, w, h);
    ctx.clip();

    const rng = seededRand(42);

    // Luna/sol difuso
    ctx.save();
    const glow = ctx.createRadialGradient(sx + w * 0.65, h * 0.18, 0, sx + w * 0.65, h * 0.18, 80);
    glow.addColorStop(0, "rgba(200,255,160,0.18)");
    glow.addColorStop(1, "rgba(200,255,160,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(sx, 0, w, h * 0.5);
    ctx.restore();

    // Montañas traseras
    ctx.fillStyle = "#1a3d20";
    for (let i = 0; i < 4; i++) {
        const mx = sx + rng() * w;
        const mh = 80 + rng() * 100;
        ctx.beginPath();
        ctx.moveTo(mx - 50, h * 0.55);
        ctx.lineTo(mx, h * 0.55 - mh);
        ctx.lineTo(mx + 50, h * 0.55);
        ctx.fill();
    }

    // Niebla del bosque
    for (let i = 0; i < 3; i++) {
        const fog = ctx.createLinearGradient(sx, h * (0.45 + i * 0.07), sx, h * (0.55 + i * 0.07));
        fog.addColorStop(0, "rgba(80,120,60,0)");
        fog.addColorStop(0.5, "rgba(80,120,60,0.12)");
        fog.addColorStop(1, "rgba(80,120,60,0)");
        ctx.fillStyle = fog;
        ctx.fillRect(sx, h * (0.45 + i * 0.07), w, h * 0.1);
    }

    // Suelo con hierba en capas
    for (let layer = 0; layer < 3; layer++) {
        const yBase = h * (0.72 + layer * 0.09);
        const color = ["#2d5a20", "#3a6e28", "#4a8b3c"][layer];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(sx, h);
        ctx.lineTo(sx, yBase);
        for (let x = sx; x <= sx + w; x += 14) {
            const wave = Math.sin((x - sx) * 0.04 + layer) * 6;
            ctx.lineTo(x, yBase + wave);
        }
        ctx.lineTo(sx + w, h);
        ctx.fill();
    }

    // Árboles con detalle (tronco + capas de copa)
    const rng2 = seededRand(13);
    const treeCount = 9;
    for (let i = 0; i < treeCount; i++) {
        const tx = sx + (i / treeCount) * w + rng2() * (w / treeCount * 0.6);
        const ty = h * (0.68 - rng2() * 0.1);
        const th = 50 + rng2() * 50;
        const tw = 10 + rng2() * 8;

        // sombra del árbol
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.beginPath();
        ctx.ellipse(tx + 4, ty + th * 0.2 + 6, tw * 1.2, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // tronco
        const trunkGrad = ctx.createLinearGradient(tx - tw * 0.12, 0, tx + tw * 0.12, 0);
        trunkGrad.addColorStop(0, "#3e2c1c");
        trunkGrad.addColorStop(0.5, "#5d4037");
        trunkGrad.addColorStop(1, "#3e2c1c");
        ctx.fillStyle = trunkGrad;
        ctx.fillRect(tx - tw * 0.12, ty, tw * 0.24, th * 0.35);

        // capas de copa (3 triángulos escalonados)
        const foliageLayers = [
            { y: ty + th * 0.3, r: tw * 1.1, color: "#1b5e20" },
            { y: ty + th * 0.1, r: tw * 0.85, color: "#2e7d32" },
            { y: ty - th * 0.08, r: tw * 0.6, color: "#4caf50" },
        ];
        for (const fl of foliageLayers) {
            ctx.fillStyle = fl.color;
            ctx.beginPath();
            ctx.moveTo(tx - fl.r, fl.y);
            ctx.lineTo(tx, fl.y - fl.r * 1.2);
            ctx.lineTo(tx + fl.r, fl.y);
            ctx.closePath();
            ctx.fill();
            // borde luminoso
            ctx.strokeStyle = "rgba(100,200,80,0.18)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    // Luciérnagas animadas
    const time = Date.now() * 0.002;
    for (let i = 0; i < 18; i++) {
        const fx = sx + (Math.sin(time * 0.7 + i * 5.3) * 0.5 + 0.5) * w;
        const fy = h * 0.35 + (Math.cos(time * 0.5 + i * 2.7) * 0.5 + 0.5) * h * 0.3;
        const pulse = (Math.sin(time * 3 + i * 1.7) * 0.5 + 0.5);
        ctx.fillStyle = `rgba(180,255,100,${0.15 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.5 + pulse, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore(); // end clip
}

// ─── CIUDAD ───────────────────────────────────────────────────────────────────
function drawCity(sx, w, h) {
    const rng = seededRand(77);

    // Luna
    ctx.save();
    ctx.fillStyle = "#e8e0d0";
    ctx.beginPath();
    ctx.arc(sx + w * 0.7, h * 0.12, 16, 0, Math.PI * 2);
    ctx.fill();
    // halo
    const moonGlow = ctx.createRadialGradient(sx + w * 0.7, h * 0.12, 14, sx + w * 0.7, h * 0.12, 50);
    moonGlow.addColorStop(0, "rgba(220,210,180,0.2)");
    moonGlow.addColorStop(1, "rgba(220,210,180,0)");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(sx + w * 0.7, h * 0.12, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Estrellas
    const rngS = seededRand(200);
    for (let i = 0; i < 25; i++) {
        const starX = sx + rngS() * w;
        const starY = rngS() * h * 0.5;
        const twinkle = Math.abs(Math.sin(Date.now() * 0.002 + i));
        ctx.fillStyle = `rgba(220,220,255,${0.3 + twinkle * 0.5})`;
        ctx.beginPath();
        ctx.arc(starX, starY, 0.8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Niebla urbana baja
    const urbanFog = ctx.createLinearGradient(sx, h * 0.6, sx, h * 0.75);
    urbanFog.addColorStop(0, "rgba(80,100,130,0)");
    urbanFog.addColorStop(1, "rgba(80,100,130,0.2)");
    ctx.fillStyle = urbanFog;
    ctx.fillRect(sx, h * 0.6, w, h * 0.4);

    // Suelo asfaltado
    ctx.fillStyle = "#1a1a28";
    ctx.fillRect(sx, h * 0.82, w, h * 0.18);
    // líneas de calle
    ctx.strokeStyle = "rgba(255,220,80,0.3)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(sx, h * 0.88);
    ctx.lineTo(sx + w, h * 0.88);
    ctx.stroke();
    ctx.setLineDash([]);

    // Edificios (fondo → frente, más oscuros atrás)
    const buildingData = seededRand(55);
    const cols = 7;
    for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < cols; i++) {
            const bx = sx + (i / cols) * w + buildingData() * (w / cols * 0.3);
            const bh = (pass === 0 ? 80 : 50) + buildingData() * 130;
            const bw = w / cols * (0.55 + buildingData() * 0.3);
            const by = h * 0.82 - bh;

            const bGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
            if (pass === 0) {
                bGrad.addColorStop(0, "#1a1f2e");
                bGrad.addColorStop(1, "#252b3a");
            } else {
                bGrad.addColorStop(0, "#2d3347");
                bGrad.addColorStop(1, "#3a4060");
            }
            ctx.fillStyle = bGrad;
            ctx.fillRect(bx, by, bw, bh);

            // Borde lateral iluminado
            ctx.fillStyle = pass === 0 ? "rgba(100,120,180,0.08)" : "rgba(100,120,200,0.15)";
            ctx.fillRect(bx, by, 2, bh);

            // Ventanas
            const wRng = seededRand(i * 17 + pass * 100);
            const winCols = Math.floor(bw / 9);
            const winRows = Math.floor(bh / 12);
            for (let wr = 0; wr < winRows; wr++) {
                for (let wc = 0; wc < winCols; wc++) {
                    if (wRng() > 0.45) {
                        const wx = bx + 4 + wc * 9;
                        const wy = by + 5 + wr * 12;
                        const lit = wRng() > 0.3;
                        ctx.fillStyle = lit ? `rgba(255,235,150,${0.5 + wRng() * 0.4})` : "rgba(40,50,80,0.8)";
                        ctx.fillRect(wx, wy, 4, 5);
                    }
                }
            }

            // Antena en edificios altos
            if (bh > 120) {
                ctx.strokeStyle = "rgba(180,180,220,0.5)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(bx + bw / 2, by);
                ctx.lineTo(bx + bw / 2, by - 18);
                ctx.stroke();
                // luz roja parpadeante
                const blink = Math.sin(Date.now() * 0.003 + i) > 0;
                if (blink) {
                    ctx.fillStyle = "rgba(255,60,60,0.8)";
                    ctx.beginPath();
                    ctx.arc(bx + bw / 2, by - 20, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    // Farolas
    for (let i = 0; i < 3; i++) {
        const lx = sx + (i + 0.5) * (w / 3);
        const ly = h * 0.75;
        ctx.strokeStyle = "#90a0b0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, h * 0.82);
        ctx.lineTo(lx, ly);
        ctx.lineTo(lx + 12, ly - 5);
        ctx.stroke();
        const lampGlow = ctx.createRadialGradient(lx + 12, ly - 5, 0, lx + 12, ly - 5, 30);
        lampGlow.addColorStop(0, "rgba(255,230,120,0.4)");
        lampGlow.addColorStop(1, "rgba(255,230,120,0)");
        ctx.fillStyle = lampGlow;
        ctx.beginPath();
        ctx.arc(lx + 12, ly - 5, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ─── DESIERTO ─────────────────────────────────────────────────────────────────
function drawDesert(sx, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, 0, w, h);
    ctx.clip();

    // Sol en el horizonte
    const sunX = sx + w * 0.6;
    const sunY = h * 0.38;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 90);
    sunGlow.addColorStop(0, "rgba(255,200,60,0.8)");
    sunGlow.addColorStop(0.3, "rgba(255,140,20,0.4)");
    sunGlow.addColorStop(1, "rgba(255,80,0,0)");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffe060";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
    ctx.fill();

    // Capas de horizonte / calima
    const hazeColors = [
        ["rgba(200,100,30,0.3)", "rgba(200,100,30,0)"],
        ["rgba(180,80,10,0.2)", "rgba(180,80,10,0)"],
    ];
    for (let i = 0; i < hazeColors.length; i++) {
        const haze = ctx.createLinearGradient(sx, h * (0.45 + i * 0.1), sx, h * (0.55 + i * 0.1));
        haze.addColorStop(0, hazeColors[i][0]);
        haze.addColorStop(1, hazeColors[i][1]);
        ctx.fillStyle = haze;
        ctx.fillRect(sx, h * (0.45 + i * 0.1), w, h * 0.1);
    }

    // Dunas en capas
    const duneColors = ["#c2904a", "#c2a46b", "#d4b87a", "#e8cfa0"];
    for (let d = 0; d < 4; d++) {
        const yBase = h * (0.55 + d * 0.11);
        ctx.fillStyle = duneColors[d];
        ctx.beginPath();
        ctx.moveTo(sx, h);
        ctx.lineTo(sx, yBase + 20);
        const rng = seededRand(d * 31 + 7);
        let px = sx;
        while (px < sx + w) {
            const dw = 30 + rng() * 60;
            const dh = 20 + rng() * 35;
            ctx.quadraticCurveTo(px + dw / 2, yBase - dh, px + dw, yBase + rng() * 15);
            px += dw;
        }
        ctx.lineTo(sx + w, h);
        ctx.closePath();
        ctx.fill();
        // cresta iluminada
        ctx.strokeStyle = `rgba(255,220,140,${0.15 + d * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Cactos (dibujo geométrico limpio)
    const rngC = seededRand(99);
    for (let i = 0; i < 5; i++) {
        const cx = sx + (i / 5) * w + rngC() * (w / 5 * 0.7);
        const cy = h * (0.58 + rngC() * 0.08);
        const ch = 35 + rngC() * 35;
        const cw = 5 + rngC() * 4;
        drawCactus(cx, cy, ch, cw);
    }

    // Ondas de calor (shimmer)
    const time = Date.now() * 0.001;
    for (let i = 0; i < 4; i++) {
        const heatY = h * (0.6 + i * 0.06);
        ctx.strokeStyle = `rgba(255,180,80,${0.06 + Math.sin(time * 2 + i) * 0.03})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = sx; x < sx + w; x += 4) {
            const wave = Math.sin(x * 0.05 + time * 3 + i) * 2;
            if (x === sx) ctx.moveTo(x, heatY + wave);
            else ctx.lineTo(x, heatY + wave);
        }
               ctx.stroke();
    }
    ctx.restore(); // end clip
}

function drawCactus(cx, cy, ch, cw) {
    ctx.fillStyle = "#4a7a3a";

    // tronco
    ctx.beginPath();
    ctx.roundRect(cx - cw / 2, cy - ch, cw, ch, 3);
    ctx.fill();
    ctx.strokeStyle = "rgba(80,130,60,0.5)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // brazo izquierdo
    ctx.beginPath();
    ctx.roundRect(cx - cw * 2.5, cy - ch * 0.55, cw * 0.8, ch * 0.35, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx - cw * 2.5, cy - ch * 0.55 - cw * 0.7, cw * 0.8, ch * 0.2, 3);
    ctx.fill();

    // brazo derecho
    ctx.beginPath();
    ctx.roundRect(cx + cw * 1.7, cy - ch * 0.45, cw * 0.8, ch * 0.28, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx + cw * 1.7 + cw * 0.8 - cw * 0.8, cy - ch * 0.45 - cw * 0.6, cw * 0.8, ch * 0.18, 3);
    ctx.fill();

    // espinas (líneas cortas)
    ctx.strokeStyle = "rgba(200,220,150,0.6)";
    ctx.lineWidth = 0.7;
    for (let s = 0; s < 5; s++) {
        const sy = cy - (s / 5) * ch;
        ctx.beginPath();
        ctx.moveTo(cx - cw / 2, sy);
        ctx.lineTo(cx - cw / 2 - 4, sy - 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + cw / 2, sy);
        ctx.lineTo(cx + cw / 2 + 4, sy - 3);
        ctx.stroke();
    }
}

// ─── NEVADO ───────────────────────────────────────────────────────────────────
function drawSnow(sx, w, h) {
    // Clip to this biome's column so mountains never overflow into neighbours
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, 0, w, h);
    ctx.clip();

    // Aurora boreal
    const time = Date.now() * 0.0008;
    for (let i = 0; i < 3; i++) {
        const auroraX = sx + (Math.sin(time + i * 2.1) * 0.3 + 0.5) * w;
        const aurora = ctx.createLinearGradient(auroraX - 40, 0, auroraX + 40, h * 0.5);
        const colors = [
            ["rgba(0,230,120,0)", "rgba(0,230,120,0.12)", "rgba(0,180,220,0.08)", "rgba(0,230,120,0)"],
            ["rgba(100,0,220,0)", "rgba(100,0,220,0.1)", "rgba(0,180,255,0.08)", "rgba(100,0,220,0)"],
            ["rgba(0,200,180,0)", "rgba(0,200,180,0.12)", "rgba(0,100,220,0.06)", "rgba(0,200,180,0)"],
        ][i];
        colors.forEach((c, idx) => aurora.addColorStop(idx / (colors.length - 1), c));
        ctx.fillStyle = aurora;
        ctx.fillRect(sx, 0, w, h * 0.55);
    }

    // Estrellas frías
    const rngSt = seededRand(88);
    for (let i = 0; i < 30; i++) {
        const sx2 = sx + rngSt() * w;
        const sy  = rngSt() * h * 0.45;
        const tw  = Math.abs(Math.sin(Date.now() * 0.002 + i * 0.7));
        ctx.fillStyle = `rgba(200,230,255,${0.3 + tw * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx2, sy, 0.9, 0, Math.PI * 2);
        ctx.fill();
    }

    // Montañas nevadas en el fondo
    const rng = seededRand(33);
    for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < 4; i++) {
            const mx = sx + (i / 3.5) * w + rng() * 10 - 5;
            const mh = (pass === 0 ? 80 : 110) + rng() * 60;
            const mw = 55 + rng() * 30;

            // cuerpo de la montaña
            ctx.fillStyle = pass === 0 ? "#1a2a3a" : "#263545";
            ctx.beginPath();
            ctx.moveTo(mx - mw, h * 0.68);
            ctx.lineTo(mx, h * 0.68 - mh);
            ctx.lineTo(mx + mw, h * 0.68);
            ctx.closePath();
            ctx.fill();

            // nieve en la cima
            ctx.fillStyle = pass === 0 ? "#c8dce8" : "#e0ecf4";
            ctx.beginPath();
            ctx.moveTo(mx - mw * 0.35, h * 0.68 - mh * 0.6);
            ctx.lineTo(mx, h * 0.68 - mh);
            ctx.lineTo(mx + mw * 0.35, h * 0.68 - mh * 0.6);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Suelo nevado con ondas
    const snowGrad = ctx.createLinearGradient(sx, h * 0.72, sx, h);
    snowGrad.addColorStop(0, "#c8dce8");
    snowGrad.addColorStop(0.3, "#dce8f4");
    snowGrad.addColorStop(1, "#e8f4fc");
    ctx.fillStyle = snowGrad;
    ctx.beginPath();
    ctx.moveTo(sx, h);
    ctx.lineTo(sx, h * 0.78);
    for (let x = sx; x <= sx + w; x += 10) {
        const sn = Math.sin((x - sx) * 0.04) * 8 + Math.sin((x - sx) * 0.09) * 4;
        ctx.lineTo(x, h * 0.78 + sn);
    }
    ctx.lineTo(sx + w, h);
    ctx.closePath();
    ctx.fill();

    // Árboles nevados (pinos)
    const rng2 = seededRand(61);
    for (let i = 0; i < 7; i++) {
        const tx = sx + (i / 7) * w + rng2() * (w / 7 * 0.5);
        const ty = h * (0.7 - rng2() * 0.06);
        const th = 30 + rng2() * 35;
        drawPine(tx, ty, th);
    }

    // Copos de nieve cayendo
    const rngF = seededRand(11);
    const t2 = Date.now() * 0.0005;
    for (let i = 0; i < 30; i++) {
        const fx = sx + (rngF() * w + Math.sin(t2 * 0.8 + i) * 12) % w;
        const fy = ((t2 * 25 + rngF() * h + i * 37) % h);
        ctx.fillStyle = `rgba(220,240,255,${0.4 + rngF() * 0.4})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.2 + rngF() * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore(); // end clip
}

function drawPine(cx, cy, th) {
    // tronco
    ctx.fillStyle = "#4a3020";
    ctx.fillRect(cx - 2, cy, 4, th * 0.25);

    // capas de ramas (abajo a arriba, más anchas abajo)
    const layers = 4;
    for (let l = 0; l < layers; l++) {
        const ly = cy - (l / layers) * th * 0.85;
        const lw = (th * 0.4) * (1 - l / layers * 0.5);
        ctx.fillStyle = l % 2 === 0 ? "#1a4a2e" : "#2e6a40";
        ctx.beginPath();
        ctx.moveTo(cx - lw, ly);
        ctx.lineTo(cx, ly - th / layers * 1.1);
        ctx.lineTo(cx + lw, ly);
        ctx.closePath();
        ctx.fill();
        // nieve en la capa
        ctx.fillStyle = "rgba(220,240,255,0.55)";
        ctx.beginPath();
        ctx.moveTo(cx - lw * 0.5, ly);
        ctx.lineTo(cx, ly - th / layers * 0.6);
        ctx.lineTo(cx + lw * 0.5, ly);
        ctx.closePath();
        ctx.fill();
    }
}

// ─── VOLCÁN ───────────────────────────────────────────────────────────────────
function drawVolcano(sx, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, 0, w, h);
    ctx.clip();

    const time = Date.now() * 0.001;
    const vx = sx + w * 0.5;

    // Cielo con resplandor de magma
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#1a0a00");
    sky.addColorStop(0.5, "#3a1200");
    sky.addColorStop(1, "#6a2800");
    ctx.fillStyle = sky;
    ctx.fillRect(sx, 0, w, h);

    // Resplandor del cráter en el cielo
    const emberGlow = ctx.createRadialGradient(vx, h * 0.22, 0, vx, h * 0.22, 120);
    emberGlow.addColorStop(0, "rgba(255,100,0,0.3)");
    emberGlow.addColorStop(0.4, "rgba(200,40,0,0.15)");
    emberGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = emberGlow;
    ctx.fillRect(sx, 0, w, h * 0.5);

    // Columna de humo
    for (let s = 0; s < 8; s++) {
        const smokeX = vx + Math.sin(time * 0.5 + s * 1.3) * (s * 5);
        const smokeY = h * 0.16 - s * 22;
        const smokeR = 12 + s * 8;
        const alpha = 0.12 - s * 0.012;
        ctx.fillStyle = `rgba(80,60,50,${alpha})`;
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, smokeR, 0, Math.PI * 2);
        ctx.fill();
    }

    // ── Forma cónica del volcán (igual que el mini) ──
    const vPeak = h * 0.22;
    const vBase = h * 0.78;
    const slopeW = w * 0.15; // ancho de la cima

    // Cuerpo principal del volcán con gradiente
    const volGrad = ctx.createLinearGradient(sx, 0, sx + w, 0);
    volGrad.addColorStop(0, "#1a0a00");
    volGrad.addColorStop(0.3, "#2a1000");
    volGrad.addColorStop(0.5, "#3a1800");
    volGrad.addColorStop(0.7, "#2a1000");
    volGrad.addColorStop(1, "#1a0a00");
    ctx.fillStyle = volGrad;
    ctx.beginPath();
    ctx.moveTo(sx, h);
    ctx.lineTo(sx, vBase);
    ctx.lineTo(vx - slopeW, vPeak + 10);
    ctx.lineTo(vx + slopeW, vPeak + 10);
    ctx.lineTo(sx + w, vBase);
    ctx.lineTo(sx + w, h);
    ctx.closePath();
    ctx.fill();

    // Sombreado lateral izquierdo (luz desde la lava)
    const leftShade = ctx.createLinearGradient(sx, 0, vx, 0);
    leftShade.addColorStop(0, "rgba(0,0,0,0.3)");
    leftShade.addColorStop(0.7, "rgba(255,80,0,0.05)");
    leftShade.addColorStop(1, "rgba(255,80,0,0.12)");
    ctx.fillStyle = leftShade;
    ctx.beginPath();
    ctx.moveTo(sx, h);
    ctx.lineTo(sx, vBase);
    ctx.lineTo(vx - slopeW, vPeak + 10);
    ctx.lineTo(vx, vPeak + 10);
    ctx.lineTo(vx, vBase);
    ctx.lineTo(sx, h);
    ctx.fill();

    // Sombreado lateral derecho (más oscuro)
    const rightShade = ctx.createLinearGradient(vx, 0, sx + w, 0);
    rightShade.addColorStop(0, "rgba(255,80,0,0.08)");
    rightShade.addColorStop(0.3, "rgba(0,0,0,0)");
    rightShade.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.fillStyle = rightShade;
    ctx.beginPath();
    ctx.moveTo(vx, vPeak + 10);
    ctx.lineTo(vx + slopeW, vPeak + 10);
    ctx.lineTo(sx + w, vBase);
    ctx.lineTo(sx + w, h);
    ctx.lineTo(vx, vBase);
    ctx.closePath();
    ctx.fill();

    // ── Flujos de lava en las laderas ──
    for (let f = 0; f < 3; f++) {
        const fxStart = vx + (f - 1) * 18;
        const lavaGrad = ctx.createLinearGradient(fxStart, vPeak, fxStart, vBase);
        lavaGrad.addColorStop(0, "rgba(255,150,0,0.8)");
        lavaGrad.addColorStop(0.2, "rgba(255,80,0,0.6)");
        lavaGrad.addColorStop(0.5, "rgba(200,30,0,0.3)");
        lavaGrad.addColorStop(1, "rgba(100,10,0,0)");
        ctx.strokeStyle = lavaGrad;
        ctx.lineWidth = 3.5 - f * 0.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(fxStart, vPeak + 12);
        for (let y = vPeak + 12; y < vBase; y += 10) {
            const xOff = Math.sin(y * 0.03 + f * 2.1 + time) * 6;
            ctx.lineTo(fxStart + xOff, y);
        }
        ctx.stroke();
    }

    // ── Cráter con lava (mismo estilo que el mini) ──
    // Resplandor del cráter
    const craterGlow = ctx.createRadialGradient(vx, vPeak + 8, 0, vx, vPeak + 8, 35);
    craterGlow.addColorStop(0, "rgba(255,200,50,0.35)");
    craterGlow.addColorStop(0.5, "rgba(255,100,0,0.15)");
    craterGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = craterGlow;
    ctx.beginPath();
    ctx.arc(vx, vPeak + 8, 35, 0, Math.PI * 2);
    ctx.fill();

    // Cráter exterior
    ctx.fillStyle = "#cc3300";
    ctx.beginPath();
    ctx.ellipse(vx, vPeak + 10, w * 0.08, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cráter medio
    ctx.fillStyle = "#ff6000";
    ctx.beginPath();
    ctx.ellipse(vx, vPeak + 8, w * 0.06, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cráter interior brillante
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.ellipse(vx, vPeak + 7, w * 0.03, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Suelo de roca volcánica ──
    const rockGrad = ctx.createLinearGradient(sx, vBase, sx, h);
    rockGrad.addColorStop(0, "#2a0e00");
    rockGrad.addColorStop(0.3, "#1f0a00");
    rockGrad.addColorStop(1, "#1a0a00");
    ctx.fillStyle = rockGrad;
    ctx.fillRect(sx, vBase, w, h - vBase);

    // Línea de transición suelo-volcán
    ctx.strokeStyle = "rgba(60,20,0,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, vBase);
    ctx.lineTo(sx + w, vBase);
    ctx.stroke();

    // Grietas con lava en el suelo
    for (let c = 0; c < 6; c++) {
        const cx2 = sx + (c / 6) * w + 10;
        const crackGrad = ctx.createLinearGradient(cx2, vBase, cx2, vBase + h * 0.08);
        crackGrad.addColorStop(0, "rgba(255,100,0,0.6)");
        crackGrad.addColorStop(1, "rgba(255,100,0,0)");
        ctx.strokeStyle = crackGrad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx2, vBase);
        // Grieta con ramificaciones
        const endX = cx2 + Math.sin(c * 1.7) * 12;
        const endY = vBase + h * 0.08;
        ctx.lineTo(endX, endY);
        // Ramificación
        if (c % 2 === 0) {
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + 6, endY + 4);
        }
        ctx.stroke();
    }

    // ── Brasas volando ──
    const rng = seededRand(22);
    for (let i = 0; i < 25; i++) {
        const ex = sx + (Math.sin(time * 2 + i * 5.3) * 0.4 + 0.5) * w;
        const ey = ((time * 25 + rng() * h * 0.5 + i * 35) % (h * 0.6)) + h * 0.05;
        const ep = Math.abs(Math.sin(time * 4 + i));
        const size = 0.8 + ep * 0.8;
        ctx.fillStyle = `rgba(255,${80 + ep * 120},0,${0.3 + ep * 0.5})`;
        ctx.beginPath();
        ctx.arc(ex, ey, size, 0, Math.PI * 2);
        ctx.fill();
        // Resplandor de la brasa
        if (ep > 0.7) {
            const sparkGlow = ctx.createRadialGradient(ex, ey, 0, ex, ey, size * 3);
            sparkGlow.addColorStop(0, `rgba(255,150,0,${ep * 0.15})`);
            sparkGlow.addColorStop(1, "rgba(255,150,0,0)");
            ctx.fillStyle = sparkGlow;
            ctx.beginPath();
            ctx.arc(ex, ey, size * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore(); // end clip
}

// ══════════════════════════════════════════════════════════════════════════════
//  CAMINO SINUOSO
// ══════════════════════════════════════════════════════════════════════════════

function getGroundY(x) {
    const h = canvas.height;
    const w = canvas.width;
    const baseY = h * 0.80;
    const wave1 = Math.sin(x * 0.008) * 18;
    const wave2 = Math.sin(x * 0.018 + 1.2) * 10;
    const wave3 = Math.sin(x * 0.035 + 2.5) * 5;
    return baseY + wave1 + wave2 + wave3;

    if (t < 0.2) {
        // Bosque: hierba ondulada, primera capa en h*0.72
        const lx = x - w * 0;
        return h * 0.76 + Math.sin(lx * 0.04) * 5 + Math.sin(lx * 0.025 + 1) * 3;
    }
    if (t < 0.4) {
        // Ciudad: asfalto plano en h*0.82
        return h * 0.82;
    }
    if (t < 0.6) {
        // Desierto: cima de la duna frontal (d=3, yBase = h*0.88)
        // Reproducimos la misma fórmula de drawDesert para la duna más alta visible
        const lx = x;
        const rng = seededRand(3 * 31 + 7);
        let px = w * 0.4;
        let prevY = h * 0.88;
        while (px < x) {
            const dw = 30 + rng() * 60;
            const dh = 20 + rng() * 35;
            const nextY = h * 0.88 + rng() * 15;
            if (px + dw >= x) {
                const frac = (x - px) / dw;
                // quadratic bezier midpoint approximation
                const mid = h * 0.88 - dh;
                return (1 - frac) * (1 - frac) * prevY + 2 * (1 - frac) * frac * mid + frac * frac * nextY;
            }
            prevY = nextY;
            px += dw;
        }
        return h * 0.88;
    }
    if (t < 0.8) {
        // Nevado: superficie nevada ondulada en h*0.78
        const lx = x - w * 0.6;
        return h * 0.78 + Math.sin(lx * 0.04) * 8 + Math.sin(lx * 0.09) * 4;
    }
    // Volcán: suelo rocoso plano en h*0.82
    return h * 0.82;
}

function initCamino() {
    caminoPoints = [];
    const segments = 120; // more points = smoother ground-following
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = canvas.width * t;
        const y = getGroundY(x);
        caminoPoints.push({ x, y });
    }
}

// Returns a subtle camouflaged trail colour for each biome
function getCamoStyle(x) {
    const t = x / canvas.width;
    // Each biome: a faint darkened version of its own ground, barely visible
    if (t < 0.2) return { shadow: "rgba(0,0,0,0)",        track: "rgba(30,60,15,0.28)",   mark: "rgba(80,150,40,0.13)"  }; // bosque: tierra oscura
    if (t < 0.4) return { shadow: "rgba(0,0,0,0)",        track: "rgba(15,15,30,0.35)",   mark: "rgba(60,80,140,0.10)"  }; // ciudad: asfalto
    if (t < 0.6) return { shadow: "rgba(0,0,0,0)",        track: "rgba(140,90,30,0.30)",  mark: "rgba(200,160,80,0.12)" }; // desierto: arena
    if (t < 0.8) return { shadow: "rgba(0,0,0,0)",        track: "rgba(160,200,220,0.28).",mark: "rgba(220,240,255,0.14)"}; // nevado: nieve pisada
    return             { shadow: "rgba(0,0,0,0)",        track: "rgba(10,5,0,0.40)",     mark: "rgba(80,20,0,0.12)"   }; // volcán: roca
}

function drawCamino() {
    if (caminoPoints.length < 2) return;
    ctx.save();

    for (let i = 0; i < caminoPoints.length - 1; i++) {
        const p1 = caminoPoints[i];
        const p2 = caminoPoints[i + 1];
        const mx = (p1.x + p2.x) / 2;
        const t  = mx / canvas.width;

        // Color y textura según bioma, completamente camuflado
        if (t < 0.2) {
            // Bosque: tierra pisada entre hierba
            ctx.lineWidth = 11;
            ctx.strokeStyle = "rgba(62, 44, 28, 0.55)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(90, 60, 30, 0.35)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y + 2); ctx.lineTo(p2.x, p2.y + 2); ctx.stroke();
            // bordes de hierba
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(60, 110, 40, 0.5)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y - 5); ctx.lineTo(p2.x, p2.y - 5); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y + 6); ctx.lineTo(p2.x, p2.y + 6); ctx.stroke();

        } else if (t < 0.4) {
            // Ciudad: acera de cemento con línea de bordillo
            ctx.lineWidth = 13;
            ctx.strokeStyle = "rgba(50, 55, 75, 0.6)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(120, 130, 160, 0.4)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y - 6); ctx.lineTo(p2.x, p2.y - 6); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y + 6); ctx.lineTo(p2.x, p2.y + 6); ctx.stroke();
            // líneas de losetas cada ~20px
            if (Math.floor(p1.x / 20) !== Math.floor(p2.x / 20)) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(160, 170, 200, 0.2)";
                ctx.beginPath();
                const lx = Math.floor(p2.x / 20) * 20;
                ctx.moveTo(lx, p1.y - 6); ctx.lineTo(lx, p1.y + 7); ctx.stroke();
            }

        } else if (t < 0.6) {
            // Desierto: arena compactada con huellas
            ctx.lineWidth = 14;
            ctx.strokeStyle = "rgba(160, 110, 50, 0.45)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            ctx.lineWidth = 6;
            ctx.strokeStyle = "rgba(190, 145, 80, 0.3)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y - 2); ctx.lineTo(p2.x, p2.y - 2); ctx.stroke();
            // sombra inferior (profundidad duna)
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgba(100, 65, 20, 0.25)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y + 7); ctx.lineTo(p2.x, p2.y + 7); ctx.stroke();

        } else if (t < 0.8) {
            // Nevado: nieve pisada con bordes azulados
            ctx.lineWidth = 13;
            ctx.strokeStyle = "rgba(190, 215, 235, 0.55)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(220, 240, 255, 0.4)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y - 3); ctx.lineTo(p2.x, p2.y - 3); ctx.stroke();
            // sombra azul del surco en nieve
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(100, 150, 200, 0.25)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y + 7); ctx.lineTo(p2.x, p2.y + 7); ctx.stroke();

        } else {
            // Volcán: roca oscura con grietas de lava
            ctx.lineWidth = 13;
            ctx.strokeStyle = "rgba(20, 8, 0, 0.65)";
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            ctx.lineWidth = 3;
            ctx.strokeStyle = `rgba(180, 60, 0, ${0.15 + Math.sin(p1.x * 0.1) * 0.08})`;
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y + 4); ctx.lineTo(p2.x, p2.y + 4); ctx.stroke();
        }
    }

    ctx.lineJoin = "round";
    ctx.lineCap  = "round";
    ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════════
//  SERPIENTE VIAJERA ANIMADA
// ══════════════════════════════════════════════════════════════════════════════

function updateSerpienteAnimada(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    snakeAnimProgress += delta * 0.06; // velocidad de recorrido
    if (snakeAnimProgress >= 1) snakeAnimProgress -= 1;
}

// Obtiene posición + ángulo en el camino para un t ∈ [0,1]
function getPosOnPath(t) {
    if (!caminoPoints || caminoPoints.length < 2) return { x: 0, y: 0, angle: 0 };
    const totalSeg = caminoPoints.length - 1;
    const raw = Math.max(0, Math.min(t, 0.9999)) * totalSeg;
    const idx = Math.min(Math.floor(raw), totalSeg - 1);
    const frac = raw - idx;
    const p1 = caminoPoints[idx];
    const p2 = caminoPoints[Math.min(idx + 1, totalSeg)];
    if (!p1 || !p2) return { x: 0, y: 0, angle: 0 };
    return {
        x: p1.x + (p2.x - p1.x) * frac,
        y: p1.y + (p2.y - p1.y) * frac,
        angle: Math.atan2(p2.y - p1.y, p2.x - p1.x)
    };
}

function drawSerpienteViajera() {
    if (caminoPoints.length < 2) return;

    const BODY_SEGS  = 18;   // segmentos del cuerpo
    const SEG_GAP    = 0.008; // separación entre segmentos en t

    // Calcula posiciones de cada segmento (cabeza primero)
    const segments = [];
    for (let i = 0; i < BODY_SEGS + 1; i++) {
        const t = ((snakeAnimProgress - i * SEG_GAP) + 2) % 1;
        segments.push(getPosOnPath(t));
    }

    const head = segments[0];
    const time = Date.now() * 0.008;

    ctx.save();

    // Cuerpo (de la cola a la cabeza para que la cabeza quede encima)
    for (let i = BODY_SEGS; i >= 1; i--) {
        const seg  = segments[i];
        const next = segments[i - 1];
        const seg_angle = Math.atan2(next.y - seg.y, next.x - seg.x);

        const radius = 6 + (BODY_SEGS - i) * 0.3; // aumenta hacia la cabeza
        const colorEven = "#2e7d32";
        const colorOdd  = "#4caf50";
        const isEven = i % 2 === 0;

        ctx.save();
        ctx.shadowBlur  = 6;
        ctx.shadowColor = "rgba(76,175,80,0.4)";

        ctx.fillStyle = isEven ? colorEven : colorOdd;
        ctx.beginPath();
        ctx.ellipse(seg.x, seg.y, radius * 1.1, radius * 0.85, seg_angle, 0, Math.PI * 2);
        ctx.fill();

        // Línea de escamas en la panza
        ctx.fillStyle = "rgba(200,240,180,0.2)";
        ctx.beginPath();
        ctx.ellipse(seg.x, seg.y, radius * 0.5, radius * 0.35, seg_angle, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // Cola puntiaguda
    const tailSeg  = segments[BODY_SEGS];
    const tailPrev = segments[BODY_SEGS - 1];
    const tailAngle = Math.atan2(tailPrev.y - tailSeg.y, tailPrev.x - tailSeg.x) + Math.PI;
    ctx.save();
    ctx.translate(tailSeg.x, tailSeg.y);
    ctx.rotate(tailAngle);
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(12, 0);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Cabeza
    const headAngle = head.angle;
    ctx.save();
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "#FFD54F";
    ctx.translate(head.x, head.y);
    ctx.rotate(headAngle);

    // cuerpo de la cabeza
    ctx.fillStyle = "#66bb6a";
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // hocico
    ctx.fillStyle = "#81c784";
    ctx.beginPath();
    ctx.ellipse(8, 0, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // ojos
    const eyeY1 = -3.5, eyeY2 = 3.5;
    [eyeY1, eyeY2].forEach(ey => {
        ctx.fillStyle = "#fff9c4";
        ctx.beginPath();
        ctx.arc(4, ey, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(4.8, ey, 1.1, 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(5.3, ey - 0.8, 0.5, 0, Math.PI * 2);
        ctx.fill();
    });

    // lengua (intermitente)
    if (Math.sin(time * 0.7) > 0.6) {
        ctx.strokeStyle = "#ff5252";
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = "round";
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(18, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(21, -3);
        ctx.moveTo(18, 0);
        ctx.lineTo(21,  3);
        ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.restore(); // head

    ctx.restore(); // global
}

// ══════════════════════════════════════════════════════════════════════════════
//  FONDO COMPLETO DEL MENÚ
// ══════════════════════════════════════════════════════════════════════════════

function drawMenuBackground() {
    // Dibuja los 5 biomas
    for (const bioma of biomas) {
        drawBioma(bioma);
    }

    // Inicializar camino si no existe (canvas debe estar listo)
    if (caminoPoints.length === 0 && canvas && canvas.width > 0) {
    initCamino();
    snakeAnimProgress = 0.05;
    }
    // Camino
    drawCamino();

    // Serpiente viajera
    drawSerpienteViajera();

    // Overlay superior para legibilidad del título
    const topOverlay = ctx.createLinearGradient(0, 0, 0, 150);
    topOverlay.addColorStop(0, "rgba(0,0,0,0.68)");
    topOverlay.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = topOverlay;
    ctx.fillRect(0, 0, canvas.width, 150);

    // Overlay inferior para legibilidad de instrucciones
    const botOverlay = ctx.createLinearGradient(0, canvas.height - 90, 0, canvas.height);
    botOverlay.addColorStop(0, "rgba(0,0,0,0)");
    botOverlay.addColorStop(1, "rgba(0,0,0,0.65)");
    ctx.fillStyle = botOverlay;
    ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
}

// ══════════════════════════════════════════════════════════════════════════════
//  SELECCIÓN DE NIVELES
// ══════════════════════════════════════════════════════════════════════════════

// Estado de la pantalla de selección de niveles
let selectedLevel = 0;        // nivel resaltado (0-4)
let showingLevelSelect = false;

// Definición de los 5 niveles
const nivelesData = [
    {
        nombre: "BOSQUE",
        icono: "BOS",
        descripcion: "Bosque encantado lleno de vida",
        color: "#4CAF50",
        colorOscuro: "#1b5e20",
        colorBorde: "#A5D6A7",
        bioma: "forest",
        nivel: 1,
        requiere: 0
    },
    {
        nombre: "CIUDAD",
        icono: "CIU",
        descripcion: "Calles nocturnas y neón",
        color: "#78909C",
        colorOscuro: "#1a1a2e",
        colorBorde: "#90A4AE",
        bioma: "city",
        nivel: 2,
        requiere: 0
    },
    {
        nombre: "DESIERTO",
        icono: "DES",
        descripcion: "Dunas ardientes bajo el sol",
        color: "#F4A460",
        colorOscuro: "#7a3a10",
        colorBorde: "#FFCC80",
        bioma: "desert",
        nivel: 3,
        requiere: 0
    },
    {
        nombre: "NIEVE",
        icono: "NIE",
        descripcion: "Tundra helada y ventiscas",
        color: "#81D4FA",
        colorOscuro: "#1a2a4a",
        colorBorde: "#B3E5FC",
        bioma: "snow",
        nivel: 4,
        requiere: 0
    },
    {
        nombre: "VOLCÁNICO",
        icono: "VOL",
        descripcion: "Campos de lava y brasas",
        color: "#FF5722",
        colorOscuro: "#1a0a00",
        colorBorde: "#FF8A65",
        bioma: "volcano",
        nivel: 5,
        requiere: 10   // necesita 10 estrellas para desbloquear
    }
];

// Obtiene el total de estrellas guardadas (de localStorage si existe, si no 0)
function getTotalEstrellas() {
    try {
        const data = JSON.parse(localStorage.getItem('snakeForestStars') || '{}');
        return Object.values(data).reduce((sum, v) => sum + (v || 0), 0);
    } catch (e) { return 0; }
}

// Obtiene las estrellas de un nivel específico (0-3)
function getEstrellasNivel(nivelNum) {
    try {
        const data = JSON.parse(localStorage.getItem('snakeForestStars') || '{}');
        return data['nivel_' + nivelNum] || 0;
    } catch (e) { return 0; }
}

// Dibuja estrellas (rellenas o vacías)
function drawEstrellas(cx, cy, cantidad, maximo, size) {
    for (let i = 0; i < maximo; i++) {
        const sx = cx - ((maximo - 1) * (size + 4)) / 2 + i * (size + 4);
        ctx.font = `${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = i < cantidad ? '#FFD54F' : 'rgba(255,255,255,0.2)';
        ctx.fillText('*', sx, cy);
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  MINI BIOMAS PARA TARJETAS
// ══════════════════════════════════════════════════════════════════════════════

function drawMiniBioma(cardX, cardY, cardW, cardH, tipo) {
    const mx = cardX + 4, my = cardY + 4;
    const mw = cardW - 8, mh = cardH * 0.48;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 10);
    ctx.clip();

    switch (tipo) {
        case "forest":  drawMiniForest(mx, my, mw, mh);  break;
        case "city":    drawMiniCity(mx, my, mw, mh);    break;
        case "desert":  drawMiniDesert(mx, my, mw, mh);  break;
        case "snow":    drawMiniSnow(mx, my, mw, mh);    break;
        case "volcano": drawMiniVolcano(mx, my, mw, mh); break;
    }
    ctx.restore();

    // Borde sutil del mini mapa
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 10);
    ctx.stroke();
}

// ─── BOSQUE MINI ────────────────────────────────────────────────────────────
function drawMiniForest(x, y, w, h) {
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#0d2b1a"); sky.addColorStop(0.5, "#1a4a2e"); sky.addColorStop(1, "#2d6e42");
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#3a5a2a"; ctx.fillRect(x, y + h * 0.7, w, h * 0.3);

    const rng = seededRand(42);
    for (let i = 0; i < 5; i++) {
        const tx = x + (i / 5) * w + rng() * (w / 5 * 0.5);
        const ty = y + h * 0.68, th = 18 + rng() * 18;
        ctx.fillStyle = "#3e2c1c"; ctx.fillRect(tx - 1.5, ty, 3, th * 0.3);
        ctx.fillStyle = "#1b5e20"; ctx.beginPath();
        ctx.moveTo(tx - 8, ty + th * 0.15); ctx.lineTo(tx, ty - th * 0.45); ctx.lineTo(tx + 8, ty + th * 0.15); ctx.fill();
        ctx.fillStyle = "#2e7d32"; ctx.beginPath();
        ctx.moveTo(tx - 6, ty - th * 0.05); ctx.lineTo(tx, ty - th * 0.3); ctx.lineTo(tx + 6, ty - th * 0.05); ctx.fill();
    }
    const time = Date.now() * 0.003;
    for (let i = 0; i < 6; i++) {
        const fx = x + (Math.sin(time + i * 2.1) * 0.4 + 0.5) * w;
        const fy = y + h * 0.25 + (Math.cos(time * 0.7 + i) * 0.3 + 0.3) * h * 0.4;
        const pulse = Math.sin(time * 2 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(180,255,100,${0.2 + pulse * 0.5})`;
        ctx.beginPath(); ctx.arc(fx, fy, 1 + pulse, 0, Math.PI * 2); ctx.fill();
    }
}

// ─── CIUDAD MINI ───────────────────────────────────────────────────────────
function drawMiniCity(x, y, w, h) {
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#1a1a2e"); sky.addColorStop(1, "#2d2d4a");
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);

    const rng = seededRand(200);
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = `rgba(220,220,255,${0.3 + rng() * 0.5})`;
        ctx.beginPath(); ctx.arc(x + rng() * w, y + rng() * h * 0.35, 0.7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#e8e0d0"; ctx.beginPath(); ctx.arc(x + w * 0.8, y + h * 0.12, 5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#1a1a28"; ctx.fillRect(x, y + h * 0.75, w, h * 0.25);
    const bRng = seededRand(55);
    for (let i = 0; i < 6; i++) {
        const bx = x + (i / 6) * w + bRng() * (w / 6 * 0.3);
        const bh = 18 + bRng() * 38, bw = w / 6 * (0.6 + bRng() * 0.3);
        const by = y + h * 0.75 - bh;
        ctx.fillStyle = i % 2 === 0 ? "#1a1f2e" : "#2d3347"; ctx.fillRect(bx, by, bw, bh);
        for (let wy = by + 3; wy < by + bh - 3; wy += 5)
            for (let wx = bx + 2; wx < bx + bw - 2; wx += 4.5) {
                ctx.fillStyle = bRng() > 0.4 ? "rgba(255,235,150,0.6)" : "rgba(40,50,80,0.8)";
                ctx.fillRect(wx, wy, 2, 2.5);
            }
    }
}

// ─── DESIERTO MINI ─────────────────────────────────────────────────────────
function drawMiniDesert(x, y, w, h) {
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#7a3a10"); sky.addColorStop(0.5, "#c0621a"); sky.addColorStop(1, "#e8a040");
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#ffe060"; ctx.beginPath(); ctx.arc(x + w * 0.6, y + h * 0.2, 8, 0, Math.PI * 2); ctx.fill();

    const colors = ["#c2904a", "#c2a46b", "#d4b87a"];
    for (let d = 0; d < 3; d++) {
        const yBase = y + h * (0.5 + d * 0.17);
        ctx.fillStyle = colors[d]; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, yBase);
        for (let px = x; px <= x + w; px += 6) ctx.lineTo(px, yBase + Math.sin((px - x) * 0.06 + d) * 5);
        ctx.lineTo(x + w, y + h); ctx.fill();
    }
    ctx.fillStyle = "#4a7a3a";
    ctx.fillRect(x + w * 0.3 - 1.5, y + h * 0.45, 3, 16);
    ctx.fillRect(x + w * 0.3 - 6, y + h * 0.43, 4, 7);
    ctx.fillRect(x + w * 0.3 - 6, y + h * 0.38, 4, 5);
    ctx.fillRect(x + w * 0.3 + 2.5, y + h * 0.47, 4, 5);
    ctx.fillRect(x + w * 0.3 + 2.5, y + h * 0.42, 4, 5);
}

// ─── NEVADO MINI ───────────────────────────────────────────────────────────
function drawMiniSnow(x, y, w, h) {
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#1a2a4a"); sky.addColorStop(1, "#4a7a9a");
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);

    const time = Date.now() * 0.001;
    const ax = x + (Math.sin(time) * 0.3 + 0.5) * w;
    const aurora = ctx.createLinearGradient(ax - 15, 0, ax + 15, h * 0.4);
    aurora.addColorStop(0, "rgba(0,230,120,0)"); aurora.addColorStop(0.5, "rgba(0,230,120,0.1)"); aurora.addColorStop(1, "rgba(0,230,120,0)");
    ctx.fillStyle = aurora; ctx.fillRect(x, 0, w, h * 0.5);

    const rng = seededRand(33);
    for (let i = 0; i < 3; i++) {
        const mx = x + (i / 2.5) * w + rng() * 8, mh = 22 + rng() * 22, mw = 22 + rng() * 12;
        ctx.fillStyle = "#263545"; ctx.beginPath();
        ctx.moveTo(mx - mw, y + h * 0.7); ctx.lineTo(mx, y + h * 0.7 - mh); ctx.lineTo(mx + mw, y + h * 0.7); ctx.fill();
        ctx.fillStyle = "#e0ecf4"; ctx.beginPath();
        ctx.moveTo(mx - mw * 0.3, y + h * 0.7 - mh * 0.6); ctx.lineTo(mx, y + h * 0.7 - mh); ctx.lineTo(mx + mw * 0.3, y + h * 0.7 - mh * 0.6); ctx.fill();
    }
    ctx.fillStyle = "#dce8f0"; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + h * 0.75);
    for (let px = x; px <= x + w; px += 5) ctx.lineTo(px, y + h * 0.75 + Math.sin((px - x) * 0.05) * 3);
    ctx.lineTo(x + w, y + h); ctx.fill();

    for (let i = 0; i < 4; i++) {
        const tx = x + (i / 4) * w + w / 8, ty = y + h * 0.72;
        ctx.fillStyle = "#4a3020"; ctx.fillRect(tx - 1, ty, 2, 5);
        ctx.fillStyle = "#1a4a2e"; ctx.beginPath();
        ctx.moveTo(tx - 7, ty); ctx.lineTo(tx, ty - 12); ctx.lineTo(tx + 7, ty); ctx.fill();
        ctx.fillStyle = "rgba(220,240,255,0.5)"; ctx.beginPath();
        ctx.moveTo(tx - 3.5, ty - 2); ctx.lineTo(tx, ty - 8); ctx.lineTo(tx + 3.5, ty - 2); ctx.fill();
    }
    const t2 = Date.now() * 0.0005, rngF = seededRand(11);
    for (let i = 0; i < 8; i++) {
        const fx = x + ((rngF() * w + Math.sin(t2 + i) * 6) % w);
        const fy = ((t2 * 18 + rngF() * h + i * 22) % h);
        ctx.fillStyle = `rgba(220,240,255,${0.3 + rngF() * 0.4})`;
        ctx.beginPath(); ctx.arc(fx, fy, 0.8, 0, Math.PI * 2); ctx.fill();
    }
}

// ─── VOLCÁN MINI ───────────────────────────────────────────────────────────
function drawMiniVolcano(x, y, w, h) {
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#1a0a00"); sky.addColorStop(0.5, "#3a1200"); sky.addColorStop(1, "#6a2800");
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);

    const glow = ctx.createRadialGradient(x + w * 0.5, y + h * 0.3, 0, x + w * 0.5, y + h * 0.3, 40);
    glow.addColorStop(0, "rgba(255,80,0,0.25)"); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(x, 0, w, h * 0.6);

    const vx = x + w * 0.5, vPeak = y + h * 0.22, vBase = y + h * 0.75;
    ctx.fillStyle = "#2a0e00"; ctx.beginPath();
    ctx.moveTo(x, y + h); ctx.lineTo(x, vBase); ctx.lineTo(vx - w * 0.12, vPeak + 8);
    ctx.lineTo(vx + w * 0.12, vPeak + 8); ctx.lineTo(x + w, vBase); ctx.lineTo(x + w, y + h); ctx.fill();

    ctx.fillStyle = "#ff6000"; ctx.beginPath(); ctx.ellipse(vx, vPeak + 8, w * 0.07, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffcc00"; ctx.beginPath(); ctx.ellipse(vx, vPeak + 7, w * 0.035, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#1a0a00"; ctx.fillRect(x, vBase, w, y + h - vBase);
    const time = Date.now() * 0.002, rng = seededRand(22);
    for (let i = 0; i < 6; i++) {
        const ex = x + (Math.sin(time + i * 3.7) * 0.4 + 0.5) * w;
        const ey = ((time * 12 + rng() * h * 0.5 + i * 18) % (h * 0.6)) + h * 0.1;
        const ep = Math.abs(Math.sin(time * 3 + i));
        ctx.fillStyle = `rgba(255,${100 + ep * 100},0,${0.3 + ep * 0.4})`;
        ctx.beginPath(); ctx.arc(ex, ey, 0.7 + ep * 0.4, 0, Math.PI * 2); ctx.fill();
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  MINI SERPIENTE EN TARJETA SELECCIONADA
// ══════════════════════════════════════════════════════════════════════════════

function drawMiniSnakeOnCard(cardX, cardY, cardW, cardH) {
    const mapX = cardX + 4, mapW = cardW - 8, mapH = cardH * 0.48;
    const pathY = cardY + 4 + mapH * 0.7;
    const pStartX = mapX + 8, pEndX = mapX + mapW - 8, pW = pEndX - pStartX;

    // Camino sutil
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath();
    for (let px = pStartX; px <= pEndX; px += 2) {
        const t = (px - pStartX) / pW;
        const py = pathY + Math.sin(t * Math.PI * 2.5) * 5;
        px === pStartX ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Segmentos de serpiente
    const segs = 10, gap = 0.013;
    for (let i = segs; i >= 0; i--) {
        const t = ((miniSnakeProgress - i * gap) + 2) % 1;
        const sx = pStartX + t * pW;
        const sy = pathY + Math.sin(t * Math.PI * 2.5) * 5;
        const t2 = ((miniSnakeProgress - (i - 1) * gap) + 2) % 1;
        const sx2 = pStartX + t2 * pW, sy2 = pathY + Math.sin(t2 * Math.PI * 2.5) * 5;
        const angle = Math.atan2(sy2 - sy, sx2 - sx);

        ctx.save();
        if (i === 0) {
            ctx.shadowBlur = 8; ctx.shadowColor = "#FFD54F";
            ctx.fillStyle = "#66bb6a";
            ctx.beginPath(); ctx.ellipse(sx, sy, 4.5, 3, angle, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            // Ojos
            const ex1 = sx + Math.cos(angle) * 2 + Math.sin(angle) * 1.8;
            const ey1 = sy + Math.sin(angle) * 2 - Math.cos(angle) * 1.8;
            const ex2 = sx + Math.cos(angle) * 2 - Math.sin(angle) * 1.8;
            const ey2 = sy + Math.sin(angle) * 2 + Math.cos(angle) * 1.8;
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(ex1, ey1, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex2, ey2, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#000";
            ctx.beginPath(); ctx.arc(ex1 + Math.cos(angle) * 0.4, ey1 + Math.sin(angle) * 0.4, 0.6, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex2 + Math.cos(angle) * 0.4, ey2 + Math.sin(angle) * 0.4, 0.6, 0, Math.PI * 2); ctx.fill();
            // Lengua
            if (Math.sin(Date.now() * 0.008) > 0.5) {
                ctx.strokeStyle = "#ff5252"; ctx.lineWidth = 1; ctx.lineCap = "round";
                const tx = sx + Math.cos(angle) * 5, ty = sy + Math.sin(angle) * 5;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(angle) * 4 + Math.sin(angle) * 2, ty + Math.sin(angle) * 4 - Math.cos(angle) * 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(angle) * 4 - Math.sin(angle) * 2, ty + Math.sin(angle) * 4 + Math.cos(angle) * 2); ctx.stroke();
            }
        } else {
            ctx.shadowBlur = 3; ctx.shadowColor = "rgba(76,175,80,0.3)";
            const r = 2.2 + (segs - i) * 0.12;
            ctx.fillStyle = i % 2 === 0 ? "#2e7d32" : "#4caf50";
            ctx.beginPath(); ctx.ellipse(sx, sy, r, r * 0.75, angle, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  CANDADO CON FONT AWESOME (con fallback dibujado)
// ══════════════════════════════════════════════════════════════════════════════

function drawLockIcon(cx, cy, size, shake) {
    ctx.save();
    ctx.translate(cx + shake.x, cy + shake.y);
    ctx.rotate(shake.rot);

    // Intentar con Font Awesome
    ctx.font = `900 ${size}px "Font Awesome 6 Free"`;
    ctx.fillStyle = "#FFD54F";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.shadowBlur = 12; ctx.shadowColor = "#FFD54F";
    ctx.fillText("\uf023", 0, 0);

    // Verificar si se dibujó (medir) — fallback si no
    const measured = ctx.measureText("\uf023");
    if (measured.width < 2) {
        // Fallback: candado dibujado manualmente
        const s = size / 32;
        ctx.shadowBlur = 12; ctx.shadowColor = "#FFD54F";
        ctx.strokeStyle = "#FFD54F"; ctx.lineWidth = 2.5 * s; ctx.lineCap = "round";
        ctx.beginPath(); ctx.arc(0, -5 * s, 7 * s, Math.PI, 0, false); ctx.stroke();
        ctx.fillStyle = "#FFD54F";
        ctx.beginPath(); ctx.roundRect(-9 * s, -3 * s, 18 * s, 15 * s, 2.5 * s); ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath(); ctx.arc(0, 4 * s, 2 * s, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-0.8 * s, 4 * s, 1.6 * s, 4 * s);
    }
    ctx.restore();
}

function drawLevelSelect() {
    drawMenuBackground();

    const totalEstrellas = getTotalEstrellas();
    const cx = canvas.width / 2;
    const shake = getShakeOffset();

    // Título
    ctx.shadowBlur = 18; ctx.shadowColor = '#FFD54F';
    ctx.font = 'bold 48px Arial'; ctx.fillStyle = '#FFD54F'; ctx.textAlign = 'center';
    ctx.fillText('SELECCIONAR', cx, 65);
    ctx.shadowBlur = 0;
    ctx.font = '16px Arial'; ctx.fillStyle = '#FFD54F';
    ctx.fillText(`Estrellas totales: ${totalEstrellas}`, cx, 98);

    // ── Tarjetas ──────────────────────────────────────────────────────────
    const cardW  = Math.min(140, (canvas.width - 60) / 5 - 8);
    const cardH  = Math.min(180, canvas.height * 0.42);
    const gap    = 10;
    const totalW = nivelesData.length * cardW + (nivelesData.length - 1) * gap;
    const startX = cx - totalW / 2;
    const cardY  = canvas.height * 0.18;

    for (let i = 0; i < nivelesData.length; i++) {
        const nv = nivelesData[i];
        const isSelected = i === selectedLevel;
        const isLocked   = nv.requiere > 0 && totalEstrellas < nv.requiere;
        const estrellas  = getEstrellasNivel(nv.nivel);
        const elevate    = isSelected ? 10 : 0;

        // Shake solo en nivel 5 bloqueado
        let sx = 0, sy = 0, srot = 0;
        if (i === 4 && isLocked) { sx = shake.x; sy = shake.y; srot = shake.rot; }

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(srot);

        const drawX = startX + i * (cardW + gap);
        const drawY = cardY - elevate;

        // ── Mini mapa de fondo ──
        drawMiniBioma(drawX, drawY, cardW, cardH, nv.bioma);

        // ── Overlay oscuro para texto ──
        const overlay = ctx.createLinearGradient(0, drawY + cardH * 0.4, 0, drawY + cardH);
        overlay.addColorStop(0, "rgba(0,0,0,0)");
        overlay.addColorStop(0.3, "rgba(0,0,0,0.5)");
        overlay.addColorStop(1, "rgba(0,0,0,0.85)");
        ctx.fillStyle = overlay;
        ctx.beginPath(); ctx.roundRect(drawX, drawY, cardW, cardH, 14); ctx.fill();

        // ── NIVEL label sobre el mini mapa ──
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = isLocked ? 'rgba(100,100,100,0.6)' : 'rgba(255,255,255,0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('NIVEL ' + nv.nivel, drawX + cardW / 2, drawY + 18);

        // ── Serpiente animada si está seleccionado y no bloqueado ──
        if (isSelected && !isLocked) {
            drawMiniSnakeOnCard(drawX, drawY, cardW, cardH);
        }

        // ── Borde de la tarjeta ──
        ctx.save();
        ctx.shadowBlur = isSelected ? 22 : 8;
        ctx.shadowColor = isSelected ? nv.color : 'rgba(0,0,0,0.5)';
        ctx.strokeStyle = isSelected ? nv.color : (isLocked ? 'rgba(100,100,100,0.3)' : nv.colorBorde + '60');
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.beginPath(); ctx.roundRect(drawX, drawY, cardW, cardH, 14); ctx.stroke();
        ctx.restore();

        // ── Nombre del bioma ──
        const textY = drawY + cardH * 0.52;
        ctx.font = `bold ${Math.floor(cardW * 0.11)}px Arial`;
        ctx.fillStyle = isLocked ? '#555' : nv.color;
        ctx.shadowBlur = isSelected ? 8 : 0; ctx.shadowColor = nv.color;
        ctx.textAlign = 'center';
        ctx.fillText(nv.nombre, drawX + cardW / 2, textY);
        ctx.shadowBlur = 0;

        // ── Estrellas o Candado ──
        const starY = textY + 16;
        if (isLocked) {
            drawLockIcon(drawX + cardW / 2, starY, Math.floor(cardW * 0.25), { x: 0, y: 0, rot: 0 });
            ctx.font = `${Math.floor(cardW * 0.075)}px Arial`;
            ctx.fillStyle = '#FF8A65';
            ctx.fillText(`Necesitas ${nv.requiere}★`, drawX + cardW / 2, starY + 20);
        } else {
            drawEstrellas(drawX + cardW / 2, starY, estrellas, 3, Math.floor(cardW * 0.12));
        }

        ctx.restore(); // fin translate shake
    }

    // ── Panel de detalle ───────────────────────────────────────────────────
    const nv = nivelesData[selectedLevel];
    const isLocked = nv.requiere > 0 && totalEstrellas < nv.requiere;
    const panelY = cardY + cardH + 18;
    const panelH = Math.min(100, canvas.height - panelY - 55);
    const panelW = Math.min(480, canvas.width - 60);
    const panelX = cx - panelW / 2;

    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.beginPath(); ctx.roundRect(panelX, panelY, panelW, panelH, 14); ctx.fill();
    ctx.strokeStyle = isLocked ? '#666' : nv.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(panelX, panelY, panelW, panelH, 14); ctx.stroke();

    ctx.shadowBlur = isLocked ? 0 : 12; ctx.shadowColor = nv.color;
    ctx.font = `bold ${Math.floor(panelH * 0.3)}px Arial`;
    ctx.fillStyle = isLocked ? '#555' : nv.color; ctx.textAlign = 'center';
    ctx.fillText(nv.nombre, cx, panelY + panelH * 0.35);
    ctx.shadowBlur = 0;

    ctx.font = `${Math.floor(panelH * 0.2)}px Arial`;
    if (isLocked) {
        ctx.fillStyle = '#FF8A65';
        ctx.fillText(`Necesitas ${nv.requiere} estrellas en total (tienes ${totalEstrellas})`, cx, panelY + panelH * 0.65);
    } else {
        ctx.fillStyle = '#C8E6C9';
        const estrN = getEstrellasNivel(nv.nivel);
        ctx.fillStyle = '#FFD54F';
        ctx.fillText(`Mejor: ${'★'.repeat(estrN)}${'☆'.repeat(3 - estrN)}`, cx, panelY + panelH * 0.9);
    }

    // ── Instrucciones ──
    ctx.font = '15px Arial'; ctx.fillStyle = '#A5D6A7';
    ctx.fillText('◀  ▶ para elegir  |  ENTER para jugar  |  ESC para volver', cx, canvas.height - 32);
}

// ══════════════════════════════════════════════════════════════════════════════
//  MENÚ PRINCIPAL (igual que antes, llama a drawMenuBackground)
// ══════════════════════════════════════════════════════════════════════════════

function drawMenu() {
    if (showingLevelSelect) {
        drawLevelSelect();
        return;
    }
    drawMenuBackground();

    // Título
    ctx.shadowBlur  = 18;
    ctx.shadowColor = "#FFD54F";
    ctx.font        = "bold 56px Arial";
    ctx.fillStyle   = "#FFD54F";
    ctx.textAlign   = "center";
    ctx.fillText("LOOP", canvas.width / 2, 70);
    ctx.shadowBlur  = 0;

    // Subtítulo
    ctx.font      = "18px Arial";
    ctx.fillStyle = "#A5D6A7";

    // Panel de opciones
    const menuY = canvas.height * 0.7;
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    drawRoundedRect(ctx, canvas.width / 2 - 160, menuY - 15, 320, menuOptions.length * 50 + 30, 15);
    ctx.fill();
    ctx.strokeStyle = "#FFD54F";
    ctx.lineWidth   = 2;
    drawRoundedRect(ctx, canvas.width / 2 - 160, menuY - 15, 320, menuOptions.length * 50 + 30, 15);
    ctx.stroke();

    for (let i = 0; i < menuOptions.length; i++) {
        const isSelected  = i === selectedOption;
        const hoverEffect = isSelected ? Math.sin(menuAnimationFrame * 0.1) * 3 : 0;

        if (isSelected) {
            ctx.fillStyle = "rgba(255, 213, 79, 0.25)";
            drawRoundedRect(ctx, canvas.width / 2 - 130, menuY + i * 48 - 5, 260, 40, 8);
            ctx.fill();
        }

        ctx.font       = isSelected ? "bold 28px Arial" : "22px Arial";
        ctx.fillStyle  = isSelected ? "#FFD54F" : "#C8E6C9";
        ctx.shadowBlur = isSelected ? 8 : 0;
        ctx.shadowColor = "#FFD54F";
        ctx.fillText(menuOptions[i], canvas.width / 2, menuY + i * 48 + 12 + hoverEffect);
    }
    ctx.shadowBlur = 0;

    // Indicador de música
    if (menuMusicStarted && isMusicPlaying) {
        ctx.font      = "12px Arial";
        ctx.fillStyle = "#66BB6A";
        ctx.fillText(" Música ambiental activada ", canvas.width / 2, canvas.height - 25);
    }

    // Instrucciones
    ctx.font      = "14px Arial";
    ctx.fillStyle = "#A5D6A7";
    ctx.fillText("▲ ▼ para navegar  |  ENTER para seleccionar", canvas.width / 2, canvas.height - 10);

    if (!menuMusicStarted) {
        ctx.font      = "12px Arial";
        ctx.fillStyle = "#FFB74D";
        ctx.fillText(" Haz clic en el juego para activar la música ", canvas.width / 2, canvas.height - 45);
    }
}

// Reinicializar camino si el canvas cambia de tamaño
window.addEventListener("resize", () => {
    caminoPoints = [];
});


// ============================================
// PANTALLA DE FIN DEL JUEGO
// ============================================

let gameOverOption = 0; // 0 = Reintentar, 1 = Volver al menu

function drawGameOverScreen() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const pulse = Math.sin(Date.now() * 0.002) * 0.5 + 0.5;

    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pw = Math.min(500, canvas.width - 80);
    const ph = 320;
    const px = cx - pw / 2;
    const py = cy - ph / 2;

    ctx.save();
    ctx.shadowBlur = 40;
    ctx.shadowColor = '#FF1744';
    ctx.fillStyle = 'rgba(10,0,0,0.95)';
    drawRoundedRect(ctx, px, py, pw, ph, 20);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.strokeStyle = `rgba(255,23,68,${0.6 + pulse * 0.4})`;
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, px, py, pw, ph, 20);
    ctx.stroke();

    ctx.shadowBlur = 24;
    ctx.shadowColor = '#FF1744';
    ctx.font = `bold ${Math.floor(pw * 0.115)}px Arial`;
    ctx.fillStyle = '#FF1744';
    ctx.textAlign = 'center';
    ctx.fillText('FIN DEL JUEGO', cx, py + 70);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255,23,68,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + 30, py + 90);
    ctx.lineTo(px + pw - 30, py + 90);
    ctx.stroke();

    ctx.font = `bold ${Math.floor(pw * 0.075)}px Arial`;
    ctx.fillStyle = '#FFD54F';
    ctx.fillText(`Ratones: ${score}`, cx, py + 145);

    const opciones = ['Reintentar', 'Volver al menu'];
    opciones.forEach((op, i) => {
        const isSelected = i === gameOverOption;
        const optY = py + 205 + i * 58;

        if (isSelected) {
            ctx.save();
            ctx.shadowBlur = 14;
            ctx.shadowColor = i === 0 ? '#69F0AE' : '#FFD54F';
            ctx.fillStyle = i === 0 ? 'rgba(105,240,174,0.15)' : 'rgba(255,213,79,0.15)';
            drawRoundedRect(ctx, cx - pw * 0.38, optY - 22, pw * 0.76, 40, 10);
            ctx.fill();
            ctx.restore();
        }

        ctx.font = `${isSelected ? 'bold ' : ''}${Math.floor(pw * 0.065)}px Arial`;
        ctx.fillStyle = isSelected
            ? (i === 0 ? '#69F0AE' : '#FFD54F')
            : 'rgba(200,200,200,0.45)';
        ctx.shadowBlur = isSelected ? 8 : 0;
        ctx.shadowColor = i === 0 ? '#69F0AE' : '#FFD54F';
        ctx.fillText((isSelected ? '> ' : '  ') + op, cx, optY + 4);
        ctx.shadowBlur = 0;
    });

    ctx.font = '13px Arial';
    ctx.fillStyle = 'rgba(160,160,160,0.5)';
    ctx.fillText('W / S o flechas  |  ENTER para confirmar', cx, py + ph - 18);
}

// ============================================
// PANTALLA DE CONTROLES - SIN EMOJIS
// ============================================

function drawControls() {
    drawMenuBackground();
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFD54F';
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#FFD54F';
    ctx.textAlign = 'center';
    ctx.fillText('CONTROLES', canvas.width / 2, 80);
    ctx.shadowBlur = 0;
    
    const panelX = canvas.width / 2;
    const panelY = canvas.height * 0.18;
    const panelW = Math.min(480, canvas.width - 60);
    const panelH = Math.min(380, canvas.height * 0.58);
    
    ctx.fillStyle = 'rgba(0, 20, 0, 0.88)';
    drawRoundedRect(ctx, panelX - panelW/2, panelY, panelW, panelH, 20);
    ctx.fill();
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, panelX - panelW/2, panelY, panelW, panelH, 20);
    ctx.stroke();
    
    const marginLeft = panelX - panelW/2 + 40;
    const rowHeight = 40;
    const startY = panelY + 30;
    
    const controls = [
        { key: '▲', desc: 'Mover arriba' },
        { key: '▼', desc: 'Mover abajo' },
        { key: '◀', desc: 'Mover izquierda' },
        { key: '▶', desc: 'Mover derecha' },
        { key: 'P', desc: 'Pausar juego' },
        { key: 'ESC', desc: 'Volver al menú' },
        { key: 'ENTER', desc: 'Seleccionar / Reiniciar' }
    ];
    
    const keyX = marginLeft + 30;
    const descX = keyX + 70;
    
    for (let i = 0; i < controls.length; i++) {
        const y = startY + i * rowHeight;
        
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFD54F';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(controls[i].key, keyX, y);
        
        ctx.textAlign = 'left';
        ctx.fillStyle = '#C8E6C9';
        ctx.font = '18px Arial';
        ctx.fillText(controls[i].desc, descX, y);
    }
    
    ctx.textAlign = 'center';
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFB74D';
    ctx.fillText('Presiona ESC para volver al menú', panelX, panelY + panelH + 40);
}

// ============================================
// PANTALLA DE CONFIGURACIÓN - SIN EMOJIS
// ============================================

function drawSettings() {
    drawMenuBackground();
    
    // Título - SIN ICONO
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFD54F';
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#FFD54F';
    ctx.textAlign = 'center';
    ctx.fillText('CONFIGURACIÓN', canvas.width / 2, 80);
    ctx.shadowBlur = 0;
    
    // Panel principal
    const panelX = canvas.width / 2;
    const panelY = canvas.height * 0.16;
    const panelW = Math.min(560, canvas.width - 80);
    const panelH = Math.min(390, canvas.height * 0.6);
    
    ctx.fillStyle = 'rgba(0, 20, 0, 0.88)';
    drawRoundedRect(ctx, panelX - panelW/2, panelY, panelW, panelH, 20);
    ctx.fill();
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, panelX - panelW/2, panelY, panelW, panelH, 20);
    ctx.stroke();
    
    const col1 = panelX - panelW/2 + 40;
    const col2 = panelX + panelW/2 - 40;
    const rowHeight = 70;
    const startY = panelY + 30;
    
    // === FILA 1: VOLUMEN ===
    const y1 = startY;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Volumen de la música:', col1, y1);
    
    // Barra
    const barY = y1 + 14;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(panelX - 130, barY, 260, 10);
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(panelX - 130, barY, 260 * volume, 10);
    
    // Porcentaje
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(Math.floor(volume * 100) + '%', col2, y1 + 16);
    
    // Separador
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX - panelW/2 + 30, y1 + rowHeight - 5);
    ctx.lineTo(panelX + panelW/2 - 30, y1 + rowHeight - 5);
    ctx.stroke();
    
    // === FILA 2: EFECTOS ===
    const y2 = y1 + rowHeight;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Efectos de sonido:', col1, y2);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = soundEnabled ? '#4CAF50' : '#E57373';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(soundEnabled ? 'ON' : 'OFF', col2, y2);
    
    // Separador
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX - panelW/2 + 30, y2 + rowHeight - 5);
    ctx.lineTo(panelX + panelW/2 - 30, y2 + rowHeight - 5);
    ctx.stroke();
    
    // === FILA 3: MÚSICA ===
    const y3 = y2 + rowHeight;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Música ambiental:', col1, y3);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = (menuMusicStarted && isMusicPlaying) ? '#4CAF50' : '#E57373';
    ctx.font = 'bold 20px monospace';
    ctx.fillText((menuMusicStarted && isMusicPlaying) ? 'ACTIVA' : 'INACTIVA', col2, y3);
    
    // === FILA 4: INFO ===
    const y4 = y3 + rowHeight + 10;
    ctx.textAlign = 'center';
    ctx.font = '15px Arial';
    ctx.fillStyle = '#A5D6A7';
    ctx.fillText('La música incluye: viento suave, pájaros, arroyo y melodía', panelX, y4);
    
    // === INSTRUCCIONES ===
    const instrY = panelY + panelH + 45;
    ctx.textAlign = 'center';
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFB74D';
    ctx.fillText('Presiona ESC para volver al menú', panelX, instrY);
    
    ctx.fillStyle = '#A5D6A7';
    ctx.font = '14px Arial';
    ctx.fillText('◀  ▶  ajustar volumen  |  ESPACIO/ENTER  activar/desactivar efectos', panelX, instrY + 30);
}

// ============================================
// PANTALLA DE PAUSA
// ============================================

function drawPaused() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFD54F';
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = `rgba(255, 213, 79, ${pulse})`;
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width / 2, canvas.height / 2 - 50);
    ctx.shadowBlur = 0;
    
    ctx.font = '28px Arial';
    ctx.fillStyle = '#A5D6A7';
    ctx.fillText('Presiona P para continuar', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('Presiona ESC para salir al menú', canvas.width / 2, canvas.height / 2 + 80);
}

// ══════════════════════════════════════════════════════════════════════════════
//  CONTROL DE TECLADO — SELECCIÓN DE NIVELES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Llama a esta función desde tu manejador de teclado principal cuando
 * gameState === 'menu' y showingLevelSelect === true.
 * Retorna el nivel elegido (1-5) si el jugador presionó ENTER y el nivel
 * está desbloqueado, o null en cualquier otro caso.
 */
function handleLevelSelectInput(key) {
    if (!showingLevelSelect) return null;

    if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        selectedLevel = (selectedLevel - 1 + nivelesData.length) % nivelesData.length;
        return null;
    }
    if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        selectedLevel = (selectedLevel + 1) % nivelesData.length;
        return null;
    }
    if (key === 'Escape') {
        showingLevelSelect = false;
        return null;
    }
    if (key === 'Enter') {
        const nv = nivelesData[selectedLevel];
        const totalEstrellas = getTotalEstrellas();
        const isLocked = nv.requiere > 0 && totalEstrellas < nv.requiere;
        if (!isLocked) {
            showingLevelSelect = false;
            return nv.nivel; // el juego debe usar este número para arrancar el nivel
        }
    }
    return null;
}

/**
 * Abre la pantalla de selección de niveles.
 * Llama esto cuando el jugador elige "JUGAR" en el menú principal.
 */
function openLevelSelect() {
    showingLevelSelect = true;
    selectedLevel = 0;
}

/**
 * Guarda las estrellas obtenidas en un nivel.
 * @param {number} nivelNum  - Número de nivel (1-5)
 * @param {number} estrellas - Estrellas obtenidas (0-3)
 */
function guardarEstrellasNivel(nivelNum, estrellas) {
    try {
        const data = JSON.parse(localStorage.getItem('snakeForestStars') || '{}');
        const key = 'nivel_' + nivelNum;
        // Solo guardar si es un récord nuevo
        if ((data[key] || 0) < estrellas) {
            data[key] = Math.min(3, Math.max(0, estrellas));
            localStorage.setItem('snakeForestStars', JSON.stringify(data));
        }
    } catch (e) { /* localStorage no disponible */ }
}