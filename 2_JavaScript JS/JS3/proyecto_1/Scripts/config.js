// ============================================
// CONFIGURACIÓN GLOBAL DEL JUEGO
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CELL = 20;
let COLS = Math.floor(canvas.width / CELL);
let ROWS = Math.floor(canvas.height / CELL);

const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    PAUSED: 'paused',
    CONTROLS: 'controls',
    SETTINGS: 'settings'
};

let currentState = GAME_STATE.MENU;
let selectedOption = 0;
let menuOptions = ['Jugar', 'Controles', 'Configuración', 'Salir'];
let volume = 0.5;
let soundEnabled = true;
let menuMusicStarted = false;
let frame = 0;
if (typeof menuAnimationFrame === 'undefined') window.menuAnimationFrame = 0;
let snake = [];
let dir = { x: 1, y: 0 };
let score = 0;
let lives = 3;
let speed = 150;
let gameOver = false;

let food = null;
let foodType = null;
const INSECT_TYPES = ['cockroach', 'fly', 'worm', 'cricket', 'ant'];

let obstacles = [];
let particles = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    COLS = Math.floor(canvas.width / CELL);
    ROWS = Math.floor(canvas.height / CELL);
});


// ============================================
// SISTEMA DE ESTRELLAS POR NIVEL (Ratones)
// ============================================

const STAR_REQUIREMENTS = {
    1: [2, 4, 6],       // 1★: 2, 2★: 4, 3★: 6
    2: [2, 5, 7],       // 1★: 2, 2★: 5, 3★: 7
    3: [3, 6, 9],       // 1★: 3, 2★: 6, 3★: 9
    4: [6, 9, 12],      // 1★: 6, 2★: 9, 3★: 12
    5: [14, 20, 27]     // 1★: 14, 2★: 20, 3★: 27
};

function calcularEstrellas(nivel, puntuacion) {
    const reqs = STAR_REQUIREMENTS[nivel] || STAR_REQUIREMENTS[1];
    if (puntuacion >= reqs[2]) return 3;
    if (puntuacion >= reqs[1]) return 2;
    if (puntuacion >= reqs[0]) return 1;
    return 0;
}

// ============================================
// SISTEMA DE ACELERACIÓN (Desde Nivel 3)
// ============================================

function aumentarVelocidad() {
    // Solo aplica desde el nivel 3
    if (typeof currentLevel !== 'undefined' && currentLevel >= 3) {
        // Reduce el tiempo en 2ms (más rápido). 
        // El mínimo es 50ms para que no sea imposible de controlar.
        snakeSpeed = Math.max(50, snakeSpeed - 2);
    }
}