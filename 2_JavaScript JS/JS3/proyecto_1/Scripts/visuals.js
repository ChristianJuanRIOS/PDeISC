// ============================================
// DISEÑO VISUAL - SERPIENTE, ÁRBOLES, ROCAS
// ============================================

const SNAKE = {
    body: '#2E7D32',
    bodyLight: '#4CAF50',
    bodyDark: '#1B5E20',
    belly: '#C8E6C9',
    outline: '#1A4A1A',
    pattern: '#388E3C',
    eye: '#FFEB3B',
    eyePupil: '#000000',
    tongue: '#FF5252',
    glow: 'rgba(76, 175, 80, 0.3)',
};

const FOREST = {
    skyTop: '#1a3a2a',
    skyBottom: '#2d5a3a',
    grass1: '#4A8B3C',
    grass2: '#3D7A2F',
    grass3: '#2D6B1E',
    grass4: '#1E5A12',
    dirt: '#8B6946',
    leafBrown: '#A67B4A',
    leafOrange: '#C88A4A',
    flowerYellow: '#FFD54F',
    flowerPink: '#FF80AB',
    treeTrunk: '#5D4037',
    leafLight: '#66BB6A',
    leafMid: '#4CAF50',
    leafDark: '#388E3C',
    sunlight: 'rgba(255, 245, 180, 0.12)',
    shadow: 'rgba(0, 0, 0, 0.2)',
    fog: 'rgba(100, 150, 80, 0.08)',
};

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

// ============================================
// SERPIENTE CON MOVIMIENTO INTERPOLADO SUAVE
// ============================================

let tongueOut = false;
let tongueTimer = 0;

// Interpola suavemente entre posición anterior y actual de cada segmento
function getInterpPos(i) {
    const cur  = snake[i]    || snake[snake.length - 1];
    const prev = (prevSnake && prevSnake[i]) ? prevSnake[i] : cur;
    const t = typeof interpT !== 'undefined' ? interpT : 1;
    // Easing suave (ease-in-out)
    const et = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    return {
        x: (prev.x + (cur.x - prev.x) * et) * CELL + CELL / 2,
        y: (prev.y + (cur.y - prev.y) * et) * CELL + CELL / 2,
    };
}

function drawSnake() {
    if (!snake || snake.length < 1) return;

    const time = Date.now() * 0.004;
    const R = CELL * 0.38; // radio base de cada segmento

    // Animar lengua
    tongueTimer++;
    if (tongueTimer > 40) { tongueOut = !tongueOut; tongueTimer = 0; }

    // ===== CUERPO (de cola a cabeza para que la cabeza quede encima) =====
    for (let i = snake.length - 1; i >= 0; i--) {
        const pos = getInterpPos(i);
        const t = i / Math.max(snake.length - 1, 1); // 0=cabeza, 1=cola

        // Radio decrece hacia la cola
        const r = R * (1 - t * 0.45);

        // Sombra por segmento
        ctx.fillStyle = 'rgba(0,0,0,0.07)';
        ctx.beginPath();
        ctx.ellipse(pos.x + 1, pos.y + 2, r * 0.9, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gradiente radial del segmento (más vivo en la cabeza)
        const green = Math.round(160 + 55 * (1 - t));
        const grad = ctx.createRadialGradient(pos.x - r * 0.3, pos.y - r * 0.3, r * 0.05, pos.x, pos.y, r);
        grad.addColorStop(0, `rgb(100, ${green + 30}, 80)`);
        grad.addColorStop(0.55, `rgb(60, ${green}, 55)`);
        grad.addColorStop(1, `rgb(35, ${green - 30}, 30)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Escamas: patrón en rombos alternos
        if (i % 2 === 0 && i > 0 && i < snake.length - 1) {
            ctx.fillStyle = 'rgba(0,0,0,0.06)';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r * 0.55, 0, Math.PI * 2);
            ctx.fill();
        }

        // Vientre (línea clara central)
        ctx.fillStyle = 'rgba(180, 240, 170, 0.18)';
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + r * 0.15, r * 0.45, r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Conexión suave entre segmentos (path curvo)
    if (snake.length >= 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < snake.length - 1; i++) {
            const a = getInterpPos(i);
            const b = getInterpPos(i + 1);
            const t = i / Math.max(snake.length - 1, 1);
            const r = R * (1 - t * 0.45) * 1.6;
            const green = Math.round(150 + 50 * (1 - t));

            ctx.strokeStyle = `rgb(50, ${green}, 50)`;
            ctx.lineWidth = r;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }
        ctx.restore();

        // Redibuja los segmentos encima del relleno de conexión
        for (let i = snake.length - 1; i >= 0; i--) {
            const pos = getInterpPos(i);
            const t = i / Math.max(snake.length - 1, 1);
            const r = R * (1 - t * 0.45);
            const green = Math.round(160 + 55 * (1 - t));
            const grad = ctx.createRadialGradient(pos.x - r * 0.3, pos.y - r * 0.3, r * 0.05, pos.x, pos.y, r);
            grad.addColorStop(0, `rgb(100, ${green + 30}, 80)`);
            grad.addColorStop(0.55, `rgb(60, ${green}, 55)`);
            grad.addColorStop(1, `rgb(35, ${green - 30}, 30)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
            ctx.fill();
            if (i % 2 === 0 && i > 0 && i < snake.length - 1) {
                ctx.fillStyle = 'rgba(0,0,0,0.06)';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, r * 0.55, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // ===== CABEZA =====
    const head = getInterpPos(0);
    const neck = getInterpPos(Math.min(1, snake.length - 1));
    const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);
    const hs = R * 1.18; // tamaño de cabeza

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(headAngle);

    // Cabeza principal
    const headGrad = ctx.createRadialGradient(-hs * 0.2, -hs * 0.2, hs * 0.05, 0, 0, hs);
    headGrad.addColorStop(0, '#81C784');
    headGrad.addColorStop(0.5, '#4CAF50');
    headGrad.addColorStop(1, '#2E7D32');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(hs * 0.1, 0, hs, hs * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hocico redondeado
    ctx.fillStyle = '#66BB6A';
    ctx.beginPath();
    ctx.ellipse(hs * 0.75, 0, hs * 0.38, hs * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Narinas
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(hs * 0.98, -hs * 0.1, 1.5, 1, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hs * 0.98,  hs * 0.1, 1.5, 1, -0.3, 0, Math.PI * 2); ctx.fill();

    // Ojos
    const eyeX = hs * 0.28;
    const eyeY = hs * 0.52;
    for (const ey of [-eyeY, eyeY]) {
        // Blanco
        ctx.fillStyle = '#FFFDE7';
        ctx.beginPath(); ctx.ellipse(eyeX, ey, hs * 0.28, hs * 0.26, 0, 0, Math.PI * 2); ctx.fill();
        // Iris verde-dorado
        ctx.fillStyle = '#F9A825';
        ctx.beginPath(); ctx.arc(eyeX + 1, ey, hs * 0.17, 0, Math.PI * 2); ctx.fill();
        // Pupila vertical
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath(); ctx.ellipse(eyeX + 1, ey, hs * 0.07, hs * 0.15, 0, 0, Math.PI * 2); ctx.fill();
        // Brillo
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.arc(eyeX - 1, ey - hs * 0.07, hs * 0.06, 0, Math.PI * 2); ctx.fill();
    }

    // Lengua bífida
    if (tongueOut) {
        ctx.strokeStyle = '#F44336';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hs * 1.0, 0);
        ctx.lineTo(hs * 1.35, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(hs * 1.35, 0);
        ctx.lineTo(hs * 1.6, -hs * 0.22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(hs * 1.35, 0);
        ctx.lineTo(hs * 1.6, hs * 0.22);
        ctx.stroke();
    }

    // Brillo en la cabeza
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath();
    ctx.ellipse(-hs * 0.1, -hs * 0.35, hs * 0.45, hs * 0.22, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // ===== COLA puntiaguda =====
    if (snake.length >= 2) {
        const tail = getInterpPos(snake.length - 1);
        const preTail = getInterpPos(snake.length - 2);
        const tailAngle = Math.atan2(tail.y - preTail.y, tail.x - preTail.x);
        const tr = R * 0.55;

        ctx.save();
        ctx.translate(tail.x, tail.y);
        ctx.rotate(tailAngle);

        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.moveTo(-tr, -tr * 0.5);
        ctx.quadraticCurveTo(tr * 0.5, 0, tr * 1.4, 0);
        ctx.quadraticCurveTo(tr * 0.5, 0, -tr, tr * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}




// ============================================
// ÁRBOL MEJORADO CON MÁS DETALLE
// ============================================

function drawTree(o) {
    const cx = o.cx * CELL + CELL / 2;
    const cy = o.cy * CELL + CELL / 2;
    const r = o.radius * CELL;
    
    // Sombra del árbol
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(cx + 3, cy + 4, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tronco con textura
    const trunkGrad = ctx.createLinearGradient(cx - r * 0.12, 0, cx + r * 0.12, 0);
    trunkGrad.addColorStop(0, '#3E2C1C');
    trunkGrad.addColorStop(0.5, '#5D4037');
    trunkGrad.addColorStop(1, '#3E2C1C');
    ctx.fillStyle = trunkGrad;
    ctx.beginPath();
    ctx.rect(cx - r * 0.12, cy - r * 0.05, r * 0.24, r * 0.6);
    ctx.fill();
    
    // Raíces visibles
    ctx.strokeStyle = '#4A3525';
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * r * 0.08, cy + r * 0.5);
        ctx.lineTo(cx + i * r * 0.25, cy + r * 0.65);
        ctx.stroke();
    }
    
    // Copa del árbol (más capas)
    const layers = [
        { color: FOREST.leafDark, yOff: -0.08, size: 0.75 },
        { color: FOREST.leafMid, yOff: -0.28, size: 0.65 },
        { color: '#43A047', yOff: -0.45, size: 0.55 },
        { color: FOREST.leafLight, yOff: -0.6, size: 0.45 }
    ];
    
    for (const layer of layers) {
        ctx.fillStyle = layer.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0,50,0,0.1)';
        ctx.beginPath();
        ctx.arc(cx, cy + (layer.yOff * r), r * layer.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Detalle de hojas
        ctx.fillStyle = 'rgba(150, 220, 100, 0.1)';
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + layer.yOff;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * r * layer.size * 0.7, 
                    cy + (layer.yOff * r) + Math.sin(angle) * r * layer.size * 0.4, 
                    2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Frutas (manzanas/bayas)
    if (Math.random() > 0.7) {
        ctx.fillStyle = '#E53935';
        ctx.beginPath();
        ctx.arc(cx + r * 0.15, cy - r * 0.15, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.17, cy - r * 0.2, 1, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================
// ARBUSTO MEJORADO
// ============================================

function drawBush(o) {
    const cx = o.cx * CELL + CELL / 2;
    const cy = o.cy * CELL + CELL / 2;
    const r = o.radius * CELL;
    
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(cx + 2, cy + 3, r * 1.2, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Capas del arbusto
    ctx.fillStyle = FOREST.leafDark;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.1, r * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = FOREST.leafMid;
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - 3, r * 0.8, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 4, cy - 2, r * 0.8, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#43A047';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 5, r * 0.6, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pequeñas bayas
    ctx.fillStyle = '#7B1FA2';
    ctx.beginPath();
    ctx.arc(cx - 3, cy + 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 2, cy + 2, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E91E63';
    ctx.beginPath();
    ctx.arc(cx + 5, cy - 1, 1.3, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// RATÓN - COMIDA DE LA SERPIENTE
// ============================================

function drawMouse(cx, cy) {
    const time = Date.now() * 0.004;
    const shake = Math.sin(time * 5.5) * 1.2;   // tiembla de miedo
    const bob   = Math.sin(time * 1.2) * 1.5;
    const s = CELL * 0.85;

    // === Halo pulsante (visible desde lejos) ===
    const glow = ctx.createRadialGradient(cx, cy, s * 0.2, cx, cy, s * 1.8);
    const pulse = 0.18 + Math.sin(time * 2) * 0.08;
    glow.addColorStop(0, `rgba(255, 220, 150, ${pulse})`);
    glow.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(cx + shake, cy + bob);

    // === Sombra ===
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(s * 0.05, s * 0.72 - bob, s * 0.9, s * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // === Cola larga y curva ===
    ctx.strokeStyle = '#C8956C';
    ctx.lineWidth = Math.max(1.5, s * 0.065);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.42, s * 0.08);
    ctx.bezierCurveTo(-s * 1.0, -s * 0.1, -s * 1.3, -s * 0.7, -s * 0.7, -s * 1.05);
    ctx.stroke();

    // === Patas traseras ===
    ctx.fillStyle = '#A07848';
    ctx.beginPath();
    ctx.ellipse(-s * 0.3, s * 0.42, s * 0.13, s * 0.07, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-s * 0.05, s * 0.44, s * 0.13, s * 0.07, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // === Cuerpo con gradiente ===
    const bodyGrad = ctx.createRadialGradient(-s * 0.1, -s * 0.1, s * 0.05, 0, s * 0.05, s * 0.6);
    bodyGrad.addColorStop(0, '#D4AA78');
    bodyGrad.addColorStop(0.55, '#B8864A');
    bodyGrad.addColorStop(1, '#8B5E30');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.52, s * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(80, 50, 20, 0.2)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // === Vientre ===
    ctx.fillStyle = '#EEDDCC';
    ctx.beginPath();
    ctx.ellipse(s * 0.05, s * 0.12, s * 0.3, s * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // === Patas delanteras ===
    ctx.fillStyle = '#B08050';
    ctx.beginPath();
    ctx.ellipse(s * 0.32, s * 0.42, s * 0.11, s * 0.06, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.1, s * 0.44, s * 0.11, s * 0.06, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // === Orejas (detrás de la cabeza) ===
    // Oreja izquierda
    ctx.fillStyle = '#A07040';
    ctx.beginPath();
    ctx.ellipse(-s * 0.05, -s * 0.52, s * 0.22, s * 0.28, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F09090';
    ctx.beginPath();
    ctx.ellipse(-s * 0.04, -s * 0.5, s * 0.13, s * 0.17, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Oreja derecha
    ctx.fillStyle = '#A07040';
    ctx.beginPath();
    ctx.ellipse(s * 0.3, -s * 0.55, s * 0.22, s * 0.28, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F09090';
    ctx.beginPath();
    ctx.ellipse(s * 0.3, -s * 0.53, s * 0.13, s * 0.17, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // === Cabeza ===
    const headGrad = ctx.createRadialGradient(s * 0.1, -s * 0.28, s * 0.03, s * 0.12, -s * 0.2, s * 0.38);
    headGrad.addColorStop(0, '#D4AA78');
    headGrad.addColorStop(0.6, '#B8864A');
    headGrad.addColorStop(1, '#8B5E30');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(s * 0.12, -s * 0.2, s * 0.34, s * 0.28, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // === Hocico ===
    ctx.fillStyle = '#C89A60';
    ctx.beginPath();
    ctx.ellipse(s * 0.42, -s * 0.14, s * 0.16, s * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    // === Nariz ===
    ctx.fillStyle = '#FF7A90';
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(255, 100, 130, 0.5)';
    ctx.beginPath();
    ctx.arc(s * 0.54, -s * 0.12, s * 0.055, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // === Ojos grandes y expresivos ===
    const eyePositions = [[s * 0.06, -s * 0.3], [s * 0.28, -s * 0.28]];
    for (const [ex, ey] of eyePositions) {
        // Blanco
        ctx.fillStyle = '#FFFDE7';
        ctx.beginPath();
        ctx.ellipse(ex, ey, s * 0.1, s * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Iris marrón
        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.arc(ex + s * 0.01, ey + s * 0.01, s * 0.07, 0, Math.PI * 2);
        ctx.fill();
        // Pupila
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(ex + s * 0.015, ey + s * 0.015, s * 0.04, 0, Math.PI * 2);
        ctx.fill();

    }

    // === Bigotes largos ===
    ctx.strokeStyle = 'rgba(100, 70, 40, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.lineCap = 'round';
    // izquierda
    ctx.beginPath(); ctx.moveTo(s * 0.44, -s * 0.1);  ctx.lineTo(s * 0.18, -s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.45, -s * 0.14); ctx.lineTo(s * 0.18, -s * 0.14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.44, -s * 0.18); ctx.lineTo(s * 0.18, -s * 0.06); ctx.stroke();
    // derecha
    ctx.beginPath(); ctx.moveTo(s * 0.5,  -s * 0.1);  ctx.lineTo(s * 0.78, -s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.5,  -s * 0.14); ctx.lineTo(s * 0.78, -s * 0.14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.5,  -s * 0.18); ctx.lineTo(s * 0.78, -s * 0.06); ctx.stroke();

    ctx.restore();
}

// ============================================
// COMIDA - RATÓN MEJORADO (legacy, no usada)
// ============================================

function drawInsect(type, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);
    
    // Tamaño similar al de la serpiente
    const scale = 1.2;
    
    // Sombra del ratón
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 5, CELL * 0.5 * scale, CELL * 0.2 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Brillo pulsante
    const pulse = Math.sin(Date.now() * 0.004) * 0.15 + 0.85;
    ctx.shadowBlur = 12 * pulse;
    ctx.shadowColor = 'rgba(255, 200, 50, 0.35)';
    
    // ===== CUERPO =====
    // Cuerpo principal
    const bodyGrad = ctx.createRadialGradient(-5, -3, 0, 0, 0, CELL * 0.35 * scale);
    bodyGrad.addColorStop(0, '#D7CCC8');
    bodyGrad.addColorStop(0.6, '#BCAAA4');
    bodyGrad.addColorStop(1, '#A1887F');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 2, CELL * 0.38 * scale, CELL * 0.28 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Vientre
    ctx.fillStyle = '#EFEBE9';
    ctx.beginPath();
    ctx.ellipse(0, 6, CELL * 0.25 * scale, CELL * 0.15 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // ===== CABEZA =====
    ctx.fillStyle = '#BCAAA4';
    ctx.beginPath();
    ctx.ellipse(CELL * 0.4 * scale, 0, CELL * 0.22 * scale, CELL * 0.22 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Hocico
    ctx.fillStyle = '#D7CCC8';
    ctx.beginPath();
    ctx.ellipse(CELL * 0.58 * scale, 0, CELL * 0.12 * scale, CELL * 0.1 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nariz (rosada con brillo)
    ctx.fillStyle = '#FF8A80';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255, 138, 128, 0.5)';
    ctx.beginPath();
    ctx.arc(CELL * 0.62 * scale, 0, 2.8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Brillo en la nariz
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(CELL * 0.6 * scale, -1.5 * scale, 0.8 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // ===== OJOS =====
    // Blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(CELL * 0.44 * scale, -CELL * 0.12 * scale, 4 * scale, 4.5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CELL * 0.44 * scale, CELL * 0.12 * scale, 4 * scale, 4.5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris
    ctx.fillStyle = '#4A148C';
    ctx.beginPath();
    ctx.arc(CELL * 0.47 * scale, -CELL * 0.12 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CELL * 0.47 * scale, CELL * 0.12 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupila
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(CELL * 0.49 * scale, -CELL * 0.12 * scale, 1.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CELL * 0.49 * scale, CELL * 0.12 * scale, 1.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Reflejos
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(CELL * 0.51 * scale, -CELL * 0.15 * scale, 1.2 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CELL * 0.51 * scale, CELL * 0.09 * scale, 1.2 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // ===== OREJAS =====
    // Oreja izquierda
    ctx.fillStyle = '#BCAAA4';
    ctx.beginPath();
    ctx.ellipse(CELL * 0.3 * scale, -CELL * 0.22 * scale, 4.5 * scale, 5.5 * scale, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Oreja derecha
    ctx.beginPath();
    ctx.ellipse(CELL * 0.3 * scale, CELL * 0.22 * scale, 4.5 * scale, 5.5 * scale, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Interior orejas
    ctx.fillStyle = '#FFCDD2';
    ctx.strokeStyle = '#EF9A9A';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(CELL * 0.28 * scale, -CELL * 0.22 * scale, 2.5 * scale, 3.5 * scale, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(CELL * 0.28 * scale, CELL * 0.22 * scale, 2.5 * scale, 3.5 * scale, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // ===== BIGOTES =====
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 0;
    // Izquierdos
    ctx.beginPath();
    ctx.moveTo(CELL * 0.5 * scale, -2 * scale);
    ctx.lineTo(CELL * 0.32 * scale, -CELL * 0.15 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CELL * 0.5 * scale, 0);
    ctx.lineTo(CELL * 0.32 * scale, -CELL * 0.05 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CELL * 0.5 * scale, 2 * scale);
    ctx.lineTo(CELL * 0.32 * scale, CELL * 0.15 * scale);
    ctx.stroke();
    
    // Derechos
    ctx.beginPath();
    ctx.moveTo(CELL * 0.54 * scale, -2 * scale);
    ctx.lineTo(CELL * 0.72 * scale, -CELL * 0.15 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CELL * 0.54 * scale, 0);
    ctx.lineTo(CELL * 0.72 * scale, -CELL * 0.05 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CELL * 0.54 * scale, 2 * scale);
    ctx.lineTo(CELL * 0.72 * scale, CELL * 0.15 * scale);
    ctx.stroke();
    
    // ===== COLA =====
    ctx.strokeStyle = '#BCAAA4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-CELL * 0.32 * scale, 4);
    ctx.quadraticCurveTo(-CELL * 0.55 * scale, CELL * 0.35 * scale, -CELL * 0.75 * scale, CELL * 0.1 * scale);
    ctx.quadraticCurveTo(-CELL * 0.85 * scale, -CELL * 0.08 * scale, -CELL * 0.65 * scale, -CELL * 0.18 * scale);
    ctx.stroke();
    
    // ===== PATAS =====
    ctx.fillStyle = '#BCAAA4';
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 1;
    
    // Delanteras
    ctx.beginPath();
    ctx.ellipse(CELL * 0.1 * scale, CELL * 0.32 * scale, 3.5 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(CELL * 0.25 * scale, CELL * 0.32 * scale, 3.5 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Traseras
    ctx.beginPath();
    ctx.ellipse(-CELL * 0.15 * scale, CELL * 0.32 * scale, 4 * scale, 3 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-CELL * 0.3 * scale, CELL * 0.3 * scale, 4 * scale, 3 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // ===== DIENTE =====
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.rect(CELL * 0.58 * scale, 1.5 * scale, 2.2 * scale, 2.2 * scale);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.restore();
}

function drawFood() {
    if (!food) return;
    const cx = food.x * CELL + CELL / 2;
    const cy = food.y * CELL + CELL / 2;
    drawMouse(cx, cy);
}

function drawParticles() {
    for (const p of particles) {
        ctx.globalAlpha = p.life * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawObstacles() {
    obstacles.forEach(o => {
        if (o.type === 'tree') drawTree(o);
        else if (o.type === 'bush') drawBush(o);
    });
}