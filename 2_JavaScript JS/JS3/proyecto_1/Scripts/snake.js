// ============================================
// MECÁNICAS DE LA SERPIENTE - MOVIMIENTO Y LÓGICA
// ============================================

let snakeSpeed = 120; // ms por paso — más rápido que antes
let prevSnake = [];   // posiciones del frame anterior para interpolación
let dirQueue = [];    // cola de direcciones para evitar muertes por input rápido

function initSnake() {
    // Buscar celdas de camino válidas horizontalmente para el spawn inicial
    // getPathCells() está disponible desde map.js
    const pathCells = typeof getPathCells === 'function' ? getPathCells() : [];
    
    // Buscar 3 celdas consecutivas en el camino (misma fila, columnas seguidas)
    let startX = Math.floor(COLS * 0.25);
    let startY = Math.floor(ROWS * 0.15);
    
    if (pathCells.length > 0) {
        // Agrupar por fila y buscar 3 consecutivas
        outer:
        for (let gy = 1; gy < ROWS - 1; gy++) {
            for (let gx = 3; gx < COLS - 3; gx++) {
                const c0 = pathCells.find(c => c.x === gx && c.y === gy);
                const c1 = pathCells.find(c => c.x === gx - 1 && c.y === gy);
                const c2 = pathCells.find(c => c.x === gx - 2 && c.y === gy);
                if (c0 && c1 && c2) {
                    startX = gx;
                    startY = gy;
                    break outer;
                }
            }
        }
    }

    snake = [
        { x: startX,     y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY },
    ];
    prevSnake = snake.map(s => ({ ...s }));
    dir = { x: 1, y: 0 };
    dirQueue = [];
    score = 0;
    lives = 3;
    snakeSpeed = 120;
    particles = [];
}

function updateSnake() {
    if (currentState !== GAME_STATE.PLAYING) return;

    frame++;

    // Guardar posiciones anteriores para interpolación
    prevSnake = snake.map(s => ({ x: s.x, y: s.y }));

    // Actualizar partículas
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.02;
        return p.life > 0 && p.y < canvas.height;
    });

    // Aplicar siguiente dirección de la cola
    if (dirQueue.length > 0) {
        const next = dirQueue.shift();
        // Solo aplicar si no es opuesta a la dirección actual
        if (!(dir.x === -next.x && dir.y === -next.y)) {
            dir = next;
        }
    }

    const newHead = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    
    if (checkCollision(newHead)) {
        lives--;
        if (lives <= 0) { 
            playGameOverSound();
            currentState = GAME_STATE.GAME_OVER;
        } else {
            const old = { score, lives: lives };
            initSnake();
            score = old.score;
            lives = old.lives;
            spawnFood();
        }
        return;
    }
    
    snake.unshift(newHead);
    
    if (newHead.x === food.x && newHead.y === food.y) {
        playEatSound();
        spawnFood(); 
        score++; 
        aumentarVelocidad();
    } else { 
        snake.pop(); 
    }
}

function changeDirection(newDir) {
    if (newDir.x === 0 && newDir.y === 0) return;

    // Tomar la última dirección encolada (o la actual si la cola está vacía)
    const last = dirQueue.length > 0 ? dirQueue[dirQueue.length - 1] : dir;

    // No encolar si es opuesta o igual a la última
    if (last.x === -newDir.x && last.y === -newDir.y) return;
    if (last.x === newDir.x && last.y === newDir.y) return;

    // Máximo 2 direcciones en cola para evitar acumulación
    if (dirQueue.length < 2) dirQueue.push(newDir);
}

function resetSnake() {
    initSnake();
    spawnFood();
}

// Obtener velocidad actual (para gameLoop)
function getSnakeSpeed() {
    return snakeSpeed;
}