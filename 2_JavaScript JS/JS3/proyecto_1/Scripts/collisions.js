// ============================================
// SISTEMA DE COLISIONES - HITBOX
// ============================================

// Los árboles y arbustos son obstáculos visuales en el césped.
// Como la serpiente NUNCA puede salir del camino, no necesitamos
// colisionar contra ellos — el límite del camino ya los bloquea.
// generateObstacles se mantiene solo para el dibujo visual.

function generateObstacles() {
    // Los obstáculos visuales (árboles/arbustos) son generados por map.js
    // Esta función devuelve array vacío — las colisiones las maneja isOnPath
    return [];
}

function isObstacle(x, y) {
    // Ya no hay obstáculos de árbol en la lógica; el muro es el borde del camino
    return false;
}

function checkCollision(head) {
    // ── Colisión con uno mismo ──
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }

    // ── Colisión con el borde del camino (salir del laberinto = muerte) ──
    if (!isOnPath(head.x, head.y)) return true;

    return false;
}

// ============================================
// SPAWN DE COMIDA — BIAS DIRECCIONAL INTELIGENTE
// ============================================

const FOOD_MIN_DIST = 8;
const FOOD_MAX_DIST = 22;

// --- Sistema de bias direccional ---
const recentEats = [];         // historial de posiciones donde se comió
const EAT_HISTORY_SIZE = 3;    // cuántas comidas recordar para calcular el bias
const EAT_BIAS_STRENGTH = 1.2; // qué tan fuerte empuja hacia el lado opuesto

function resetFoodBias() {
    recentEats.length = 0;
}

function getEatBiasInfo() {
    // Calcula hacia dónde hay que empujar el spawn
    if (recentEats.length < 2) return null;

    // Promedio X de las últimas comidas
    const avgX = recentEats.reduce((sum, e) => sum + e.x, 0) / recentEats.length;
    const centerX = COLS / 2;

    // Qué tan desbalanceado está (0 = centro, 1 = extremo)
    const imbalance = Math.abs(avgX - centerX) / (COLS / 2);

    // Solo activar bias si hay al menos 2 comidas del mismo lado
    if (imbalance < 0.15) return null;

    // Dirección: si comió a la izquierda, empujar a la derecha (+1), y viceversa
    const biasDir = avgX < centerX ? 1 : -1;

    return { avgX, biasDir, imbalance };
}

function spawnFood() {
    const head = snake[0];

    // ── Registrar dónde estaba la comida anterior (la serpiente acaba de comerla) ──
    if (food && food.x !== undefined) {
        recentEats.push({ x: food.x, y: food.y });
        if (recentEats.length > EAT_HISTORY_SIZE) {
            recentEats.shift();
        }
    }

    // ── Filtrar celdas válidas ──
    let candidates = getPathCells().filter(c => {
        if (snake.some(s => s.x === c.x && s.y === c.y)) return false;
        const dist = Math.abs(c.x - head.x) + Math.abs(c.y - head.y);
        return dist >= FOOD_MIN_DIST && dist <= FOOD_MAX_DIST;
    });

    if (candidates.length === 0) {
        candidates = getPathCells().filter(c => {
            if (snake.some(s => s.x === c.x && s.y === c.y)) return false;
            const dist = Math.abs(c.x - head.x) + Math.abs(c.y - head.y);
            return dist >= FOOD_MIN_DIST;
        });
    }

    if (candidates.length === 0) {
        candidates = getPathCells().filter(
            c => !snake.some(s => s.x === c.x && s.y === c.y)
        );
    }

    if (candidates.length === 0) return;

    // ── Seleccionar posición con bias direccional ──
    const bias = getEatBiasInfo();
    let pos;

    if (bias) {
        // Peso base para cada candidato
        const weights = candidates.map(c => {
            // Distancia desde el promedio de comidas, en la dirección del bias
            const distFromEats = (c.x - bias.avgX) * bias.biasDir;

            // Solo suma peso si está del lado correcto (distFromEats > 0)
            // Las celdas del lado opuesto al bias quedan con peso base mínimo
            const biasWeight = Math.max(0, distFromEats) * EAT_BIAS_STRENGTH * bias.imbalance;

            return 1 + biasWeight;
        });

        // Selección aleatoria ponderada
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let rng = Math.random() * totalWeight;
        pos = candidates[0];

        for (let i = 0; i < candidates.length; i++) {
            rng -= weights[i];
            if (rng <= 0) {
                pos = candidates[i];
                break;
            }
        }
    } else {
        // Sin historial suficiente → aleatorio puro
        pos = candidates[Math.floor(Math.random() * candidates.length)];
    }

    food = pos;
    foodType = INSECT_TYPES[Math.floor(Math.random() * INSECT_TYPES.length)];

    // Partículas de aparición
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: pos.x * CELL + CELL / 2,
            y: pos.y * CELL + CELL / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * -3,
            life: 1,
            color: `hsl(${Math.random() * 60 + 40}, 70%, 60%)`
        });
    }
}


