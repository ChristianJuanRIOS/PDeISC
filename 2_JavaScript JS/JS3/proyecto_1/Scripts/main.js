// ============================================
// CONTROL PRINCIPAL DEL JUEGO
// ============================================


function init() {
    if (typeof loadLevel === 'function') {
        loadLevel(currentLevel, () => {
            initSnake();
            initMap();
            spawnFood();
            if (typeof resetFoodBias === 'function') resetFoodBias();
            currentState = GAME_STATE.PLAYING;
        });
    } else {
        initSnake();
        initMap();
        spawnFood();
        if (typeof resetFoodBias === 'function') resetFoodBias();
        currentState = GAME_STATE.PLAYING;
    }
}

function draw() {
    switch (currentState) {
        case GAME_STATE.MENU:
            drawMenu();
            break;
        case GAME_STATE.PLAYING:
            drawMapBackground();
            drawObstacles();
            drawFood();
            drawSnake();
            drawParticles();
            drawHUD();
            break;
        case GAME_STATE.GAME_OVER:
            drawMapBackground();
            drawObstacles();
            drawFood();
            drawSnake();
            drawParticles();
            drawHUD();
            drawGameOverScreen();
            break;
        case GAME_STATE.PAUSED:
            drawMapBackground();
            drawObstacles();
            drawFood();
            drawSnake();
            drawParticles();
            drawHUD();
            drawPaused();
            break;
        case GAME_STATE.CONTROLS:
            drawControls();
            break;
        case GAME_STATE.SETTINGS:
            drawSettings();
            break;
    }
}

// ============================================
// MOUSE — Clicks para el nuevo menú
// ============================================

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Desbloquear audio al primer click
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (!menuMusicStarted && currentState === GAME_STATE.MENU) {
        initAudio();
        startMenuMusic();
        menuMusicStarted = true;
        isMusicPlaying = true;
    }

    // Pasar click al menú si estamos en menú o controles
    if (currentState === GAME_STATE.MENU) {
        if (showingLevelSelect) {
            // En pantalla de niveles: detectar click en tarjetas
            const cardW = Math.min(140, (canvas.width - 60) / 5 - 8);
            const cardH = Math.min(180, canvas.height * 0.42);
            const gap   = 10;
            const totalW = 5 * cardW + 4 * gap;
            const startX = canvas.width / 2 - totalW / 2;
            const cardY  = canvas.height * 0.18;
            for (let i = 0; i < 5; i++) {
    const cx = startX + i * (cardW + gap);
    if (mx >= cx && mx <= cx + cardW && my >= cardY && my <= cardY + cardH) {
        selectedLevel = i;
        // Segundo click confirma
        const nivelElegido = handleLevelSelectInput('Enter');
        if (nivelElegido !== null) {
            currentLevel = nivelElegido;
            playSelectSound();
            init(); // init() ahora se encarga de cambiar el estado
        } else {
            if (typeof triggerLockShake === 'function') triggerLockShake();
        }
    }
}
        } else {
            // En menú principal: detectar click en opciones
            const menuY = canvas.height * 0.7;
            for (let i = 0; i < menuOptions.length; i++) {
                const optY = menuY + i * 48 - 10;
                if (mx >= canvas.width / 2 - 130 && mx <= canvas.width / 2 + 130 &&
                    my >= optY && my <= optY + 40) {
                    selectedOption = i;
                    playSelectSound();
                    if (i === 0) openLevelSelect();
                    else if (i === 1) currentState = GAME_STATE.CONTROLS;
                    else if (i === 2) currentState = GAME_STATE.SETTINGS;
                    else if (i === 3) window.close();
                }
            }
        }
    } else if (currentState === GAME_STATE.CONTROLS) {
        if (typeof handleMenuClick === 'function') handleMenuClick(mx, my);
    }
});

// ============================================
// MOUSE — Hover para efecto de tarjetas
// ============================================

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (currentState === GAME_STATE.MENU || currentState === GAME_STATE.CONTROLS) {
        if (typeof handleMenuHover === 'function') handleMenuHover(mx, my);
    } else {
        canvas.style.cursor = 'default';
    }
});

document.addEventListener('keydown', (e) => {
    const key = e.key;

    switch (currentState) {
        case GAME_STATE.MENU:
    if (showingLevelSelect) {
        // Navegación en pantalla de niveles con flechas/WASD
                const nivelElegido = handleLevelSelectInput(key);
        if (nivelElegido !== null) {
            currentLevel = nivelElegido;
            playSelectSound();
            init(); // init() ahora se encarga de cambiar el estado
        } else if (key === 'Enter') {
            // Shake si el nivel está bloqueado
            if (typeof triggerLockShake === 'function') triggerLockShake();
        }
    } else {
                if (key === 'ArrowUp' || key === 'w' || key === 'W') {
                    selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
                    playMenuSound();
                } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
                    selectedOption = (selectedOption + 1) % menuOptions.length;
                    playMenuSound();
                } else if (key === 'Enter') {
                    playSelectSound();
                    if (selectedOption === 0) openLevelSelect();
                    else if (selectedOption === 1) currentState = GAME_STATE.CONTROLS;
                    else if (selectedOption === 2) currentState = GAME_STATE.SETTINGS;
                    else if (selectedOption === 3) window.close();
                }
            }
            break;

        case GAME_STATE.CONTROLS:
            if (key === 'Escape') {
                playMenuSound();
                if (typeof menuState !== 'undefined') menuState = 'MAIN';
                currentState = GAME_STATE.MENU;  // ✅ LÍNEA AGREGADA
            }
            break;

        case GAME_STATE.SETTINGS:
            if (key === 'Escape') {
                playMenuSound();
                currentState = GAME_STATE.MENU;
            } else if (key === 'ArrowLeft') {
                volume = Math.max(0, volume - 0.1);
                setMusicVolume(volume);
                playMenuSound();
            } else if (key === 'ArrowRight') {
                volume = Math.min(1, volume + 0.1);
                setMusicVolume(volume);
                playMenuSound();
            } else if (key === 'Enter' || key === ' ') {
                soundEnabled = !soundEnabled;
                playSelectSound();
            }
            break;

        case GAME_STATE.PLAYING:
            if (key === 'Escape') {
                playMenuSound();
                currentState = GAME_STATE.MENU;
            } else if (key === 'p' || key === 'P') {
                playMenuSound();
                currentState = GAME_STATE.PAUSED;
            } else if (key === 'ArrowUp' || key === 'w' || key === 'W') {
                changeDirection({ x: 0, y: -1 });
            } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
                changeDirection({ x: 0, y: 1 });
            } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
                changeDirection({ x: -1, y: 0 });
            } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
                changeDirection({ x: 1, y: 0 });
            }
            break;

        case GAME_STATE.PAUSED:
            if (key === 'Escape') {
                playMenuSound();
                currentState = GAME_STATE.MENU;
            } else if (key === 'p' || key === 'P') {
                playMenuSound();
                currentState = GAME_STATE.PLAYING;
            }
            break;

        case GAME_STATE.GAME_OVER:
            if (key === 'ArrowUp' || key === 'w' || key === 'W') {
                if (typeof gameOverOption !== 'undefined') gameOverOption = 0;
            } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
                if (typeof gameOverOption !== 'undefined') gameOverOption = 1;
            } else if (key === 'Enter') {
                playSelectSound();
                if (typeof guardarEstrellasNivel === 'function') {
                    const estrellas = typeof calcularEstrellas === 'function'
                        ? calcularEstrellas(currentLevel, score)
                        : (score >= 30 ? 3 : score >= 15 ? 2 : score >= 5 ? 1 : 0);
                    guardarEstrellasNivel(currentLevel, estrellas);
                }
                if (typeof gameOverOption !== 'undefined' && gameOverOption === 1) {
                    currentState = GAME_STATE.MENU;
                } else {
                    init();
                }
                if (typeof gameOverOption !== 'undefined') gameOverOption = 0;
            } else if (key === 'Escape') {
                playMenuSound();
                if (typeof gameOverOption !== 'undefined') gameOverOption = 0;
                currentState = GAME_STATE.MENU;
            }
            break;
    }
});

// ============================================
// SISTEMA DE MOVIMIENTO INTERPOLADO
// ============================================

let interpT = 0;
let lastStepTime = 0;

function animate(timestamp) {
    const menuScreens = [
        GAME_STATE.MENU,
        GAME_STATE.CONTROLS,
        GAME_STATE.SETTINGS
    ];

    if (menuScreens.includes(currentState)) {
        if (typeof updateSerpienteAnimada === 'function') updateSerpienteAnimada(timestamp);
    }

    //actualizar mini serpiente en selección de niveles
    if (currentState === GAME_STATE.MENU && typeof showingLevelSelect !== 'undefined' && showingLevelSelect) {
        if (typeof updateMiniSnake === 'function') updateMiniSnake(timestamp);
    }

    if (currentState === GAME_STATE.PLAYING) {
        const elapsed = timestamp - lastStepTime;
        interpT = Math.min(elapsed / snakeSpeed, 1);
    }

    draw();
    requestAnimationFrame(animate);
}

function gameLoop(timestamp) {
    if (currentState === GAME_STATE.PLAYING) {
        lastStepTime = performance.now();
        interpT = 0;
        updateSnake();
    }
    setTimeout(gameLoop, snakeSpeed);
}

// Al arrancar solo inicializamos la serpiente para que no explote al dibujar,
// pero nos quedamos en el menú
initSnake();
animate();
gameLoop();